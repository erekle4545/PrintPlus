<?php

namespace App\Models\Core;
use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
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
        return $this->hasOne(PostLanguage::class);
    }

    /**
     * [info description]
     * @return [type] [description]
     */
    public function infos()
    {
        return $this->hasMany(PostLanguage::class);
    }

    /**
     * Page may have multiple covers
     */
    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable');
    }
}
