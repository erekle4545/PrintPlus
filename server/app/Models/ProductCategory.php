<?php

namespace App\Models;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;
    protected $fillable = ['status','title','slug','description'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }
}
