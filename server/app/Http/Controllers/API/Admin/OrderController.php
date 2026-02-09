<?php


namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\Order;
use App\Models\Core\OrderItem;
use App\Models\Core\Cover;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * ყველა შეკვეთის მიღება (ადმინისთვის)
     */
    public function index(Request $request)
    {
        // პაგინაციის პარამეტრები
        $perPage = $request->input('per_page', 15);
        $status = $request->input('status');
        $paymentStatus = $request->input('payment_status');
        $search = $request->input('search');

        $query = Order::with(['items.product', 'items.covers', 'user', 'transactions'])
            ->orderBy('created_at', 'desc');

        // სტატუსის ფილტრი
        if ($status) {
            $query->where('status', $status);
        }

        // გადახდის სტატუსის ფილტრი
        if ($paymentStatus) {
            $query->where('payment_status', $paymentStatus);
        }

        // ძებნა
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * კონკრეტული შეკვეთის მიღება (ადმინისთვის)
     */
    public function show($id)
    {
        $order = Order::with([
            'items.product',
            'items.covers',
            'user',
            'transactions' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        // დავამატოთ ტრანზაქციების დეტალური ინფორმაცია
        $transactionsDetails = $order->transactions->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'transaction_id' => $transaction->transaction_id,
                'gateway_transaction_id' => $transaction->gateway_transaction_id,
                'type' => $transaction->type,
                'status' => $transaction->status,
                'amount' => (float)$transaction->amount,
                'currency' => $transaction->currency,
                'description' => $transaction->description,
                'payment_gateway' => $transaction->payment_gateway,
                'initiated_at' => $transaction->initiated_at?->format('Y-m-d H:i:s'),
                'completed_at' => $transaction->completed_at?->format('Y-m-d H:i:s'),
                'failed_at' => $transaction->failed_at?->format('Y-m-d H:i:s'),
                'error_message' => $transaction->error_message,
            ];
        });

        $orderData = $order->toArray();
        $orderData['transactions_details'] = $transactionsDetails;

        return response()->json([
            'success' => true,
            'data' => $orderData,
        ]);
    }

    /**
     * შეკვეთის სტატუსის განახლება (ადმინისთვის)
     */
    public function updateStatus(Request $request, $id)
    {
        // მივიღოთ ყველა ხელმისაწვდომი სტატუსი config-დან
        $allowedStatuses = array_keys(config('order.statuses'));

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:' . implode(',', $allowedStatuses),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'შეცდომა ვალიდაციაში',
                'errors' => $validator->errors(),
            ], 422);
        }

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'სტატუსი წარმატებით განახლდა',
            'data' => $order->load(['items.product', 'items.covers', 'user', 'transactions']),
        ]);
    }

    /**
     * ყველა სტატუსის მიღება (frontend-სთვის)
     */
    public function getStatuses()
    {
        return response()->json([
            'success' => true,
            'data' => config('order.statuses'),
        ]);
    }

    /**
     * გადახდის სტატუსების მიღება (NEW)
     */
    public function getPaymentStatuses()
    {
        $paymentStatuses =config('order.payment_statuses');
        return response()->json([
            'success' => true,
            'data' => $paymentStatuses,
        ]);
    }

    /**
     * შეკვეთის წაშლა (ადმინისთვის)
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $order = Order::findOrFail($id);

            // წავშალოთ შეკვეთის ყველა item-ის covers
            foreach ($order->items as $item) {
                Cover::where('coverable_type', OrderItem::class)
                    ->where('coverable_id', $item->id)
                    ->delete();
            }

            // წავშალოთ შეკვეთის items
            $order->items()->delete();

            // წავშალოთ ტრანზაქციები
            $order->transactions()->delete();

            // წავშალოთ შეკვეთა
            $order->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'შეკვეთა წარმატებით წაიშალა',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order deletion error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'შეკვეთის წაშლისას დაფიქსირდა შეცდომა',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * სტატისტიკა (ადმინისთვის)
     */
    public function statistics()
    {
        // config-დან მივიღოთ სტატუსები
        $statuses = config('order.statuses');

        $stats = [
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('status', 'delivered')->sum('total'),
            'pending_revenue' => Order::whereIn('status', ['pending', 'processing', 'shipped'])->sum('total'),

            // გადახდის სტატისტიკა (NEW)
            'total_paid_amount' => Order::where('payment_status', 'paid')->sum('paid_amount'),
            'total_pending_payments' => Order::where('payment_status', 'pending')->sum('total'),
            'total_refunded_amount' => Order::sum('refunded_amount'),
            'paid_orders_count' => Order::where('payment_status', 'paid')->count(),
            'pending_payments_count' => Order::where('payment_status', 'pending')->count(),
            'failed_payments_count' => Order::where('payment_status', 'failed')->count(),
        ];

        // დინამიურად დავამატოთ თითოეული სტატუსის რაოდენობა
        foreach ($statuses as $key => $status) {
            $stats[$key . '_orders'] = Order::where('status', $key)->count();
        }

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * შეკვეთის ტრანზაქციების მიღება (NEW)
     */
    public function getOrderTransactions($id)
    {
        $order = Order::with(['transactions' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        $transactions = $order->transactions->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'transaction_id' => $transaction->transaction_id,
                'gateway_transaction_id' => $transaction->gateway_transaction_id,
                'type' => $transaction->type,
                'status' => $transaction->status,
                'amount' => (float)$transaction->amount,
                'currency' => $transaction->currency,
                'description' => $transaction->description,
                'payment_gateway' => $transaction->payment_gateway,
                'error_message' => $transaction->error_message,
                'initiated_at' => $transaction->initiated_at?->format('Y-m-d H:i:s'),
                'completed_at' => $transaction->completed_at?->format('Y-m-d H:i:s'),
                'failed_at' => $transaction->failed_at?->format('Y-m-d H:i:s'),
                'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'payment_details' => $order->payment_details,
                'transactions' => $transactions,
            ],
        ]);
    }
}

