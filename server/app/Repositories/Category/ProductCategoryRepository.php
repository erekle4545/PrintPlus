<?php

namespace App\Repositories\Category;

use App\Helpers\Core\Multitenant;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Cover;
use App\Models\ProductCategory;
use App\Models\Products;
use App\Repositories\Interfaces\ProductCategoryRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ProductCategoryRepository implements ProductCategoryRepositoryInterface
{
    /**
     * @param $request
     * @return object|CategoryResource
     */
    public function getData($request): object
    {
        $category = ProductCategory::query()->with('covers');
        if ($request->keyword) {
            $category->where('title', 'like', '%' . $request->keyword . '%');


        }


        if ($request->status) {
            $category->where('status', $request->status);
        }

        $category->orderBy('title');

        return new CategoryResource($category->paginate(30));
    }

    /**
     * @param $request
     * @return object|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function setData($request): object
    {
        DB::beginTransaction();

        try {
            $category = ProductCategory::create([
                'status'=>$request->status,
                'title'=>$request->title,
                'slug'=>$request->slug,
            ]);


            if($request->cover_id) {

                /**
                 *  covers
                 */
                foreach ($request->cover_id as $key => $value) {
                    Cover::Create([
                        'files_id'       => $value,
                        'cover_type'     => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('ProductCategory'),
                        'coverable_id'   => $category->id,
                    ]);
                }
            }

            $categoryResData = [
                'id'=>$category->id,
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
        $model = Multitenant::getModel('ProductCategory');
        try {
            //Find page with id and language id
            $category = $model::with('covers')->findOrFail($id);



        } catch (\Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }
        return new CategoryResource($category);
    }


    /**
     * @param $request
     * @param $id
     * @return object|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function update($request, $id):object
    {
        try {
            //Find Page
            $category = ProductCategory::with('covers')->findOrFail($id);
            $category->title = $request->title;
            $category->slug = $request->slug;
            $category->status = $request->status;
            $category->save();


            /**
             * Attache covers
             */

                $coverModel = Multitenant::getModel('Cover');
                $coverModel::where('coverable_type', Multitenant::getModel('ProductCategory'))->where('coverable_id', $category->id)->delete();

            if ($request->cover_id) {
                //Remove covers


                foreach ($request->cover_id as $key => $value) {
                    $coverModel::Create([
                        'files_id' => $value,
                        'cover_type' => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('ProductCategory'),
                        'coverable_id' => $category->id,
                    ]);
                }
            }

            return new CategoryResource($category);

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
        $category = ProductCategory::destroy($id);
        return response(['result' => $category], 200)->header('Content-Type', 'application/json');

    }

    public function getSide( $request){
        $res = ProductCategory::query()->select(['title','id','created_at'])->limit(5)->orderBy('created_at','DESC')->get();
        return new CategoryResource($res);
    }

}
