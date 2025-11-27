<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Helper;
use App\Helpers\Core\Language;
use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use Illuminate\Http\Request;

class TextController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $page =Page::query()->where('template_id',config('page.templates.text.id'))->whereHas('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->segment(2)]);
        })->first();


        if(is_null($page)){
            abort(404);
        }
        if(is_null($page->info)){
            abort(404);
        }

        return view('web.pages.'.Helper::getTemplate('name',$page).'.'.Helper::getTemplate('name',$page).'_template',[
            'page'=>$page
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
    public function show(Request $request,$id)
    {
        $page =Page::query()->where('template_id',config('page.templates.text.id'))->whereHas('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->segment(3)]);
        })->first();


        if(is_null($page)){
            abort(404);
        }
        if(is_null($page->info)){
            abort(404);
        }

        return view('web.pages.'.Helper::getTemplate('name',$page).'.'.Helper::getTemplate('name',$page).'_template',[
            'page'=>$page
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
