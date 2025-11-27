<?php

namespace App\Http\Controllers\API\Admin;

use App\Events\Dictionary\DictionaryUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDictionary;
use App\Http\Requests\StoreDictionaryUpdate;
use App\Http\Resources\DictionaryResource;
use App\Models\Core\Dictionary;
use App\Models\Core\DictionaryLanguage;

use Illuminate\Http\Request;

class DictionaryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
//        return DictionaryResource::collection(Dictionary::orderBy('created_at','DESC')->get());
        return  Dictionary::query()->orderBy('created_at','DESC')->with('info')->get();
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
    public function store(Request $request,StoreDictionary $storeDictionary)
    {

        \DB::beginTransaction();
        try {
            $issetWordLanguage = DictionaryLanguage::where('value',$request->value)->where('language_id',$request->language_id)->count();
            if($issetWordLanguage === 0 ){

                    if ($request->id) {
                        $word = Dictionary::findOrFail($request->id);
                    } else {
                        $word = Dictionary::create([
                            'word'   => $request->word,
                        ]);
                    }

                    $wordLanguage = DictionaryLanguage::create([
                        'dictionary_id'=> $word->id,
                        'language_id'  => $request->language_id,
                        'value'        => $request->value,
                    ]);


                    event(new DictionaryUpdate());

                    \DB::commit();
                    return response( [
                        'id' => $word->id,
                        'word'=>$word->word,
                        'language_id'=>$wordLanguage->language_id,
                        'value'=>$wordLanguage->value,
                        'created_at'=>$word->created_at,
                    ], 200)->header('Content-Type', 'application/json');

            }else{
                return response( [
                    'message' => 'ეს სიტყვა უკვე ნათარგმნია არჩეულ ენაზე',

                ], 208)->header('Content-Type', 'application/json');
            }



        } catch (Exception $e) {
            \DB::rollBack();
            return response(['result' => $e->getMessage()], 500)->header('Content-Type', 'application/json');
        }
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
    public function update(Request $request,StoreDictionaryUpdate $storeDictionaryUpdate, $id)
    {

        $word = Dictionary::with(['info' => function ($query) use ($request) {
            $query->where('language_id', $request->language_id?:1);
        }])->findOrFail($id);

        \DB::beginTransaction();
        try {
            $word->word = $request->word;
            $word->save();

            $word->info->value = $request->value;
            $word->info->save();


             event(new DictionaryUpdate());

            \DB::commit();
            return new DictionaryResource($word);
        } catch (Exception $e) {
            \DB::rollBack();
            return response(['result' => $e->getMessage()], 500)->header('Content-Type', 'application/json');
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
        Dictionary::destroy($id);
        DictionaryLanguage::where('dictionary_id',$id)->delete();
    }
}
