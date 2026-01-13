<?php

namespace App\Models\Core;

use App\Models\Core\OrderItem;
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
     * სტატუსის label-ები
     */
    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'მუშავდება',
            'processing' => 'დამუშავებაში',
            'shipped' => 'გაიგზავნა',
            'delivered' => 'მიტანილია',
            'cancelled' => 'გაუქმებულია',
        ];

        return $labels[$this->status] ?? $this->status;
    }

    /**
     * @return mixed
     */
    public function getCityNameAttribute()
    {
        $cities = config('cities.cities');

        foreach ($cities as $city) {
            if ($city['id'] == $this->city_id) {
                return $city['name'];
            }
        }

        return $this->city; // fallback
    }

    /**
     * სტატუსის ფერები
     */
    public function getStatusColorAttribute()
    {
        $colors = [
            'pending' => 'warning',
            'processing' => 'info',
            'shipped' => 'primary',
            'delivered' => 'success',
            'cancelled' => 'danger',
        ];

        return $colors[$this->status] ?? 'secondary';
    }
}
