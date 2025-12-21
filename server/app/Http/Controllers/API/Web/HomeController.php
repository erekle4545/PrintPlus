<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use App\Models\Core\Slider;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $locale = $request->input('locale', 'ka');

        $languageId = 1;
        // language
        switch ($locale) {
            case 'ka':
                $languageId =  1;
                break;
            case 'en':
                $languageId =  2;
                break;
            case 'ru':
                $languageId =  3;
                break;
        }


        // text pages
        $homeTextPages = Page::query()
            ->where('template_id',config('page.templates.text.id'))
            ->where('show_home_page',1)->with('info',function($q) use ($languageId) {
            $q->where('language_id', $languageId);
            $q->with('covers');
            $q->select(['title','slug','page_id','language_id']);
        })
        ->select(['id','template_id'])
        ->get();

        // about page
        $aboutPage = Page::query()
            ->where('template_id',config('page.templates.about.id'))
            ->where('show_home_page',1)->with('info',function($q) use ($languageId) {
            $q->where('language_id', $languageId);
            $q->with('covers');
            $q->select(['id','title','description','slug','page_id','language_id']);
        })
        ->select(['id','template_id'])->first();


        // services
        $homeServices = Page::query()
            ->where('template_id',config('page.templates.services.id'))
            ->where('show_home_page',1)->with(['info'=>function($q) use ($languageId) {
                $q->where('language_id', $languageId);
                $q->with('covers');
                $q->select(['id','title','slug','page_id','language_id']);
            },
              'categories' => function ($qu) use ($languageId) {
                    $qu->with([
                        'info' => function ($q) use ($languageId) {
                            $q->where('language_id', $languageId)
                                ->with('covers');
                        }
                    ]);
                }
            ])
            ->select(['id','template_id'])
            ->first();

        return response()->json([
            'text_pages' => $homeTextPages,
            'services' =>$homeServices,
            'featured_products' => [],
            'about' => $aboutPage,
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function slider(Request $request)
    {
        $languageId = $request->language_id ?? 1;

        $slider = Slider::query()->with('info',function ($query)use($languageId){
            $query->where('language_id','=',$languageId);
        })->get();

        return response()->json($slider);
    }
}
