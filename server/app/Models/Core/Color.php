<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'slug', 'base_price'];

    public function products()
    {

        return $this->belongsToMany(Products::class, 'product_colors')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }
}
