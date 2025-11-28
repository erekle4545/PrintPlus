<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'slug', 'base_price'];

    public function products()
    {
        return $this->belongsToMany(Products::class, 'product_sizes')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }
}
