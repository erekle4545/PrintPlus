<?php

namespace App\Models\Core;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'price',
        'quantity',
        'color',
        'size',
        'extras',
        'materials',
        'custom_dimensions',
        'uploaded_file',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'extras' => 'array',
        'materials' => 'array',
        'custom_dimensions' => 'array',
    ];

    /**
     * შეკვეთის ურთიერთობა
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * პროდუქტის ურთიერთობა
     */
    public function product()
    {
        return $this->belongsTo(Products::class);
    }

    /**
     * ჯამური თანხა
     */
    public function getTotalAttribute()
    {
        return $this->price * $this->quantity;
    }
}
