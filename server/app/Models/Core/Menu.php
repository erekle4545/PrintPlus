<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class Menu extends Model
{
    use HasFactory , NodeTrait;

    /**
     * @var string[]
     */
    protected $fillable = ['type','page_id','meta','active'];

    /**
     * @var string[]
     */
    protected $casts = [
        'meta'=>'array'
    ];

    /**
     * @var string[]
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function info()
    {
        return $this->hasOne(MenuLanguage::class);
    }

    /**
     * [info description]
     * @return [type] [description]
     */
    public function infos()
    {
        return $this->hasMany(MenuLanguage::class);
    }

    /**
     * [info description]
     * @return [type] [description]
     */
    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    /**
     * Menu may have multiple covers
     */
    public function covers()
    {
        //return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }


    /**
     * [scopeTop description]
     *
     * @param  [type] $query [description]
     * @return [type]        [description]
     */
    public function scopeType($query, $type)
    {
        $query->where('type', $type);
    }

    /**
     * [scopeTop description]
     *
     * @param  [type] $query [description]
     * @return [type]        [description]
     */
    public function scopeActive($query)
    {
        $query->where('active', config('menu.status.active'));
    }

    /**
     * @param  [type]
     * @param  [type]
     * @param  [type]
     * @return [type]
     */
    public function scopeWithAndHas($query, $relation, $closure)
    {
        return $query->whereHas($relation, $closure)->with([$relation => $closure]);
    }
}
