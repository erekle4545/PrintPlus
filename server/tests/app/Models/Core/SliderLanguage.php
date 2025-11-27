<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SliderLanguage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'slider_id',
        'language_id'
    ];

    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');;
    }
}
