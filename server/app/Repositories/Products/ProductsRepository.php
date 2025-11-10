<?php

namespace App\Repositories\Products;

use App\Helpers\Core\Multitenant;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Cover;
use App\Models\ProductCategory;
use App\Models\Products;
use App\Repositories\Interfaces\ProductsRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductsRepository implements ProductsRepositoryInterface
{

    public function getData($request): object
    {
        $product = Products::query()->with('covers');
        if ($request->keyword) {
            $product->where('title', 'like', '%' . $request->keyword . '%');
            $product->orWhere('code', $request->keyword);
        }

        if($request->status) {
            $product->where('status', $request->status);
        }
        if ($request->category_id) {
            $product->where('category_id', $request->category_id);
        }


        $product->orderBy('date', 'desc');

        return new ProductResource($product->paginate(10));
    }

    /**
     * @param $request
     * @return object|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function setData($request): object
    {
        DB::beginTransaction();

        try {
            $product = products::create([
                'status'=>$request->status,
                'title'=>$request->title,
                'code'=>$request->code,
                'price'=>$request->price,
                'color'=>$request->color,
                'slug'=>$request->slug,
                'text'=>$request->text,
                'comment'=>$request->comment,
                'date'=> Carbon::parse($request->date),
                'category_id'=>$request->category_id,
            ]);

            if($request->cover_id) {
                /**
                 *  covers
                 */
                foreach ($request->cover_id as $key => $value) {
                    Cover::Create([
                        'files_id'       => $value,
                        'cover_type'     => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('Products'),
                        'coverable_id'   => $product->id,
                    ]);
                }
            }

            $categoryResData = [
                'id'=>$product->id,
            ];

            DB::commit();

            return response($categoryResData, 200)->header('Content-Type', 'application/json');

        }catch (\Exception $exception){
            DB::rollBack();
            return response(['result' => $exception->getMessage()], 500)->header('Content-Type', 'application/json');
        }
    }

    /**
     * @param $request
     * @param $id
     * @return CategoryResource|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function show($request,$id)
    {
        try {
            $model = Multitenant::getModel('Products');
            //Find page with id and language id
            $product = $model::with('covers')->findOrFail($id);

            view()->share('metaTitle', $product->title);
            view()->share('metaDescription', $product->comment);
//            view()->share('shareImage', null);

            return new CategoryResource($product);

        } catch (\Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }
    }


    public function update($request, $id):object
    {
        try {
            //Find Page
            $product = Products::with('covers')->findOrFail($id);
            $product->title = $request->title;
            $product->code = $request->code;
            $product->price = $request->price;
            $product->color = (array)$request->color;
            $product->comment = $request->comment;
            $product->status = $request->status;
            $product->text = $request->text;
            $product->slug = $request->slug;
            $product->date = Carbon::parse($request->date);
            $product->category_id = $request->category_id;
            $product->save();

            /**
             * Attache covers
             */

            $coverModel = Multitenant::getModel('Cover');
            $coverModel::where('coverable_type', Multitenant::getModel('Products'))->where('coverable_id', $product->id)->delete();

            if ($request->cover_id) {
                //Remove covers
                foreach ($request->cover_id as $key => $value) {
                    $coverModel::Create([
                        'files_id' => $value,
                        'cover_type' => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('Products'),
                        'coverable_id' => $product->id,
                    ]);
                }
            }

            return new ProductResource($product);

        } catch (\Exception $e) {
            return response(['error' => $e], 404)->header('Content-Type', 'application/json');
        }

    }

    /**
     * @param $id
     * @return object|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function delete( $id):object
    {
        $product = Products::destroy($id);
        return response(['result' => $product], 200)->header('Content-Type', 'application/json');
    }

    public function getSide( $request){
        $res = Products::query()->select(['title','id','created_at'])->limit(5)->orderBy('date','DESC')->get();
        return new ProductResource($res);
    }
    /**
     * @param $request
     * @return object|ProductResource
     */
    public function homeProductions($request):object
    {
        $product = Products::query()->with('covers');
        if($request->category_id){
            $product->where('category_id',$request->category_id);
        }
        if ($request->keyword) {
            $product->where('title', 'like', '%' . $request->keyword . '%');
            $product->orWhere('code', $request->keyword);
        }


        return new ProductResource($product->limit(30)->orderBy('date','DESC')->paginate(30));
    }

    /**
     * @param $request
     * @return object|ProductResource
     */
    public function getCartItems($request):object
    {
        $res = Products::query()->where('id',$request->product_id)->with('covers')->orderBy('created_at','DESC')->select(['title','price','id'])->get();

        return new ProductResource($res);
    }

    /**
     * @param $request
     * @return object|ProductResource
     */
    public function filterCategory($request):object
    {
        $res = Products::query()->where('category_id',$request->category_id)->with('covers')->orderBy('date','DESC')->paginate(30);

        return new ProductResource($res);
    }
    public function getCart($request):object
    {
        $res = Products::query()->whereIn('id',$request->product_id)->with('covers')->orderBy('created_at','DESC')->get();

        return new ProductResource($res);
    }


}
