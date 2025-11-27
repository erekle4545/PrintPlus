<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Helper;
use App\Helpers\Core\Language;
use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use Illuminate\Http\Request;

class AboutController extends Controller
{

     public function index(Request $request)
     {
         $page =Page::query()->whereHas('info', function ($query) use ($request) {
             $query->with('covers');
             $query->where(['language_id'=>Language::languageId(),'slug'=>$request->segment(2)]);
         })->first();


         if(is_null($page)){
             abort(404);
         }
         if(is_null($page->info)){
             abort(404);
         }

         return view('web.pages.'.Helper::getTemplate('name',$page).'.'.Helper::getTemplate('name',$page).'',[
             'page'=>$page
         ]);
     }
}
