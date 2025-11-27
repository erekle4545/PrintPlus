<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'page_id',
        'status',
        'price',
        'date',
        'sale_price'
    ];


    /**\
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */

    public function page()
    {
        return $this->hasOne(Page::class,'id','page_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */

    public function info()
    {
        return $this->hasOne(ProductsLanguage::class);
    }
    /**
     * [info description]
     * @return [type] [description]
     */
    public function infos()
    {
        return $this->hasMany(ProductsLanguage::class);
    }

    /**
     * Page may have multiple covers
     */
    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }
}
