<?php

namespace App\Http\Controllers\API\Admin;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Core\Cover;
use App\Models\Core\Products;
use App\Models\Core\ProductsLanguage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductsController extends Controller
{

    public function index(Request $request)
    {
        $category = Products::query();
        if ($request->keyword) {
            $category->whereHas('info', function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
                $query->where('title', 'like', '%' . $request->keyword . '%');
            })->with('info.covers');

        } else {

            $category->with(array('info' => function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
            }));
        }


        if ($request->status) {
            $category->where('status', $request->status);
        }

            $category->orderBy('created_at', 'desc');

        return new ProductResource($category->paginate(10));
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $category = Products::create([
                'status'=>$request->status,
                'price'=>$request->price,
                'date'=>Carbon::parse($request->date),
                'category_id'=>$request->category_id,
            ]);
            $categoryLanguage = ProductsLanguage::create([
                'products_id'=>$category->id,
                'language_id'=>$request->language_id,
                'name'=>$request->name,
                'slug'=>$request->slug,
                'description' => $request->description,
                'text' => $request->text,
            ]);

            if($request->cover_id) {

                /**
                 *  covers
                 */
                foreach ($request->cover_id as $key => $value) {
                    Cover::Create([
                        'files_id'       => $value,
                        'cover_type'     => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('ProductsLanguage'),
                        'coverable_id'   => $categoryLanguage->id,
                    ]);
                }
            }

            $categoryResData = [
                'id'=>$category->id,
                'info'=>$categoryLanguage
            ];

            DB::commit();

            return response($categoryResData, 200)->header('Content-Type', 'application/json');

        }catch (\Exception $exception){

            DB::rollBack();
            return response(['result' => $exception->getMessage()], 500)->header('Content-Type', 'application/json');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request,$id)
    {
        $model = Multitenant::getModel('Products');

        try {
            //Find page with id and language id
            $Products = $model::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'info.covers'])->findOrFail($id);

            //if we can not find Category with id and language, select very first Category ignoring Language
            if (is_null($Products->info)) {
                $Products = $model::with(['info','info.covers'])->findOrFail($id);
            }


        } catch (\Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }
        return new ProductResource($Products);
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
        try {
            //Find Page
            $category = Products::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'infos.covers'])->findOrFail($id);

            $category->status = $request->status;
            $category->price = $request->price;
            $category->category_id = $request->category_id;
            $category->date = Carbon::parse($request->date);
            $category->save();

            /**
             * Attache covers
             */
            if ($request->cover_id) {
                //Remove covers
                if (!is_null($category->info)) {
                    $coverModel = Multitenant::getModel('Cover');
                    $coverModel::where('coverable_type', Multitenant::getModel('ProductsLanguage'))->where('coverable_id', $category->info->id)->delete();
                }

                foreach ($request->cover_id as $key => $value) {
                    $coverModel::Create([
                        'files_id'        => $value,
                        'cover_type'     => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('ProductsLanguage'),
                        'coverable_id'   => $category->info->id,
                    ]);
                }
            }

            //Update category language
            if (!is_null($category->info)) {

                $category->info->name = $request->name;
                $category->info->slug = $request->slug;
                $category->info->description = $request->description ?: " ";
                $category->info->text = $request->text ?: " ";

                $category->info->save();
                //sleep(10);
                //event(new MenuChanged());

                return new ProductResource($category);

            }else{

                ProductsLanguage::create([
                    'products_id'=>$category->id,
                    'language_id'=>$request->language_id,
                    'name'=>$request->name,
                    'slug'=>$request->slug,
                    'description' => $request->description,
                    'text' => $request->text,
                ]);
            }
        } catch (\Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request,$id)
    {
        $category = Products::where('id', $id)->with('infos')->first();

        if ($category->infos->count() > 1) {
            ProductsLanguage::where(['products_id' => $id, 'language_id' => intval($request->language_id)])->delete();
        } else {
            //  Menu::where(['category_id' => $id])->delete();
            ProductsLanguage::where(['products_id' => $id])->delete();
            Products::where('id', $id)->delete();
        }
        return response(['result' => $category], 200)->header('Content-Type', 'application/json');

    }

    public function productSide(Request $request){
        $cat = Products::with(['info' => function ($query) use ($request) {
            $query->where('language_id',$request->language_id);
        }])->limit(5)->orderBy('created_at','DESC')->get();
        return new CategoryResource($cat);

    }
}
