<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductsLanguage extends Model
{
    use HasFactory;
    protected $table = 'products_languages';

    protected $fillable = [
        'products_id',
        'name',
        'slug',
        'language_id',
        'description',
        'text'
    ];


    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');;
    }
}
