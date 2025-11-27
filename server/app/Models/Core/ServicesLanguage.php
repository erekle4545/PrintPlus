<?php

namespace App\Models\Core;

use App\Helpers\Core\Multitenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicesLanguage extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'language_id',
        'title',
        'description',
        'text',
        'slug',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /**
     * List table fields that are hidden from result
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * This table does not have timestamps
     *
     * @var boolean
     */
    public $timestamps = false;


    public function covers()
    {
        return $this->morphToMany(Multitenant::getModel('Files'), 'coverable')->withPivot('cover_type');
    }




    public function setTextAttribute($value)
    {
        $this->attributes['text'] = nl2br($value);
    }

    /**
     * Set <br />'s back to new lines
     *
     * @param  string $value
     * @return string
     */
    public function getTextAttribute($value)
    {
        return preg_replace('/<br\s?\/?>/ius', "\n", str_replace("\n","",str_replace("\r","", htmlspecialchars_decode($value))));
        //return preg_replace('/\<br(\s*)?\/?\>/i', "\n", $value);
    }
}
