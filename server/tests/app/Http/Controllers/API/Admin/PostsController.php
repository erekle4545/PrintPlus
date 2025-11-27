<?php

namespace App\Http\Controllers\API\Admin;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Core\Cover;
use App\Models\Core\Post;
use App\Models\Core\PostLanguage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $post = Post::query();

        if ($request->keyword) {
            $post->whereHas('info', function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
                $query->where('title', 'like', '%' . $request->keyword . '%');
            })->with('info.covers');

        } else {
            $post->with(array('info' => function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
            }));
            $post->with(array('info' => function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
            }));
        }

        if ($request->category_id) {
            $post->where('category_id',$request->category_id);
        }
        if ($request->status) {
            $post->where('status', $request->status);
        }

        $post->orderBy('created_at', 'desc');

        return new PostResource($post->paginate(10));
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
            if ($request->id) {
                $post = Post::findOrFail($request->id);
            } else {

                $metas = [];
                $post = Post::Create([
                    'date'          => $request->date,
                    'template_id'   => config('page.templates.news.id'),
                    'category_id'   => $request->category_id,
                    'status'        => $request->status,
                ]);
            }

            /**
             * Collect Facebook og tags
             */
            $og_tags['facebook'] = [
                'og' => [
                    'title'         => $request->fb_og_title,
                    'description'   => $request->fb_og_description,
                    'url'           => $request->fb_og_url,
                    'type'          => $request->fb_og_type,
                ]
            ];

            $meta_merged = $request->meta ? array_merge($og_tags, $request->meta) : $og_tags;
            $meta_merged = array_merge($meta_merged, ['meta_keywords' => $request->meta_keywords ?:[]]);

            /**
             * Try to save page language
             */
            $postLanguage = PostLanguage::Create([
                'post_id'       => $post->id,
                'language_id'   => $request->language_id,
                'title'         => $request->title,
                'description'   => $request->description?:" ",
                'text'          => $request->text,
                'meta'          => $meta_merged,
                'slug'          => $request->slug,
            ]);

            if($request->cover_id) {

                /**
                 *  covers
                 */
                foreach ($request->cover_id as $key => $value) {
                    Cover::Create([
                        'files_id'        => $value,
                        'cover_type'     => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('PostLanguage'),
                        'coverable_id'   => $postLanguage->id,
                    ]);
                }
            }
            DB::commit();
            $resData = [
                'id'=>$post->id,
                'info'=>$postLanguage
            ];

            return response($resData, 200)->header('Content-Type', 'application/json');
        } catch (\Exception $e) {
            DB::rollBack();
            return response(['result' => $e->getMessage()], 500)->header('Content-Type', 'application/json');
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
        $model = Multitenant::getModel('Post');
        try {
            //Find Post with id and language id
            $post = $model::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'info.covers'])->findOrFail($id);

            if (is_null($post->info)) {
                $post = $model::with(['info','info.covers'])->findOrFail($id);
            }

        } catch (Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }

        return new PostResource($post);
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
            $post = Post::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'infos.covers'])->findOrFail($id);
            //'info.covers'

            $post->status = $request->status;
            $post->category_id = $request->category_id;
            $post->save();

            /**
             * Attache covers
             */
            if (!is_null($post->info)) {
                $coverModel = Multitenant::getModel('Cover');
                $coverModel::where('coverable_type', Multitenant::getModel('PostLanguage'))->where('coverable_id', $post->info->id)->delete();
            }
            if ($request->cover_id) {
                //Remove covers
                if (!is_null($post->info)) {
                      foreach ($request->cover_id as $key => $value) {
                        $coverModel::Create([
                            'files_id'        => $value,
                            'cover_type'     => $request->cover_type[$key],
                            'coverable_type' => Multitenant::getModel('PostLanguage'),
                            'coverable_id'   => $post->info->id,
                        ]);
                    }
                }
            }

            //Update post language
            if (!is_null($post->info)) {
                /**
                 * Collect Facebook og tags
                 */
                $og_tags['facebook'] = [
                    'og' => [
                        'title' => $request->fb_og_title,
                        'description' => $request->fb_og_description,
                        'url' => $request->fb_og_url,
                        'type' => $request->fb_og_type,
                    ]
                ];

                $meta_merged = $request->meta ? array_merge($og_tags, $request->meta) : $og_tags;
                $meta_merged = array_merge($meta_merged, ['meta_keywords' => $request->meta_keywords ?: []]);

                $post->info->title = $request->title;
                $post->info->slug = $request->slug;
                $post->info->description = $request->description ?: " ";
                $post->info->text = $request->text;
                $post->info->meta = $meta_merged;
                $post->info->save();

                return new PostResource($post);

            }else{
                /**
                 * Collect Facebook og tags
                 */
                $og_tags['facebook'] = [
                    'og' => [
                        'title' => $request->fb_og_title,
                        'description' => $request->fb_og_description,
                        'url' => $request->fb_og_url,
                        'type' => $request->fb_og_type,
                    ]
                ];

                $meta_merged = $request->meta ? array_merge($og_tags, $request->meta) : $og_tags;
                $meta_merged = array_merge($meta_merged, ['meta_keywords' => $request->meta_keywords ?: []]);

                $postLangModel = PostLanguage::Create([
                    'post_id'       => $post->id,
                    'language_id'   => $request->language_id,
                    'title'         => $request->title,
                    'description'   => $request->description?:" ",
                    'text'          => $request->text,
                    'meta'          => $meta_merged,
                    'slug'          => $request->slug,
                ]);
                if ($request->cover_id) {
                    foreach ($request->cover_id as $key => $value) {
                        Cover::Create([
                            'files_id'        => $value,
                            'cover_type'     => $request->cover_type[$key],
                            'coverable_type' => Multitenant::getModel('PostLanguage'),
                            'coverable_id'   => $postLangModel->id,
                        ]);
                    }

                }
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
        $pages = Post::where('id', $id)->with('infos')->first();

        if ($pages->infos->count() > 1) {

            Post::where('id', $id)->delete();
            PostLanguage::where(['post_id' => $id, 'language_id' => $request->language_id])->delete();
        } else {
            PostLanguage::where(['post_id' => $id])->delete();
            Post::where('id', $id)->delete();
        }

        return response(['result' => $pages], 200)->header('Content-Type', 'application/json');

    }

    public function postSideBar(Request $request){
        $posts = Post::with(['info' => function ($query) use ($request) {
            $query->where('language_id', $request->language_id);
        }])->limit(5)->orderBy('created_at','DESC')->get();
        return new PostResource($posts);

    }
}
