<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'date',
        'link',
        'template_id'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function info(){
        return $this->hasOne(GalleryLanguage::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function infos(){
        return $this->hasMany(GalleryLanguage::class);
    }

    public function covers(){
        return $this->morphToMany(Multitenant::getModel('Files'),'coverable')->withPivot('cover_type');
    }
}
