<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Language;
use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Models\Core\Category;
use App\Models\Core\Gallery;
use App\Models\Core\Menu;
use App\Models\Core\Page;
use App\Models\Core\Post;
use App\Models\Core\Products;
use App\Models\Core\Services;
use App\Models\Core\Slider;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $slider = Slider::query()->where('status',config('page.status.active'))->with('info', function ($query) {
            $query->with('covers');
            $query->where('language_id', Language::languageId());
        })->get();

       $newsPage = Page::query()->where(['show_home_page'=>1,'template_id'=>config('page.templates.news.id')])->with('info', function ($query) {
            $query->with('covers');
            $query->where('language_id', Language::languageId());
       })->first();

        $news = Post::query()->where('template_id',config('page.templates.news.id'))->with('info', function ($query) {
            $query->with('covers');
            $query->where('language_id', Language::languageId());
        })->limit(3)->get();

        $textPage = Page::query()->where(['show_home_page'=>1,'template_id'=>config('page.templates.about.id')])->with('info', function ($query) {
            $query->with('covers');
            $query->where('language_id', Language::languageId());
        })->first();


        $gallery = Gallery::query()->where(['status'=>1])->with('info',function ($query){
            $query->with('covers');
            $query->where('language_id',Language::languageId());
        })->get();

        $servicePage = Page::query()->where(['show_home_page'=>1,'template_id'=>config('page.templates.services.id')])->with('info', function ($query) {
            $query->with('covers');
            $query->where('language_id', Language::languageId());
        })->first();

        $carBrandsPage = Page::query()->where(['show_home_page'=>1,'template_id'=>config('page.templates.car_brands.id')])->with('info', function ($query) {
            $query->with('covers');
            $query->where('language_id', Language::languageId());
        })->get();


        $banners = Category::query()->where(['status'=>1])->with('info', function ($query) {
            $query->with('covers');
            $query->where('language_id', Language::languageId());
        })->get();

        $services = Services::query()->where('template_id',config('page.templates.services.id'))->with('info', function ($query) {
            $query->with('covers');
            $query->where('language_id', Language::languageId());
        })->limit(5)->select(['id','created_at','date'])->get();


        // years
        $currentYear = Carbon::now()->year;
        $startYear = 1994;
        $years = range($startYear, $currentYear);
        return view('home',[
            'slider'=>$slider,
            'textPage'=>$textPage,
            'blogPage'=>$newsPage,
            'blog'=>$news,
            'banners'=>$banners,
            'gallery'=>$gallery,
            'carBrands'=>$carBrandsPage,
            'servicesPage'=>$servicePage,
            'services'=>$services,
            'years' => $years,
            'product'=>  $this->homeProduct($request)

        ]);
    }

    public function homeProduct( $request)
    {
        $product = Products::query();


        try {
            $startYear =  Carbon::createFromFormat('Y', $request->get('start_year'));
            $endYear =  Carbon::createFromFormat('Y',$request->get('end_year'));

        } catch (\Exception $e) {
            $startYear = null; // Set to null if there's an error
            $endYear = null; // Set to null if there's an error
        }

        if($startYear && $endYear) {
            $startYear =  Carbon::createFromFormat('Y', $request->get('start_year'));
            $endYear =  Carbon::createFromFormat('Y',$request->get('end_year'));
            $product->whereBetween('date', [$startYear, $endYear]);
        }

        $product->whereHas('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId()]);
        })->with('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId()]);
        });




        return  $product->with('page')->paginate(12);

    }

}
