<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    use HasFactory;
    protected $fillable = [
      'price',
      'total_price',
      'qty',
      'color',
      'order_id',
      'product_id'
    ];

    protected $casts = [
        'color'=>'array'
    ];

    public function product(){
        return $this->belongsTo(Products::class);
    }
}
