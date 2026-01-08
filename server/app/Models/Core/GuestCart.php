<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestCart extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'product_id',
        'name',
        'price',
        'quantity',
        'color',
        'size',
        'materials',
        'print_type',
        'extras',
        'custom_dimensions',
        'uploaded_file',
        'image',
        'discount',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'discount' => 'decimal:2',
        'extras' => 'array',
        'custom_dimensions' => 'array',
    ];

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
    }}
