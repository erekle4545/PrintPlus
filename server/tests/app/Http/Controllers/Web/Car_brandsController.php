<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Language;
use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use App\Models\Core\Post;
use App\Models\Core\Products;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class Car_brandsController extends Controller
{

    public function index(Request $request){
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

        $page =Page::query()->whereHas('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->segment(2)]);
        })->first();


        if($page) {
            $product->where('page_id', $page->id);
        }



        // years
        $currentYear = Carbon::now()->year;
        $startYear = 1994;
        $years = range($startYear, $currentYear);

        return view('web.pages.car_brands.index',[
           'page' => $page,
           'years' => $years,
           'product' => $product->paginate(12)
       ]);

    }


    public function show(Request $request, $slug){
        // parse id
        preg_match('/(\d+)/', $slug, $matches);

        $product = Products::query();
        $otherProduct = Products::query();

        if (isset($matches[1])) {
            $id = $matches[1];
            $product->where('id',$id)->whereHas('info', function ($query) use ($request) {
                $query->with('covers');
                $query->where(['language_id'=>Language::languageId()]);
            })->with('info', function ($query) use ($request) {
                $query->with('covers');
                $query->where(['language_id'=>Language::languageId()]);
            });

            $otherProduct->where('id','!=',$id)->whereHas('info', function ($query)  {
                $query->with('covers');
                $query->where(['language_id'=>Language::languageId()]);
            });

        }


        $page =Page::query()->whereHas('info', function ($query) use ($request) {
            $query->with('covers');
            $query->where(['language_id'=>Language::languageId(),'slug'=>$request->segment(2)]);
        })->first();

        return view('web.pages.car_brands.show',[
            'page' => $page,
            'otherProduct' => $otherProduct->get(),
            'product' => $product->first()
        ]);

    }
}
