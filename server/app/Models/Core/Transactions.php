<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transactions extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'transaction_id',
        'payment_gateway',
        'gateway_transaction_id',
        'type',
        'status',
        'amount',
        'currency',
        'parent_transaction_id',
        'request_data',
        'response_data',
        'callback_data',
        'description',
        'error_message',
        'customer_ip',
        'initiated_at',
        'completed_at',
        'failed_at',
        'refunded_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'request_data' => 'array',
        'response_data' => 'array',
        'callback_data' => 'array',
        'initiated_at' => 'datetime',
        'completed_at' => 'datetime',
        'failed_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    /**
     * Boot method - auto-generate transaction_id
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (empty($transaction->transaction_id)) {
                $transaction->transaction_id = self::generateTransactionId();
            }

            if (empty($transaction->initiated_at)) {
                $transaction->initiated_at = now();
            }
        });
    }

    /**
     * Generate unique transaction ID
     * Format: TXN-YYYYMMDD-RANDOM
     */
    public static function generateTransactionId(): string
    {
        do {
            $id = 'TXN-' . date('Ymd') . '-' . strtoupper(Str::random(8));
        } while (self::where('transaction_id', $id)->exists());

        return $id;
    }

    /**
     * Relationship with order
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Relationship with parent transaction (for refunds)
     */
    public function parentTransaction()
    {
        return $this->belongsTo(Transactions::class, 'parent_transaction_id');
    }

    /**
     * Relationship with child transactions (refunds of this payment)
     */
    public function refunds()
    {
        return $this->hasMany(Transactions::class, 'parent_transaction_id')
            ->where('type', 'refund');
    }

    /**
     * Check if transaction is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if transaction is pending
     */
    public function isPending(): bool
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    /**
     * Check if transaction has failed
     */
    public function hasFailed(): bool
    {
        return in_array($this->status, ['failed', 'cancelled']);
    }

    /**
     * Mark transaction as completed
     */
    public function markAsCompleted(array $responseData = []): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'response_data' => $responseData,
        ]);
    }

    /**
     * Mark transaction as failed
     */
    public function markAsFailed(string $errorMessage, array $responseData = []): void
    {
        $this->update([
            'status' => 'failed',
            'failed_at' => now(),
            'error_message' => $errorMessage,
            'response_data' => $responseData,
        ]);
    }

    /**
     * Mark transaction as cancelled
     */
    public function markAsCancelled(): void
    {
        $this->update([
            'status' => 'cancelled',
            'failed_at' => now(),
        ]);
    }

    /**
     * Get total refunded amount for this transaction
     */
    public function getTotalRefundedAmount(): float
    {
        return $this->refunds()
            ->where('status', 'completed')
            ->sum('amount');
    }

    /**
     * Check if transaction can be refunded
     */
    public function canBeRefunded(): bool
    {
        if ($this->type !== 'payment' || !$this->isCompleted()) {
            return false;
        }

        $refundedAmount = $this->getTotalRefundedAmount();
        return $refundedAmount < $this->amount;
    }

    /**
     * Get available amount for refund
     */
    public function getAvailableRefundAmount(): float
    {
        if (!$this->canBeRefunded()) {
            return 0;
        }

        return $this->amount - $this->getTotalRefundedAmount();
    }

    /**
     * Scope: Get by transaction ID
     */
    public function scopeByTransactionId($query, string $transactionId)
    {
        return $query->where('transaction_id', $transactionId);
    }

    /**
     * Scope: Get by gateway transaction ID
     */
    public function scopeByGatewayTransactionId($query, string $gatewayTransactionId)
    {
        return $query->where('gateway_transaction_id', $gatewayTransactionId);
    }

    /**
     * Scope: Get successful transactions
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope: Get pending transactions
     */
    public function scopePending($query)
    {
        return $query->whereIn('status', ['pending', 'processing']);
    }

    /**
     * Scope: Get payments only
     */
    public function scopePayments($query)
    {
        return $query->where('type', 'payment');
    }

    /**
     * Scope: Get refunds only
     */
    public function scopeRefunds($query)
    {
        return $query->where('type', 'refund');
    }
}
