<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Page extends Model
{
    use HasFactory;


    protected $fillable = [
        'type',
        'template_id',
        'status',
        'tasks',
        'show_home_page',
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
        return $this->hasOne(PageLanguage::class);
    }

    /**
     * [info description]
     * @return [type] [description]
     */
    public function infos()
    {
        return $this->hasMany(PageLanguage::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class,'template_id','template_id');
    }

    /**
     * Page may have multiple covers
     */
    public function covers()
    {
       return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }
}
