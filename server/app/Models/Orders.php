<?php

namespace App\Models;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $fillable = [
        'social_name',
        'surname',
        'phone',
        'address',
        'comments',
        'customer_id',
        'user_id',
        'payment_state',
        'price',
        'delivery_type',
        'delivery_date',
        'facebook_correspondence',
        'delivery_time',
        'card_text',

    ];

    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }

    public function orderItems(){
        return $this->hasMany(OrderItems::class,'order_id','id');
    }
    public function product(){
        return $this->belongsTo(Products::class,'id','product_id');
    }

    public function employees(){
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function customer(){
        return $this->belongsTo(Customer::class,'customer_id','id');
    }
}
