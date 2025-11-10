<?php

namespace App\Repositories\Role;

use App\Http\Resources\PermissionsResource;
use App\Http\Resources\RoleResource;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleRepository implements  RoleRepositoryInterface
{
    /** get role data
     * @return object
     */
    public function getData():object{
        return RoleResource::collection(Role::query()->orderBy('created_at','DESC')->where('id','!=',1)->with('permissions')->paginate(20));
    }

    /**
     * create role
     * @param $data
     * @return object
     */
    public function store(array $data):object
    {

        $role = \Spatie\Permission\Models\Role::create([
            'name'=>$data['name'],
            'guard_name'=>$data['guard_name']
        ]);

        return response($role);
    }

    /**
     * update role
     * @param $request
     * @param $id
     * @return object
     */
    public function update($request,$id):object
    {
        try {
            $role = Role::query()->findOrFail($id);
            $role->update(['name'=>$request->name]);
            return response($role);
        }catch (\Exception $e){
            return  response($e,500);
        }
    }

    /**
     * sync route permissions menu
     * @param array $data
     * @return RoleResource
     */
    public function sync_route_permissions_menu(array $data):RoleResource{

        $role = \Spatie\Permission\Models\Role::where('id',$data['role_id'])->first();
        $role->syncPermissions($data['permissions']);

        return new RoleResource($role);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function show($id)
    {

        return RoleResource::collection(Role::orderBy('created_at','DESC')->where('id',$id)->with(['permissions'])->get());

    }
    /**
     * delete role
     * @param $id
     * @return void
     */
    public function destroy($id):void{
        Role::destroy($id);
    }

    /**
     * get all permissions
     * @return PermissionsResource
     */
    public function getPermissions():object{
        return PermissionsResource::collection(Permission::orderBy('created_at','DESC')->get());
    }

    /**
     * construction company role
     * @return object
     */
    public function ConstructionCompanyRole():object
    {
        return RoleResource::collection(Role::query()->where('id','!=',1)->orderBy('created_at','DESC')->with('permissions')->get());
    }

    /**
     * construction company permissions
     * @return object
     */
    public function ConstructionCompanyPermissions():object
    {
        return PermissionsResource::collection(Permission::orderBy('created_at','DESC')->get());
    }
}
