<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\UsersResource;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\User;
use http\Env\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\Fluent\Concerns\Has;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
//        $roles = Role::get();


        $data = $request->validate([
            'name' => 'required|string',
            'role_id'=>'required',
            'user_status'=>'required',
            'phone'=>'string',
            'email' => 'required|email|string|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ]
        ]);

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone'=> $data['phone'],
            'role_id' => $data['role_id'],
            'user_status'=>$data['user_status'],
            'password' => bcrypt($data['password'])
        ]);
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function registerEmployees(Request $request)
    {
//        $roles = Role::get();

        $password =  Hash::make(Str::random(8));

        $data = $request->validate([
            'name' => 'required|string',
            'role_id'=>'required',
            'user_status'=>'required',
            'local'=>'required',
            'construction_companies_id'=>'required',
            'phone'=>'numeric',
            'email' => 'required|email|string|unique:users,email',
//            'password' => [
//                'required',
//                Password::min(8)->mixedCase()->numbers()->symbols()
//            ]
        ]);

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone'=> $data['phone'],
            'role_id' => $data['role_id'],
            'local'=>$data['local'],
            'construction_companies_id'=>$data['construction_companies_id'],
            'user_status'=>$data['user_status'],
            'password' => bcrypt($password)
        ]);
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email|string|exists:users,email',
            'password' => [
                'required',
            ],
            'remember' => 'boolean'
        ]);
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!Auth::attempt($credentials, $remember)) {
            return response([
                'error' => 'The Provided credentials are not correct'
            ], 422);
        }
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }


    public function logout()
    {
        /** @var User $user */
        $user = Auth::user();
        // Revoke the token that was used to authenticate the current request...
        $user->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }

    public function getUsers(Request $request){

        if($request->keyword){
            $user = User::where('name', 'like', '%' . $request->keyword . '%')->orderBy('id','DESC')->with('role');
        }else{
            $user = User::orderBy('id','DESC')->with('role');
        }

        if ($request->status) {
            $user->where('user_status', $request->status);
        }

        return new UsersResource($user->paginate(10));
    }
    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function getUserEmployeesRealtor(){
        $user = User::orderBy('id','DESC')->where('user_status','0')->where('local','realtor')->orwhere('local','global')->with('role')->get();
        return response($user);
    }


    public function getUserEmployeesConstruction(){

        $user = User::orderBy('id','DESC')->where('user_status','0')->where('local','construction')->orwhere('local','global')->with('role')->with('constructionCompany')->get();

        return response($user);
    }

    /**
     * @param $id
     * @return void
     */
    public function updateUser(Request $request,$id){
        $data = $request->validate([
            'name' => 'required|string',
            'role_id'=>'required',
            'user_status'=>'required',
            'phone'=>'numeric',
            'email' => 'required|email|string',
//            'password' => [
//                'required',
//                Password::min(8)->mixedCase()->numbers()->symbols()
//            ]
        ]);

        $updateUser = User::where('id',$id)->update($data);

        return; response($updateUser);
    }

    /**
     * @param $id
     * @return void
     */
    public function deleteUser($id){
        $userDestroy = User::destroy($id);

        return response($userDestroy);
    }

}
