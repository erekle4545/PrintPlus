<?php

namespace App\Models;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = [
        'social_name',
        'surname',
        'phone',
        'address',
        'payment_state',
        'status',
        'facebook_correspondence'
    ];

    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }
}
