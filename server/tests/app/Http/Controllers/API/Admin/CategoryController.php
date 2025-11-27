<?php

namespace App\Http\Controllers\API\Admin;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Core\Category;
use App\Models\Core\CategoryLanguage;
use App\Models\Core\Cover;
use Illuminate\Http\Request;
use DB;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $category = Category::query();
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

        return new CategoryResource($category->paginate(10));
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
        DB::beginTransaction();

        try {
            $category = Category::create([
                'status'=>$request->status,
                'date'=>\Carbon\Carbon::parse(time()),
            ]);
            $categoryLanguage = CategoryLanguage::create([
                'category_id'=>$category->id,
                'language_id'=>$request->language_id,
                'title'=>$request->title,
                'slug'=>$request->slug,
                'description' => $request->description,
            ]);

            if($request->cover_id) {

                /**
                 *  covers
                 */
                foreach ($request->cover_id as $key => $value) {
                    Cover::Create([
                        'files_id'       => $value,
                        'cover_type'     => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('CategoryLanguage'),
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
        $model = Multitenant::getModel('Category');
        try {
            //Find page with id and language id
            $category = $model::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);

            }, 'info.covers'])->findOrFail($id);
            //if we can not find Category with id and language, select very first Category ignoring Language
            if (is_null($category->info)) {
                $category = $model::with(['info','info.covers'])->findOrFail($id);
            }


        } catch (Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }
        return new CategoryResource($category);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

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
            $category = Category::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'infos.covers'])->findOrFail($id);

            $category->status = $request->status;
            $category->date = \Carbon\Carbon::parse(time());
            $category->save();



            /**
             * Attache covers
             */
            if ($request->cover_id) {
                //Remove covers
                if (!is_null($category->info)) {
                    $coverModel = Multitenant::getModel('Cover');
                    $coverModel::where('coverable_type', Multitenant::getModel('CategoryLanguage'))->where('coverable_id', $category->info->id)->delete();
                }

                foreach ($request->cover_id as $key => $value) {
                    $coverModel::Create([
                        'files_id'        => $value,
                        'cover_type'     => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('CategoryLanguage'),
                        'coverable_id'   => $category->info->id,
                    ]);
                }
            }

            //Update category language
            if (!is_null($category->info)) {

                $category->info->title = $request->title;
                $category->info->slug = $request->slug;
                $category->info->description = $request->description ?: " ";

                $category->info->save();
                //sleep(10);
                //event(new MenuChanged());

                return new CategoryResource($category);

            }else{

                CategoryLanguage::create([
                    'category_id'=>$category->id,
                    'language_id'=>$request->language_id,
                    'title'=>$request->title,
                    'slug'=>$request->slug,
                    'description' => $request->description,
                ]);
            }
        } catch (Exception $e) {
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
        $category = Category::where('id', $id)->with('infos')->first();

        if ($category->infos->count() > 1) {
            CategoryLanguage::where(['category_id' => $id, 'language_id' => intval($request->language_id)])->delete();
        } else {
          //  Menu::where(['category_id' => $id])->delete();
            CategoryLanguage::where(['category_id' => $id])->delete();
            Category::where('id', $id)->delete();
        }
        return response(['result' => $category], 200)->header('Content-Type', 'application/json');

    }

    public function categorySide(Request $request){
        $cat = Category::with(['info' => function ($query) use ($request) {
            $query->where('language_id',$request->language_id);
        }])->limit(5)->orderBy('created_at','DESC')->get();
        return new CategoryResource($cat);

    }
}
