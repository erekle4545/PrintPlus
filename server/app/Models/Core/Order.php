<?php
namespace App\Models\Core;

use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'city_id',
        'latitude',
        'longitude',
        'notes',
        'payment_method',
        'subtotal',
        'delivery_cost',
        'total',
        'status',

        // Payment fields
        'payment_status',
        'paid_amount',
        'refunded_amount',
        'paid_at',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'subtotal' => 'decimal:2',
        'delivery_cost' => 'decimal:2',
        'total' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',

        // Payment fields casts
        'paid_amount' => 'decimal:2',
        'refunded_amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    protected $appends = [
        'status_label',
        'status_icon',
        'status_color',
        'status_description',
        'city_name',
        'payment_method_name',
        'payment_method_icon',
        'payment_status_label',
        'payment_status_color',
        'payment_details', // NEW
    ];

    /**
     * მომხმარებლის ურთიერთობა
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * შეკვეთის პროდუქტების ურთიერთობა
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Relationship with transactions
     */
    public function transactions()
    {
        return $this->hasMany(Transactions::class);
    }

    /**
     * Get all payment transactions
     */
    public function payments()
    {
        return $this->transactions()->payments();
    }

    /**
     * Get all refund transactions
     */
    public function refunds()
    {
        return $this->transactions()->refunds();
    }

    /**
     * Get successful payment transactions
     */
    public function completedPayments()
    {
        return $this->payments()->completed();
    }

    /**
     * Get pending transactions
     */
    public function pendingTransactions()
    {
        return $this->transactions()->pending();
    }

    /**
     * Get latest transaction
     */
    public function latestTransaction()
    {
        return $this->hasOne(Transactions::class)->latestOfMany();
    }

    /**
     * Check if order is fully paid
     */
    public function isFullyPaid(): bool
    {
        return $this->payment_status === 'paid' && $this->paid_amount >= $this->total;
    }

    /**
     * Check if order has any refunds
     */
    public function hasRefunds(): bool
    {
        return $this->refunded_amount > 0;
    }

    /**
     * Check if order is fully refunded
     */
    public function isFullyRefunded(): bool
    {
        return $this->payment_status === 'refunded' || $this->refunded_amount >= $this->total;
    }

    /**
     * Get available amount for refund
     */
    public function getAvailableRefundAmount(): float
    {
        return max(0, $this->paid_amount - $this->refunded_amount);
    }

    /**
     * Update payment summary from transactions
     * Call this after transaction changes
     */
    public function updatePaymentSummary(): void
    {
        $totalPaid = $this->completedPayments()->sum('amount');
        $totalRefunded = $this->refunds()->completed()->sum('amount');

        // Determine payment status
        $paymentStatus = 'pending';
        if ($totalPaid >= $this->total) {
            $paymentStatus = 'paid';
        }
        if ($totalRefunded > 0) {
            $paymentStatus = $totalRefunded >= $this->total ? 'refunded' : 'partially_refunded';
        }

        $this->update([
            'paid_amount' => $totalPaid,
            'refunded_amount' => $totalRefunded,
            'payment_status' => $paymentStatus,
            'paid_at' => $paymentStatus === 'paid' && !$this->paid_at ? now() : $this->paid_at,
        ]);
    }

    /**
     * სტატუსის label config-დან
     */
    public function getStatusLabelAttribute()
    {
        $statuses = config('order.statuses');

        if (isset($statuses[$this->status])) {
            return $statuses[$this->status]['name'];
        }

        return $this->status;
    }

    /**
     * სტატუსის icon config-დან
     */
    public function getStatusIconAttribute()
    {
        $statuses = config('order.statuses');

        if (isset($statuses[$this->status])) {
            return $statuses[$this->status]['icon'];
        }

        return '';
    }

    /**
     * სტატუსის აღწერა config-დან
     */
    public function getStatusDescriptionAttribute()
    {
        $statuses = config('order.statuses');

        if (isset($statuses[$this->status])) {
            return $statuses[$this->status]['description'];
        }

        return '';
    }

    /**
     * ქალაქის სახელი config-დან
     */
    public function getCityNameAttribute()
    {
        $cities = config('order.cities');

        foreach ($cities as $city) {
            if ($city['id'] == $this->city_id) {
                return $city['name'];
            }
        }

        return $this->city; // fallback
    }

    /**
     * სტატუსის ფერი config-დან
     */
    public function getStatusColorAttribute()
    {
        $statuses = config('order.statuses');

        if (isset($statuses[$this->status])) {
            return $statuses[$this->status]['color'];
        }

        return 'secondary';
    }

    /**
     * გადახდის მეთოდის სახელი config-დან
     */
    public function getPaymentMethodNameAttribute()
    {
        $paymentMethods = config('order.paymentMethods');

        if (isset($paymentMethods[$this->payment_method])) {
            return $paymentMethods[$this->payment_method]['name'];
        }

        return $this->payment_method;
    }

    /**
     * გადახდის მეთოდის icon config-დან
     */
    public function getPaymentMethodIconAttribute()
    {
        $paymentMethods = config('order.paymentMethods');

        if (isset($paymentMethods[$this->payment_method])) {
            return $paymentMethods[$this->payment_method]['icon'];
        }

        return '';
    }

    /**
     * სტატუსის სრული ინფორმაცია config-დან
     */
    public function getStatusInfoAttribute()
    {
        $statuses = config('order.statuses');

        if (isset($statuses[$this->status])) {
            return $statuses[$this->status];
        }

        return [
            'key' => $this->status,
            'name' => $this->status,
            'color' => 'secondary',
            'icon' => '',
            'description' => ''
        ];
    }

    /**
     * Get payment status label
     */
    public function getPaymentStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'მოლოდინში',
            'paid' => 'გადახდილია',
            'failed' => 'ვერ განხორციელდა',
            'partially_refunded' => 'ნაწილობრივ დაბრუნებული',
            'refunded' => 'დაბრუნებული',
        ];

        return $labels[$this->payment_status] ?? $this->payment_status;
    }

    /**
     * Get payment status color
     */
    public function getPaymentStatusColorAttribute()
    {
        $colors = [
            'pending' => 'warning',
            'paid' => 'success',
            'failed' => 'danger',
            'partially_refunded' => 'info',
            'refunded' => 'secondary',
        ];

        return $colors[$this->payment_status] ?? 'secondary';
    }

    /**
     * Get comprehensive payment details (NEW)
     */
    public function getPaymentDetailsAttribute()
    {
        return [
            'payment_status' => $this->payment_status,
            'payment_status_label' => $this->payment_status_label,
            'payment_status_color' => $this->payment_status_color,
            'payment_method' => $this->payment_method,
            'payment_method_name' => $this->payment_method_name,
            'payment_method_icon' => $this->payment_method_icon,
            'total_amount' => (float)$this->total,
            'paid_amount' => (float)$this->paid_amount,
            'refunded_amount' => (float)$this->refunded_amount,
            'remaining_amount' => max(0, (float)$this->total - (float)$this->paid_amount),
            'available_for_refund' => $this->getAvailableRefundAmount(),
            'paid_at' => $this->paid_at?->format('Y-m-d H:i:s'),
            'is_fully_paid' => $this->isFullyPaid(),
            'has_refunds' => $this->hasRefunds(),
            'is_fully_refunded' => $this->isFullyRefunded(),
            'transactions_count' => $this->transactions()->count(),
            'completed_payments_count' => $this->completedPayments()->count(),
            'pending_transactions_count' => $this->pendingTransactions()->count(),
        ];
    }
}

