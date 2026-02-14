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
        'category_id',
        'status',
        'price',
        'date',
        'sale_price'
    ];


    /**\
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */

    public function category()
    {
        return $this->hasOne(Category::class,'id','category_id');
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

    // additional
    public function materials()
    {
        return $this->belongsToMany(Material::class, 'product_materials', 'product_id', 'material_id')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'product_sizes', 'product_id', 'size_id')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function colors()
    {
        return $this->belongsToMany(Color::class, 'product_colors', 'product_id', 'color_id')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function extras()
    {
        return $this->belongsToMany(Extra::class, 'product_extras', 'product_id', 'extra_id')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function printTypes()
    {
        return $this->belongsToMany(PrintType::class, 'product_print_type', 'product_id', 'print_type_id')
            ->withPivot('price', 'is_default')
            ->withTimestamps();
    }
    /**
     * Page may have multiple covers
     */
    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot(['cover_type','quantity']);
    }
}
