<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Helper;
use App\Helpers\Core\Language;
use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use App\Models\Core\Post;
use Illuminate\Http\Request;
use thecodeholic\phpmvc\View;


class NewsController extends Controller
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
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->segment(2)]);
        })->first();


        if(is_null($page)){
            abort(404);
        }
        if(is_null($page->info)){
            abort(404);
        }

        if($page->template_id == config('page.templates.news.id')){
            $news = Post::where('template_id',$page->template_id)->whereHas('info', function ($query) use ($request) {
                $query->with('covers');
                $query->where(['language_id'=>Language::languageId()]);
            })->paginate(10);
        }else{
            $news = null;
        }

        return view('web.pages.'.Helper::getTemplate('name',$page).'.'.Helper::getTemplate('name',$page).'_template',[
            'page'=>$page,
            'news'=>$news
        ]);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $id = intval($slug);

        $post = Post::query()->where('id',$id)->whereHas('info', function ($query)  {
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

        $otherPost = Post::query()->where('id','!=',$id)->whereHas('info', function ($query)  {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId()]);
        })->get();

        return view('web.pages.news.show',[
            'news'=>$post,
            'page'=>$page,
            'otherNews'=>$otherPost
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
