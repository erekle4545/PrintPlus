<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'date'
    ];


    public function info()
    {
        return $this->hasOne(CategoryLanguage::class);
    }

    /**
     * [info description]
     * @return [type] [description]
     */
    public function infos()
    {
        return $this->hasMany(CategoryLanguage::class);
    }

    /**
     * Page may have multiple covers
     */
    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');;
    }
}
