<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Helper;
use App\Helpers\Core\Language;
use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryResource;
use App\Models\Core\Gallery;
use App\Models\Core\Page;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $page =Page::query()->where('template_id',config('page.templates.gallery.id'))->whereHas('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->segment(2)]);
        })->first();


        if(is_null($page)){
            abort(404);
        }
        if(is_null($page->info)){
            abort(404);
        }

        $imageGallery = Gallery::query()->where('link',null)->with('info',function ($query){
            $query->with('covers');
            $query->where('language_id',Language::languageId());
        })->paginate(9);

        $imageVideo = Gallery::query()->where('link',"!=",null)->with('info',function ($query){
            $query->with('covers');
            $query->where('language_id',Language::languageId());
        })->paginate(9);


        return view('web.pages.'.Helper::getTemplate('name',$page).'.'.Helper::getTemplate('name',$page).'_template',[
            'page'=>$page,
            'image'=>$imageGallery,
            'video'=>$imageVideo
        ]);
    }


    public function getGallery (Request $request){

        $requestMethod = $request->type;
        $resultData = [];
        if(isset($requestMethod) && $requestMethod==='video'){
            $gallery = Gallery::query()->where('link','!=',null)->with('info',function ($query){
                $query->with('covers');
                $query->where('language_id',Language::languageId());
            });

        }elseif(isset($requestMethod) && $requestMethod==='image'){
            $gallery = Gallery::query()->where('link',null)->with('info',function ($query){
                $query->with('covers');
                $query->where('language_id',Language::languageId());
            });
        }

        return new GalleryResource($gallery->paginate(10));

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

        $gallery = Gallery::where('id',$id)->with('info',function ($query){
            $query->with('covers');
            $query->where('language_id',Language::languageId());
        })->first();

        return view('web.pages.gallery.show',[
            'gallery'=>$gallery
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
