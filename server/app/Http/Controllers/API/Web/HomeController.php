<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Category;
use App\Models\Core\Page;
use App\Models\Core\Products;
use App\Models\Core\Slider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    public function index(Request $request): JsonResponse
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

        // featured products
        $featuredProducts = Category::query()
            ->where('status',1)
            ->with(['info'=>function($q) use ($languageId) {
                $q->where('language_id', $languageId);
                $q->with('covers');
                $q->select(['id','title','slug','category_id','language_id']);
            },
                'page' => function ($qu) use ($languageId) {
                    $qu->with(['info'=>function($q) use ($languageId) {
                        $q->where('language_id', $languageId);
                        $q->select(['id','page_id','slug','language_id']);
                    }]);
               $qu->where('template_id',config('page.templates.products.id'));
            }])
            ->whereHas('page' , function ($qu) use ($languageId) {
                $qu->where('template_id',config('page.templates.products.id'));
            })
            ->select(['id','status','date','page_id'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();


        //returns objects
        return response()->json([
            'text_pages' => $homeTextPages,
            'services' =>$homeServices,
            'featuredProducts' => $featuredProducts,
            'about' => $aboutPage
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function slider(Request $request)
    {
        $languageId = (int) ($request->language_id ?? 1);

        $cacheKey = "sliders:lang:{$languageId}";

        $sliders = Cache::tags(['sliders', "sliders:lang:{$languageId}"])
            ->remember($cacheKey, now()->addHours(12), function () use ($languageId) {
                return Slider::query()
                    ->where('status', 1)
                    ->with(['info' => function ($q) use ($languageId) {
                        $q->where('language_id', $languageId)
                            ->select(['id', 'title', 'description', 'language_id', 'slider_id'])
                            ->with('covers');
                    }])
                    ->get();
            });

        return response()->json(['sliders' => $sliders]);
//        $languageId = $request->language_id ?? 1;
//
//        $slider = Slider::query()
//            ->where('status',1)
//            ->with('info',function($q) use ($languageId) {
//                $q->where('language_id', $languageId);
//                $q->with('covers');
//                $q->select(['id','title','description','language_id','slider_id']);
//            })->get();
//
//        return response()->json(['sliders'=>$slider]);
    }
}
