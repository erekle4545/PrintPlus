<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuLanguage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'menu_id',
        'language_id',
        'title',
        'description',
        'slug',
        'meta',
    ];

    protected $hidden = [
        'id',
        'menu_id',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public $timestamps = false;

    /**
     * Page may have multiple covers
     */
    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
