<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Order;
use App\Models\Core\Transactions;

use App\Services\BogPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    private $bogPayment;

    public function __construct(BogPaymentService $bogPayment)
    {
        $this->bogPayment = $bogPayment;
    }

    /**
     * Initialize payment process
     * Creates a transaction record and initiates payment with BOG
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function initializePayment(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'language' => 'nullable|in:ka,en,ru',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Check if order is already paid
        if ($order->isFullyPaid()) {
            return response()->json([
                'success' => false,
                'message' => 'Order already paid',
            ], 400);
        }

        // Check authorization
        $user = $request->user();
        if ($user && $order->user_id && $order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to order',
            ], 403);
        }

        DB::beginTransaction();
        try {
            // Create transaction record
            $transaction = Transactions::create([
                'order_id' => $order->id,
                'payment_gateway' => 'bog',
                'type' => 'payment',
                'status' => 'pending',
                'amount' => $order->total,
                'currency' => 'GEL',
                'description' => "Payment for Order #{$order->order_number}",
                'customer_ip' => $request->ip(),
                'initiated_at' => now(),
            ]);

            // Build callback URL
            $callBackUrl = config('services.bog.callback_url');
            $returnUrl = config('services.bog.return_url');
            // Initialize payment in BOG system
            $result = $this->bogPayment->initializePayment(
                $order->id,
                $order->total,
                "Order #{$order->order_number} - " . config('app.name'),
                $callBackUrl,
                $returnUrl,
                $request->input('language', 'ka')
            );


            if ($result['success']) {

                // Update transaction with BOG payment ID
                $transaction->update([
                    'gateway_transaction_id' => $result['payment_id'],
                    'status' => 'processing',
                    'request_data' => [
                        'language' => $request->input('language', 'ka'),
                        'return_url' => $returnUrl,
                    ],
                    'response_data' => $result,
                ]);

                // Update order payment method
                $order->update([
                    'payment_method' => 'bog_card',
                ]);

                DB::commit();

//                Log::info('Payment initialized', [
//                    'transaction_id' => $transaction->transaction_id,
//                    'order_id' => $order->id,
//                    'payment_id' => $result['payment_id'],
//                ]);

                return response()->json([
                    'success' => true,
                    'payment_url' => $result['payment_url'],
                    'transaction_id' => $transaction->transaction_id,
                    'gateway_transaction_id' => $result['payment_id'],
                    'order_id' => $order->id,
                ]);
            }

            // Payment initialization failed
            $transaction->markAsFailed(
                $result['error'] ?? 'Payment initialization failed',
                $result
            );

            DB::commit();

            Log::error('Payment initialization failed', [
                'transaction_id' => $transaction->transaction_id,
                'order_id' => $order->id,
                'error' => $result['error'],
            ]);

            return response()->json([
                'success' => false,
                'message' => $result['error'],
            ], 400);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Payment initialization exception', [
                'error' => $e->getMessage(),
                'order_id' => $order->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred during payment initialization',
            ], 500);
        }
    }

    /**
     * Handle callback from BOG after payment attempt
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function callback(Request $request)
    {

        // BOG sends data in a nested structure
        $body = $request->input('body');

        if (!$body) {
            Log::error('Invalid BOG callback - missing body', ['request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid callback structure',
            ], 400);
        }

        $paymentId = $body['order_id']; // BOG's internal order_id
        $externalOrderId = $body['external_order_id']; // Your order ID
        $orderStatus = $body['order_status']['key']; // 'completed', 'rejected', 'pending', etc.
        $paymentDetail = $body['payment_detail'];

        // Find transaction by gateway payment ID or external order ID
        $transaction = Transactions::where('gateway_transaction_id', $paymentId)
            ->orWhere('order_id', $externalOrderId)
            ->first();

        if (!$transaction) {
            Log::error('Transaction not found for BOG callback', [
                'bog_order_id' => $paymentId,
                'external_order_id' => $externalOrderId,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        $order = $transaction->order;

        DB::beginTransaction();
        try {
            // Update transaction with full callback data
            $transaction->update([
                'callback_data' => $request->all(),
                'gateway_transaction_id' => $paymentId, // Ensure it's set
            ]);

            if ($orderStatus === 'completed') {
                // Payment successful
                $transaction->markAsCompleted([
                    'transaction_id' => $paymentDetail['pg_trx_id'] ?? null,
                    'auth_code' => $paymentDetail['auth_code'] ?? null,
                    'card_type' => $paymentDetail['card_type'] ?? null,
                    'transfer_method' => $paymentDetail['transfer_method']['key'] ?? null,
                ]);

                // Update order payment summary
                $order->updatePaymentSummary();

                // Update order status to processing if it's pending
                if ($order->status === 'pending') {
                    $order->update(['status' => 'processing']);
                }

                Log::info('BOG Payment completed successfully', [
                    'transaction_id' => $transaction->transaction_id,
                    'order_id' => $order->id,
                    'amount' => $transaction->amount,
                    'pg_trx_id' => $paymentDetail['pg_trx_id'] ?? null,
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                ]);

            } elseif ($orderStatus === 'rejected') {
                // Payment rejected
                $rejectReason = $body['reject_reason'] ?? 'Payment rejected';
                $errorCode = $paymentDetail['code'] ?? null;
                $errorDescription = $paymentDetail['code_description'] ?? null;

                $errorMessage = $errorDescription
                    ? "{$rejectReason} (Code: {$errorCode} - {$errorDescription})"
                    : $rejectReason;

                $transaction->markAsFailed($errorMessage, [
                    'reject_reason' => $rejectReason,
                    'error_code' => $errorCode,
                    'error_description' => $errorDescription,
                    'card_type' => $paymentDetail['card_type'] ?? null,
                    'pg_trx_id' => $paymentDetail['pg_trx_id'] ?? null,
                ]);

                $order->update(['payment_status' => 'failed']);

//                Log::warning('BOG Payment rejected', [
//                    'transaction_id' => $transaction->transaction_id,
//                    'order_id' => $order->id,
//                    'reason' => $rejectReason,
//                    'error_code' => $errorCode,
//                ]);

                DB::commit();

                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                ]);

            } else {
                // Other statuses (pending, cancelled, etc.)
                $transaction->update([
                    'status' => $orderStatus,
                ]);

//                Log::info('BOG Payment status updated', [
//                    'transaction_id' => $transaction->transaction_id,
//                    'status' => $orderStatus,
//                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => "Payment status: {$orderStatus}",
                ]);
            }

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error processing BOG callback', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'transaction_id' => $transaction->transaction_id ?? null,
                'bog_order_id' => $paymentId,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error processing callback',
            ], 500);
        }
    }

    /**
     * Handle webhook from BOG
     * BOG sends webhooks for real-time payment status updates
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function webhook(Request $request)
    {
        // Get signature from header
        $signature = $request->header('X-BOG-Signature');

        if (!$signature) {
            Log::warning('BOG webhook received without signature');
            return response()->json(['error' => 'Missing signature'], 400);
        }

        // Validate signature
        if (!$this->bogPayment->validateWebhookSignature($request->all(), $signature)) {
            Log::warning('Invalid BOG webhook signature', [
                'data' => $request->all(),
                'signature' => $signature,
            ]);
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $orderId = $request->input('external_order_id'); // Our order ID
        $bogOrderId = $request->input('order_id'); // BOG order ID
        $status = $request->input('status');

        Log::info('BOG webhook received', [
            'order_id' => $orderId,
            'bog_order_id' => $bogOrderId,
            'status' => $status,
        ]);

        // Find transaction
        $transaction = Transactions::where('order_id', $orderId)
            ->where('gateway_transaction_id', $bogOrderId)
            ->first();

        if (!$transaction) {
            Log::error('Transaction not found for BOG webhook', [
                'order_id' => $orderId,
                'bog_order_id' => $bogOrderId,
            ]);
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        DB::beginTransaction();
        try {
            // Update transaction based on webhook status
            switch ($status) {
                case 'COMPLETED':
                    if (!$transaction->isCompleted()) {
                        $transaction->markAsCompleted($request->all());
                        $transaction->order->updatePaymentSummary();

                        if ($transaction->order->status === 'pending') {
                            $transaction->order->update(['status' => 'processing']);
                        }

                        Log::info('Payment completed via webhook', [
                            'transaction_id' => $transaction->transaction_id,
                        ]);
                    }
                    break;

                case 'REJECTED':
                    if (!$transaction->hasFailed()) {
                        $transaction->markAsFailed(
                            $request->input('reject_reason', 'Payment rejected'),
                            $request->all()
                        );

                        Log::warning('Payment rejected via webhook', [
                            'transaction_id' => $transaction->transaction_id,
                            'reason' => $request->input('reject_reason'),
                        ]);
                    }
                    break;

                case 'CANCELLED':
                    if (!$transaction->hasFailed()) {
                        $transaction->markAsCancelled();

                        Log::info('Payment cancelled via webhook', [
                            'transaction_id' => $transaction->transaction_id,
                        ]);
                    }
                    break;
            }

            DB::commit();

            return response()->json(['success' => true], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error processing BOG webhook', [
                'error' => $e->getMessage(),
                'transaction_id' => $transaction->transaction_id ?? null,
            ]);

            return response()->json(['error' => 'Processing error'], 500);
        }
    }

    /**
     * Check payment status manually
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkStatus(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|exists:transactions,transaction_id',
        ]);

        $transaction = Transactions::byTransactionId($request->transaction_id)->firstOrFail();
        $order = $transaction->order;

        // Check authorization
        $user = $request->user();
        if ($user && $order->user_id && $order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access',
            ], 403);
        }

        if (!$transaction->gateway_transaction_id) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not initialized with gateway',
            ], 400);
        }

        // Query BOG for current payment status
        $result = $this->bogPayment->checkPaymentStatus($transaction->gateway_transaction_id);

        if ($result['success']) {
            DB::beginTransaction();
            try {
                // Update transaction if status changed
                if ($result['status'] === 'success' && !$transaction->isCompleted()) {
                    $transaction->markAsCompleted($result['data']);
                    $order->updatePaymentSummary();

                    if ($order->status === 'pending') {
                        $order->update(['status' => 'processing']);
                    }
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'transaction' => [
                        'id' => $transaction->transaction_id,
                        'status' => $transaction->status,
                        'amount' => $transaction->amount,
                        'completed_at' => $transaction->completed_at,
                    ],
                    'order' => [
                        'id' => $order->id,
                        'payment_status' => $order->payment_status,
                        'paid_amount' => $order->paid_amount,
                    ],
                ]);

            } catch (\Exception $e) {
                DB::rollBack();

                Log::error('Error updating transaction status', [
                    'transaction_id' => $transaction->transaction_id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'message' => $result['error'] ?? 'Failed to check payment status',
        ], 400);
    }

    /**
     * Process refund for a transaction
     * Admin only
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function refund(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|exists:transactions,transaction_id',
            'amount' => 'nullable|numeric|min:0.01',
            'reason' => 'nullable|string|max:500',
        ]);

        $paymentTransaction = Transactions::byTransactionId($request->transaction_id)
            ->payments()
            ->firstOrFail();

        // Check if transaction can be refunded
        if (!$paymentTransaction->canBeRefunded()) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction cannot be refunded',
            ], 400);
        }

        $refundAmount = $request->input('amount', $paymentTransaction->getAvailableRefundAmount());

        // Validate refund amount
        if ($refundAmount > $paymentTransaction->getAvailableRefundAmount()) {
            return response()->json([
                'success' => false,
                'message' => 'Refund amount exceeds available amount',
                'available_amount' => $paymentTransaction->getAvailableRefundAmount(),
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Create refund transaction record
            $refundTransaction = Transactions::create([
                'order_id' => $paymentTransaction->order_id,
                'payment_gateway' => $paymentTransaction->payment_gateway,
                'parent_transaction_id' => $paymentTransaction->id,
                'type' => 'refund',
                'status' => 'pending',
                'amount' => $refundAmount,
                'currency' => $paymentTransaction->currency,
                'description' => $request->input('reason', 'Refund for transaction ' . $paymentTransaction->transaction_id),
                'customer_ip' => $request->ip(),
                'initiated_at' => now(),
            ]);

            // Process refund through BOG
            $result = $this->bogPayment->refundPayment(
                $paymentTransaction->gateway_transaction_id,
                $refundAmount
            );

            if ($result['success']) {
                // Update refund transaction
                $refundTransaction->update([
                    'gateway_transaction_id' => $result['refund_id'],
                    'status' => 'completed',
                    'completed_at' => now(),
                    'refunded_at' => now(),
                    'response_data' => $result['data'],
                ]);

                // Update order payment summary
                $paymentTransaction->order->updatePaymentSummary();

                DB::commit();

                Log::info('Refund processed', [
                    'refund_transaction_id' => $refundTransaction->transaction_id,
                    'payment_transaction_id' => $paymentTransaction->transaction_id,
                    'amount' => $refundAmount,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Refund processed successfully',
                    'refund_transaction' => [
                        'id' => $refundTransaction->transaction_id,
                        'amount' => $refundTransaction->amount,
                        'status' => $refundTransaction->status,
                    ],
                ]);
            }

            // Refund failed
            $refundTransaction->markAsFailed(
                $result['error'] ?? 'Refund failed',
                $result
            );

            DB::commit();

            return response()->json([
                'success' => false,
                'message' => $result['error'] ?? 'Refund failed',
            ], 400);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Refund exception', [
                'transaction_id' => $paymentTransaction->transaction_id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred during refund',
            ], 500);
        }
    }

    /**
     * Get transaction details
     *
     * @param string $transactionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTransactionDetails(string $transactionId)
    {
        $transaction = Transactions::with(['order', 'parentTransaction', 'refunds'])
            ->byTransactionId($transactionId)
            ->firstOrFail();

        // Check authorization
        $user = request()->user();
        if ($user && $transaction->order->user_id && $transaction->order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'transaction' => [
                'id' => $transaction->transaction_id,
                'gateway_transaction_id' => $transaction->gateway_transaction_id,
                'type' => $transaction->type,
                'status' => $transaction->status,
                'amount' => $transaction->amount,
                'currency' => $transaction->currency,
                'description' => $transaction->description,
                'payment_gateway' => $transaction->payment_gateway,
                'initiated_at' => $transaction->initiated_at,
                'completed_at' => $transaction->completed_at,
                'failed_at' => $transaction->failed_at,
                'refunded_at' => $transaction->refunded_at,
                'error_message' => $transaction->error_message,
                'total_refunded' => $transaction->getTotalRefundedAmount(),
                'available_for_refund' => $transaction->getAvailableRefundAmount(),
                'refunds' => $transaction->refunds->map(fn($r) => [
                    'id' => $r->transaction_id,
                    'amount' => $r->amount,
                    'status' => $r->status,
                    'created_at' => $r->created_at,
                ]),
            ],
            'order' => [
                'id' => $transaction->order->id,
                'order_number' => $transaction->order->order_number,
                'total' => $transaction->order->total,
                'payment_status' => $transaction->order->payment_status,
                'paid_amount' => $transaction->order->paid_amount,
                'refunded_amount' => $transaction->order->refunded_amount,
            ],
        ]);
    }

    /**
     * Get all transactions for an order
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrderTransactions(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::with('transactions')->findOrFail($request->order_id);

        // Check authorization
        $user = $request->user();
        if ($user && $order->user_id && $order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'transactions' => $order->transactions->map(fn($t) => [
                'id' => $t->transaction_id,
                'type' => $t->type,
                'status' => $t->status,
                'amount' => $t->amount,
                'payment_gateway' => $t->payment_gateway,
                'description' => $t->description,
                'created_at' => $t->created_at,
                'completed_at' => $t->completed_at,
            ]),
            'summary' => [
                'total_payments' => $order->completedPayments()->sum('amount'),
                'total_refunds' => $order->refunds()->completed()->sum('amount'),
                'pending_transactions' => $order->pendingTransactions()->count(),
            ],
        ]);
    }
}
