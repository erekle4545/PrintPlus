<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    use HasFactory;
    protected $fillable = [
        'template_id',
        'category_id',
        'status',
    ];
    protected $casts = [
        'meta' => 'array',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at',
        'deleted_at',
    ];


    /**
     * [info description]
     * @return [type] [description]
     */
    public function info()
    {
        return $this->hasOne(ServicesLanguage::class,'service_id','id');
    }

    /**
     * [info description]
     * @return [type] [description]
     */
    public function infos()
    {
        return $this->hasMany(ServicesLanguage::class,'service_id','id');
    }

    /**
     * Page may have multiple covers
     */
    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable');
    }
}
