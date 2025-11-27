<?php

namespace App\Http\Controllers\API\Admin;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\SettingResource;
use App\Models\Core\Cover;
use App\Models\Core\Settings;
use App\Models\Core\SettingsLanguage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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

        $key = [
            'google_key'=>$request->google_key
        ];
        $meta = [
            'facebook'=>$request->facebook,
            'youtube'=>$request->youtube,
        ];
        try {
            $settings = Settings::create([
                'keys'=>$key,
                'email'=>$request->email,
                'phone'=>$request->phone,
                'meta'=>$meta,
            ]);
            $settingLanguage = SettingsLanguage::create([
                'settings_id'=>$settings->id,
                'language_id'=>$request->language_id,
                'title'=>$request->title,
                'description'=>$request->description,
                'address'=>$request->address,
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
                        'coverable_id'   => $settingLanguage->id,
                    ]);
                }
            }

            $teamResData = [
                'id'=>$settings->id,
                'info'=>$settingLanguage
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
        $model = Multitenant::getModel('Settings');
        try {
            //Find page with id and language id
            $settings= $model::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);

            }, 'info.covers'])->findOrFail($id);
            //if we can not find Category with id and language, select very first Category ignoring Language
            if (is_null($settings->info)) {
                $settings = $model::with(['info','info.covers'])->findOrFail($id);
            }


        } catch (Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }

        return new SettingResource($settings);
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

            $key = [
                'google_key'=>$request->google_key
            ];
            $meta = [
                'facebook'=>$request->facebook,
                'youtube'=>$request->youtube,
            ];

            //Find Page
            $settings = Settings::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'infos.covers'])->findOrFail($id);

            $settings->keys = $key;
            $settings->email = $request->email;
            $settings->phone = $request->phone;
            $settings->meta = $meta;
            $settings->save();




            /**
             * Attache covers
             */
            if (!is_null($settings->info)) {
                $coverModel = Multitenant::getModel('Cover');
                $coverModel::where('coverable_type', Multitenant::getModel('SettingsLanguage'))->where('coverable_id', $settings->info->id)->delete();
            }
            if ($request->cover_id) {
                //Remove covers
                if (!is_null($settings->info)) {
                    foreach ($request->cover_id as $key => $value) {
                        $coverModel::Create([
                            'files_id'        => $value,
                            'cover_type'     => $request->cover_type[$key],
                            'coverable_type' => Multitenant::getModel('SettingsLanguage'),
                            'coverable_id'   => $settings->info->id,
                        ]);
                    }
                }
            }

            //Update category language
            if (!is_null($settings->info)) {

                $settings->info->title = $request->title;
                $settings->info->address = $request->address;
                $settings->info->description = $request->description;
                $settings->info->save();
                //sleep(10);
                //event(new MenuChanged());

                return new SettingResource($settings);

            }else{

                SettingsLanguage::create([
                    'settings_id'=>$settings->id,
                    'language_id'=>$request->language_id,
                    'description'=>$request->description,

                    'title'=>$request->title,
                    'address'=>$request->address,
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
        //
    }
}
