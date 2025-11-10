<?php

namespace App\Repositories\Users;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\Interfaces\AuthRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthRepository implements AuthRepositoryInterface
{

    /**
     * @param array $data
     * @return object
     */
    public function register(array $data):object
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone'=> $data['phone'],
            'password' => bcrypt($data['password'])
        ]);
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }


    /**
     * @param array $data
     * @return object
     */
    public function registerEmployees(array $data):object
    {

        $password = Str::random(8);
        $user = User::factory()->count(1)->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => $data['password']?: bcrypt($password)
        ]);

        $user->each(function ($user) use ($data){
            $user->assignRole($data['role_id']);
        });

        return response([
            'user' => $user,
        ]);
    }


    /**
     * @param array $credentials
     * @return object
     */
    public function login(array $credentials):object
    {

        $remember = $credentials['remember'] ?? false;

        unset($credentials['remember']);

        if (!Auth::attempt($credentials, $remember)) {
            return response([
                'error' => 'The Provided credentials are not correct'
            ], 422);
        }

        $user = Auth::user();

        // get userData
        $userData = User::query()->where(['id'=>$user->id])->with('roles.permissions')->first();

        if ($userData){

            $token = $user->createToken($userData->name)->plainTextToken;

            return response([
                'user' => $userData,
                'token' => $token
            ]);

        }else{
            Auth::logout();
            return response()->json('error',500);
        }

    }


    /**
     * @return object
     */
    public function getUser():object
    {

        $user = Auth::user();

        $userData = User::query()->where('id',$user->id)->with(['roles.permissions'])->first();

        return new UserResource($userData);

    }

    public function getUsers():object
    {


        $userData = User::query()->with(['roles.permissions'])->get();

        return new UserResource($userData);

    }


    /**
     * @return object
     */
    public function logout():object
    {

        $user = Auth::user();
        // Revoke the token that was used to authenticate the current request...
        $user->currentAccessToken()->delete();
        return response([
            'success' => true
        ]);

    }


    /**
     * @param array $data
     * @param $id
     * @return object
     */
    public function updateUser(array $data,$id):object
    {
        try {
            $updateUser = User::query()->find($id);
            $updateUser->syncRoles($data['role_id']);
            $updateUser->update($data);
            return  response()->json($updateUser,200);
        }catch (\Exception $exception){
            return  response()->json($exception,500);
        }
    }


    /**
     * @param array $data
     * @return object
     */
    public function updateUserGlobal(array $data):object
    {

        $updateUser =  User::find(auth()->user()->id);

        if(isset($data['password'])){

            $updateUser->update([
                'name'=>$data['name'],
                'phone'=>$data['phone'],
                'email'=>$data['email'],
                'password'=>bcrypt($data['password'])
            ]);

        }else{
            $updateUser->update([
                'name'=>$data['name'],
                'phone'=>$data['phone'],
                'email'=>$data['email'],
            ]);
        }

        return  response($updateUser);
    }

    /**
     * @param $id
     * @return object
     */
    public function deleteUser($id):object
    {
        $userDestroy = User::destroy($id);
        return response($userDestroy);
    }
}
