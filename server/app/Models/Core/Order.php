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
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'subtotal' => 'decimal:2',
        'delivery_cost' => 'decimal:2',
        'total' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
}
