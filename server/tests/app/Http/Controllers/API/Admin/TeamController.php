<?php

namespace App\Http\Controllers\API\Admin;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\TeamResource;
use App\Models\Core\Cover;
use App\Models\Core\Team;
use App\Models\Core\TeamLanguage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $team = Team::query();
        if ($request->keyword) {
            $team->whereHas('info', function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
                $query->where('title', 'like', '%' . $request->keyword . '%');
            })->with('info.covers');

        } else {
            $team->with(array('info' => function ($query) use ($request) {
                $query->with('covers');
                $query->where('language_id', $request->language_id);
            }));
        }

        return new TeamResource($team->paginate(10));
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
            $team = Team::create([
                'status'=>$request->status,
                'date'=>\Carbon\Carbon::parse(time()),
            ]);
            $teamLanguage = TeamLanguage::create([
                'team_id'=>$team->id,
                'language_id'=>$request->language_id,
                'title'=>$request->title,
                'text'=>$request->title,
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
                        'coverable_type' => Multitenant::getModel('TeamLanguage'),
                        'coverable_id'   => $teamLanguage->id,
                    ]);
                }
            }

            $teamResData = [
                'id'=>$team->id,
                'info'=>$teamLanguage
            ];

            DB::commit();

            return response($teamResData, 200)->header('Content-Type', 'application/json');

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
        $model = Multitenant::getModel('Team');
        try {
            //Find page with id and language id
            $team= $model::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);

            }, 'info.covers'])->findOrFail($id);
            //if we can not find Category with id and language, select very first Category ignoring Language
            if (is_null($team->info)) {
                $team = $model::with(['info','info.covers'])->findOrFail($id);
            }


        } catch (Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }

        return new TeamResource($team);
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
            $team = Team::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'infos.covers'])->findOrFail($id);

            $team->status = $request->status;
            $team->date = \Carbon\Carbon::parse(time());
            $team->save();

            /**
             * Attache covers
             */
            if (!is_null($team->info)) {
                $coverModel = Multitenant::getModel('Cover');
                $coverModel::where('coverable_type', Multitenant::getModel('TeamLanguage'))->where('coverable_id', $team->info->id)->delete();
            }
            if ($request->cover_id) {
                //Remove covers

                if (!is_null($team->info)) {
                    foreach ($request->cover_id as $key => $value) {
                        $coverModel::Create([
                            'files_id'        => $value,
                            'cover_type'     => $request->cover_type[$key],
                            'coverable_type' => Multitenant::getModel('TeamLanguage'),
                            'coverable_id'   => $team->info->id,
                        ]);
                    }
                }
            }

            //Update category language
            if (!is_null($team->info)) {
                $team->info->title = $request->title;
                $team->info->slug = $request->slug;
                $team->info->text = $request->text;
                $team->info->description = $request->description;
                $team->info->save();

                return new TeamResource($team);

            }else{
                TeamLanguage::create([
                    'team_id'=>$team->id,
                    'language_id'=>$request->language_id,
                    'title'=>$request->title,
                    'text'=>$request->text,
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
        $team = Team::where('id', $id)->with('infos')->first();

        if ($team->infos->count() > 1) {

            TeamLanguage::where(['team_id' => $id, 'language_id' => $team->language_id])->delete();
            Team::where('id', $id)->delete();
        } else {

            TeamLanguage::where(['team_id' => $id])->delete();
            Team::where('id', $id)->delete();
        }
        return response(['result' => $team], 200)->header('Content-Type', 'application/json');

    }

    public function teamSide(Request $request){
        $team = Team::with(['info' => function ($query) use ($request) {
            $query->where('language_id',$request->language_id);
        }])->limit(5)->orderBy('created_at','DESC')->get();
        return new TeamResource($team);

    }
}
