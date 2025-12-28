<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrintType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'base_price'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function products()
    {
        return $this->belongsToMany(Products::class, 'product_print_type')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }


}
