<?php

namespace App\Http\Controllers\API\Web;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\SettingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{

    public function index(Request $request){

        $model = Multitenant::getModel('Settings');

         $settings= $model::
              whereHas('info', function ($query) use ($request) {
                 $query->where('language_id', $request->language_id);
             })->with(
             ['info' => function ($query) use ($request) {
                 $query->where('language_id', $request->language_id);
             },'info.covers'])
             ->first();



        return new SettingResource($settings);
    }
}
