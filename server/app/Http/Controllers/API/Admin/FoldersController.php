<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\FoldersResource;
use App\Models\Core\Folder;
use App\Http\Requests\StoreFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use Illuminate\Http\Request;

class FoldersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return FoldersResource::collection(Folder::where('user_id',$request->user()->id)->paginate());

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
     * @param  \App\Http\Requests\StoreFolderRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreFolderRequest $request)
    {
        $data = $request->all();
        $data['user_id'] = $request->user()->id;
        $folder = Folder::create($data);
        return new FoldersResource($folder);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Core\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request,Folder $folder)
    {
        if($folder->user_id != $request->user()->id){
            return abort(403,'Unauthorized');
        }else{
            return new FoldersResource($folder);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Core\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function edit(Folder $folder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateFolderRequest  $request
     * @param  \App\Models\Core\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateFolderRequest $request, Folder $folder)
    {
        if($folder->user_id != $request->user()->id){
            return abort(403,'Unauthorized');
        }else{
            $folder->update($request->all());
            return new FoldersResource($folder);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Core\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function destroy(Folder $folder)
    {
        if($folder->user_id != $folder->user()->id){
            return abort(403,'Unauthorized');
        }else {
            $folder->delete();
            return response('', 204);
        }
    }
}
