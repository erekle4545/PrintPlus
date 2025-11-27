<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Helper;
use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Helpers\Core\Language;
use App\Models\Core\Menu;
use App\Models\Core\MenuLanguage;
use App\Models\Core\Page;
use App\Models\Core\PageLanguage;
use App\Models\Core\PostLanguage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class SearchController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function searchResult(Request $request)
    {
        $searched = [];

        $word = isset($request->keyword) ? $request->keyword : null;

        $content = PostLanguage::query();
        if (!is_null($word)) {
            $content->where('title', 'LIKE', '%'.$word.'%');
            $content->orWhere('text', 'LIKE', '%'.$word.'%');
            $content->orWhere('description', 'LIKE', '%'.$word.'%');
        }
        $content = $content->select('*')->where('language_id', Language::languageId())->get();

        if ($content->count()) {
            foreach ($content as $key => $value) {
                $page = Page::where('template_id', Config('page.templates.news.id'))->first();
                $menu = Menu::where('page_id', $page->id)->first();
                $menu_slug = MenuLanguage::where('menu_id', $menu->id)->first();
                $menu_slug = $menu_slug->slug;

                $searched[] = '<li class="search-box-list"><a class="search-box-link" href="'.URL::to(Language::current().'/'.$menu_slug.'/'.$value['post_id'].'-'.$value['slug']).'">'.$value['title'].'</a><div>'.Language::translate('article').'</div></li>';
            }
        }


        $textPage = PageLanguage::query();
        if (!is_null($word)) {
            $textPage->where('title', 'LIKE', '%'.$word.'%');
            $textPage->orWhere('text', 'LIKE', '%'.$word.'%');
            $textPage->orWhere('description', 'LIKE', '%'.$word.'%');
        }
        $textPage = $textPage->select('*')->where('language_id', Language::languageId())->get();

        if ($textPage->count()) {
            foreach ($textPage as $key => $value) {
                $menu = Menu::where('page_id', $value->page_id)->first();
                if($menu != null) {
                    $menu_slug = MenuLanguage::where('menu_id', $menu->id)->first();
                    $menu_slug = $menu_slug->slug;

                    if($menu->parent_id) {
                        $page_slug = MenuLanguage::where('menu_id', $menu->parent_id)->first();
                        $menu_slug = $page_slug->slug.'/'.$menu_slug;
                    }
                }

                $searched[] = ' <li  class="search-box-list"><a class="search-box-link" href="'.url(Language::current().'/'.$menu_slug).'">'.$value['title'].'</a><div>'.Language::translate('page').'</div></li>';
            }
        }

        return $word != null && $searched != null?response()->json($searched): response()->json(Language::translate('no-result'));

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
    public function show($id)
    {
        //
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
