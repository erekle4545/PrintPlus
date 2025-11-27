<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Language;
use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use App\Models\Core\Post;
use App\Models\Core\Services;
use Illuminate\Http\Request;

class ServicesController extends Controller
{
    public function index(Request  $request)
    {

        $page = Page::query()->whereHas('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->segment(2)]);
        })->first();

        if(is_null($page)){
            abort(404);
        }


        if($page->template_id == config('page.templates.services.id')){
            $projects = Services::where('template_id',$page->template_id)->whereHas('info', function ($query) use ($request) {
                $query->with('covers');
                $query->where(['language_id'=>Language::languageId()]);
            })->paginate(5);
        }else{
            $projects = null;
        }

        $metaKeywords[] = $page->info->meta['meta_keywords'];
        foreach ($metaKeywords as $key => $value) {
            $metaKeywords = implode(', ', $value);
        }

        view()->share('metaKeywords', $metaKeywords);
        view()->share('metaTitle', $page->info->title);
        view()->share('metaDescription', $page->info->description);

        return view('web.pages.service.service_template',[
            'servicesPage'=>$page,
            'services'=>$projects
        ]);

    }





    public function show($slug)
    {
        $id = intval($slug);

        $post = Services::query()->where('id',$id)->whereHas('info', function ($query)  {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId()]);
        })->first();


        if(is_null($post)){
            abort(404);
        }
        if(is_null($post->info)){
            abort(404);
        }

        $page = Page::query()->where('template_id',$post->template_id)->whereHas('info', function ($query)  {
            $query->where(['language_id'=>Language::languageId()]);
        })->first();

        $metaKeywords[] = $post->info->meta['meta_keywords'];
        foreach ($metaKeywords as $key => $value) {
            $metaKeywords = implode(', ', $value);
        }

        view()->share('metaKeywords', $metaKeywords);
        view()->share('metaTitle', $post->info->title);
        view()->share('metaDescription', $post->info->description);

        return view('web.pages.service.show',[
            'services'=>$post,
            'servicesPage'=>$page,
        ]);
    }
}
