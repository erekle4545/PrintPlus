<?php

namespace App\Http\Controllers\API\admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLanguages;
use App\Http\Requests\StoreLanguageUpdate;
use App\Http\Resources\LanguageResource;
use App\Models\Core\Languages;
use Illuminate\Http\Request;

class languagesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return LanguageResource::collection(Languages::orderBy('created_at','DESC')->get());
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
    public function store(Request $request, StoreLanguages $storeLanguages)
    {
         $data = $storeLanguages->validated();
         $createLangauge = Languages::create($data);
         $langRes = new LanguageResource($createLangauge);

         return response($langRes);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
    public function update(Request $request,StoreLanguageUpdate $storeLanguageUpdate, $id)
    {
        $data = $storeLanguageUpdate->validated();
        $lang_res =  Languages::where('id',$id)->update($data);

       return response($lang_res);

    }

    public function defaultLangUpdate (StoreLanguageUpdate $storeLanguageUpdate, $id){
        $data = $storeLanguageUpdate->validated('default');
        $lang_res =  Languages::where('id',$id)->update($data);

        return response($lang_res);
    }


    public function LangStatusUpdate (StoreLanguageUpdate $storeLanguageUpdate, $id){
        $data = $storeLanguageUpdate->validated('status');
        $lang_res =  Languages::where('id',$id)->update($data);

        return response($lang_res);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Languages::destroy($id);
    }
}
