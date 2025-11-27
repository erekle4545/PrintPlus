<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Files extends Model
{
    use HasFactory;

    const TYPE_RESIZE = 'resize';
    const UPDATED_AT = null;
    protected $fillable = ['name','type','path','data','extension','output_path','folder_id','user_id'];

    protected $appends = [ 'cover_type'];

    public function getCovertypeAttribute()
    {
        if (!is_null($this->pivot)) {
            return $this->pivot->cover_type;
        }
    }


}
