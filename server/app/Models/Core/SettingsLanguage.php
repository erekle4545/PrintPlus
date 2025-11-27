<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SettingsLanguage extends Model
{
    use HasFactory;

    protected $fillable = [
        'address',
        'title',
        'settings_id',
        'description',
        'language_id'
    ];

    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }
}
