<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dictionary extends Model
{
    use HasFactory;
    protected $table = 'dictionaries';

    protected $fillable = [
        'word'
    ];


    public function info()
    {
        return $this->hasOne(DictionaryLanguage::class);
    }

    /**
     * [info description]
     * @return [type] [description]
     */
    public function infos()
    {
        return $this->hasMany(DictionaryLanguage::class);
    }
}
