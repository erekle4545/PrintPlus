<?php

namespace App\Http\Controllers\API\Web;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Models\Core\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'language_id' => 'required|integer|exists:languages,id',
        ],[
            'category_id'=>'კატეგორიის არჩევა აუცილებელია'
        ]);

        $product = Products::query()
            ->where('category_id',$data['category_id'])
            ->with('info',function($query) use ($request){
            $query->where('language_id',$request->language_id);
            $query->with('covers');
        })->get();

        return response()->json($product);
    }


    /**
     * @param Request $request
     * @param $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function show( Request $request){

        $model = Multitenant::getModel('Products');

        $slug = $request->get('slug');

        Log::info($slug);

        try {

            if(preg_match('/-pr(\d+)$/', $slug, $matches)) {

                $id = $matches[1];
                //Find page with id and language id
                $Products = $model::with([
                    'info' => function ($query) use ($request) {
                        $query->where('language_id', $request->language_id ?? 1);
                    },
                    'info.covers',
                    'colors',
                    'sizes',
                    'category.page:id,template_id',
                    'category.info:id,category_id,slug,title',
                    'extras'
                ])->findOrFail($id);

                //if we can not find Category with id and language, select very first Category ignoring Language
                if (is_null($Products->info)) {
                    $Products = $model::with(['info', 'info.covers', 'colors', 'sizes', 'extras'])->findOrFail($id);
                }

                // Format attributes for frontend
                $productAttributes = [
                    'colors' => $Products->colors->map(function ($color) {
                        return [
                            'id' => $color->id,
                            'name' => $color->name,
                            'value' => $color->value,
                            'type' => $color->type,
                            'base_price' => $color->base_price,
                            'custom_price' => $color->pivot->price
                        ];
                    })->toArray(),
                    'sizes' => $Products->sizes->map(function ($size) {
                        return [
                            'id' => $size->id,
                            'name' => $size->name,
                            'value' => $size->value,
                            'width' => $size->width,
                            'height' => $size->height,
                            'base_price' => $size->base_price,
                            'custom_price' => $size->pivot->price
                        ];
                    })->toArray(),
                    'extras' => $Products->extras->map(function ($extra) {
                        return [
                            'id' => $extra->id,
                            'name' => $extra->name,
                            'base_price' => $extra->base_price,
                            'custom_price' => $extra->pivot->price
                        ];
                    })->toArray(),
                ];

                $Products->product_attributes = $productAttributes;

                return response()->json($Products);

            }else{
                return response()->json(['message' => 'not found'], 404);
            }

        } catch (\Exception $e) {
            return response()->json(['message' => 'not found'], 404);
        }

    }
}
