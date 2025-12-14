<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'value',
        'type',
        'colors',
        'base_price'
    ];

    protected $casts = [
        'colors' => 'array',
        'base_price' => 'decimal:2'
    ];

    public function products()
    {

        return $this->belongsToMany(Products::class, 'product_colors')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }
}
