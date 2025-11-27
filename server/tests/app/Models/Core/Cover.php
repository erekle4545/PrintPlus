<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cover extends Model
{
    use HasFactory;

    protected $table = 'coverables';

    public $timestamps = false;

    protected $fillable = [
        'files_id',
        'cover_type',
        'coverable_type',
        'coverable_id'
    ];

    protected  $hidden = [
        'created_at',
        'update_at'
    ];

    public function coverable()
    {
        return $this->morphTo();
    }

    public function getFirstNameAttribute($value)
    {
        return ucfirst($value);
    }

}
