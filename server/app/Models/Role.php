<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $guarded = [];
   // protected $fillable = ['id','companyName', 'id_number', 'phone', 'address', 'date'];

    public function permissions(){
        return $this->belongsToMany(Permission::class);
    }
}
