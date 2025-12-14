<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'width',
        'height',
        'value',
        'base_price'
    ];

    protected $casts = [
        'width' => 'integer',
        'height' => 'integer',
        'base_price' => 'decimal:2'
    ];

    public function products()
    {
        return $this->belongsToMany(Products::class, 'product_sizes')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }
}
