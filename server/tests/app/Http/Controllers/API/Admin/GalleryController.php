<?php

namespace App\Http\Controllers\API\Admin;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryResource;
use App\Models\Core\Cover;
use App\Models\Core\Gallery;
use App\Models\Core\GalleryLanguage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $gallery = Gallery::query();
        if ($request->keyword) {
            $gallery->whereHas('info', function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
                $query->where('title', 'like', '%' . $request->keyword . '%');
            })->with('info');

        } else {
            $gallery->with(array('info' => function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
            }));
        }

        return new GalleryResource($gallery->paginate(10));
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
            $gallery = Gallery::create([
                'status'=>$request->status,
                'link'=>$request->link,
                'date'=>\Carbon\Carbon::parse(time()),
            ]);
            $galleryLanguage = GalleryLanguage::create([
                'gallery_id'=>$gallery->id,
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
                        'coverable_type' => Multitenant::getModel('GalleryLanguage'),
                        'coverable_id'   => $galleryLanguage->id,
                    ]);
                }
            }

            $galleryResData = [
                'id'=>$gallery->id,
                'info'=>$galleryLanguage
            ];

            DB::commit();

            return response($galleryResData, 200)->header('Content-Type', 'application/json');

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
        $model = Multitenant::getModel('Gallery');
        try {
            //Find page with id and language id
            $gallery= $model::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);

            }, 'info.covers'])->findOrFail($id);
            //if we can not find Category with id and language, select very first Category ignoring Language
            if (is_null($gallery->info)) {
                $category = $model::with(['info','info.covers'])->findOrFail($id);
            }


        } catch (Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }
        return new GalleryResource($gallery);
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
        try {
            //Find Page
            $gallery = Gallery::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'infos.covers'])->findOrFail($id);

            $gallery->status = $request->status;
            $gallery->link = $request->link;
            $gallery->date = \Carbon\Carbon::parse(time());
            $gallery->save();



            /**
             * Attache covers
             */
            if (!is_null($gallery->info)) {
                $coverModel = Multitenant::getModel('Cover');
                $coverModel::where('coverable_type', Multitenant::getModel('GalleryLanguage'))->where('coverable_id', $gallery->info->id)->delete();
            }
           if ($request->cover_id) {
                //Remove covers

                if (!is_null($gallery->info)) {
                    foreach ($request->cover_id as $key => $value) {

                        $coverModel::Create([
                            'files_id'        => $value,
                            'cover_type'     => $request->cover_type[$key],
                            'coverable_type' => Multitenant::getModel('GalleryLanguage'),
                            'coverable_id'   => $gallery->info->id,
                        ]);
                    }
                }
            }

            //Update category language
            if (!is_null($gallery->info)) {
                $gallery->info->title = $request->title;
                $gallery->info->slug = $request->slug;
                $gallery->info->description = $request->description ?: " ";
                $gallery->info->save();
                //sleep(10);
                //event(new MenuChanged());

                return new GalleryResource($gallery);

            }else{

                GalleryLanguage::create([
                    'gallery_id'=>$gallery->id,
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
    public function destroy($id)
    {
        $gallery = Gallery::where('id', $id)->with('infos')->first();

        if ($gallery->infos->count() > 1) {

            GalleryLanguage::where(['gallery_id' => $id, 'language_id' => $gallery->language_id])->delete();
            Gallery::where('id', $id)->delete();
        } else {

            GalleryLanguage::where(['gallery_id' => $id])->delete();
            Gallery::where('id', $id)->delete();
        }
        return response(['result' => $gallery], 200)->header('Content-Type', 'application/json');

    }

    public function gallerySide(Request $request){
        $gallery = Gallery::with(['info' => function ($query) use ($request) {
            $query->where('language_id',$request->language_id);
        }])->limit(5)->orderBy('created_at','DESC')->get();
        return new GalleryResource($gallery);

    }
}
