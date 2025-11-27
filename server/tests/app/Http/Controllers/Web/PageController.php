<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Helper;
use App\Helpers\Core\Language;
use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use App\Models\Core\Post;
use Illuminate\Http\Request;


class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $page =Page::query()->whereHas('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->slug]);
        })->with('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->slug]);
        })->first();


        if(is_null($page)){
            abort(404);
        }
        if(is_null($page->info)){
            abort(404);
        }



        $metaKeywords[] = $page->info->meta['meta_keywords'];
        foreach ($metaKeywords as $key => $value) {
            $metaKeywords = implode(', ', $value);
        }


        view()->share('metaKeywords', $metaKeywords);
        view()->share('metaTitle', $page->info->title);
        view()->share('metaDescription', $page->info->description);


        return view('web.pages.'.Helper::getTemplate('name',$page).'.'.Helper::getTemplate('name',$page).'_template',[
                'page'=>$page
        ]);
    }

}
