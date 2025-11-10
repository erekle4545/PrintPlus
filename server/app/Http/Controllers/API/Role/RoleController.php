<?php

namespace App\Http\Controllers\API\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRole;
use App\Http\Requests\StoreRoleUpdate;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use Illuminate\Http\Request;

class RoleController extends Controller
{


    protected RoleRepositoryInterface $roleRepository;

    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
        $this->middleware('auth');
    }

    /**
     * get role data from repo
     * @return mixed
     */
    public function index():object
    {
        return $this->roleRepository->getData();
    }


    /**
     * create role
     * @param StoreRole $storeRole
     * @return mixed
     */
    public function store(StoreRole $storeRole):object
    {
        $data = $storeRole->validated();
        return $this->roleRepository->store($data);
    }

    /**
     * @param $id
     * @return object
     */
    public function show($id):object
    {
        return $this->roleRepository->show($id);

    }


    /**
     * @param StoreRoleUpdate $request
     * @param $id
     * @return object
     */
    public function update(StoreRoleUpdate $request,$id):object
    {
        return $this->roleRepository->update($request,$id);

    }

    /**
     * @param Request $request
     * @return object
     */
    public function sync_route_permissions_menu(Request $request):object
    {
        $data = $request->validate([
            'permissions'=>'array',
            'role_id'=>'required'
        ]);

        return $this->roleRepository->sync_route_permissions_menu($data);

    }

    /**
     * Remove the specified resource from storage.
     * @param  int  $id
     */
    public function destroy($id)
    {
        return $this->roleRepository->destroy($id);

    }

    /**
     * @return object
     */
    public function getPermissions():object{
        return $this->roleRepository->getPermissions();
    }


}
