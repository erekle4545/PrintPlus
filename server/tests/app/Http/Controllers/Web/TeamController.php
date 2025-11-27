<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Helper;
use App\Helpers\Core\Language;
use App\Http\Controllers\Controller;
use App\Models\Core\Menu;
use App\Models\Core\Page;
use App\Models\Core\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $page = Page::query()->where('template_id',config('page.templates.team.id'))->whereHas('info', function ($query)  {
            $query->with('covers');

            $query->where(['language_id'=>Language::languageId()]);
        })->first();


        $team = Team::query()->whereHas('info', function ($query)  {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId()]);
        })->get();

        if(is_null($page)){
            abort(404);
        }
        if(is_null($page->info)){
            abort(404);
        }

        return view('web.pages.'.Helper::getTemplate('name',$page).'.'.Helper::getTemplate('name',$page).'_template',[
            'page'=>$page,
            'team'=>$team
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

        $team = Team::query()->where('id',$id)->whereHas('info', function ($query)  {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId()]);
        })->first();


        if(is_null($team)){
            abort(404);
        }
        if(is_null($team->info)){
            abort(404);
        }


        $page = Page::query()->where('template_id',config('page.templates.team.id'))->whereHas('info', function ($query)  {

            $query->where(['language_id'=>Language::languageId()]);
        })->first();


        return view('web.pages.team.show',[
            'team'=>$team,
            'page'=>$page,

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
