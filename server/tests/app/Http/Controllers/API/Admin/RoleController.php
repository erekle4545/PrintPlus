<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRole;
use App\Http\Requests\StoreRoleUpdate;
use App\Http\Resources\PermissionsResource;
use App\Http\Resources\RoleResource;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return RoleResource::collection(Role::orderBy('created_at','DESC')->with('permissions')->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request,StoreRole $storeRole)
    {

        $data = $storeRole->validated();

       $addRole = Role::create($data);
       $roleRes =  new RoleResource($addRole);

       $rolePermission =  Role::where('id',$roleRes->id)->first();

       $rolePermission->permissions()->sync([$request->permissions]);

       return $roleRes;
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
    public function update(Request $request,StoreRoleUpdate $storeRoleUpdate,$id)
    {
        $data = $storeRoleUpdate->validated();
        Role::where('id',$id)->update($data);

        $rolePermission =  Role::where('id',$id)->first();

        $rolePermission->permissions()->sync([$request->permissions]);
        return response($rolePermission);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request,$id)
    {
        //$delete_response =  Role::find($request->id)->delete();
        //$delete_response->detach();
        //$delete_response =  Realtor::destroy($request->id)->delete();
        //return response($delete_response);
        Role::destroy($id);

    }

    public function getPermissions(){
        return PermissionsResource::collection(Permission::orderBy('created_at','DESC')->get());
    }



}
