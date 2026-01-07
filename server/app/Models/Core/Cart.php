<?php

namespace App\Models\Core;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'name',
        'image',
        'price',
        'quantity',
        'color',
        'size',
        'extras',
        'materials',
        'print_type',
        'custom_dimensions',
        'uploaded_file',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'materials'=>'string',
        'print_type'=>'string',
        'extras' => 'array',
        'custom_dimensions' => 'array',
    ];

    /**
     * მომხმარებლის ურთიერთობა
     */
    public function user()
    {
        return $this->belongsTo(User::class);
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
    }}
