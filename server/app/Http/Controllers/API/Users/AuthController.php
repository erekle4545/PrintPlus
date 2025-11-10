<?php

namespace App\Http\Controllers\API\Users;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\AuthRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    protected AuthRepositoryInterface $authRepository;

    // construct repository
    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }


    /**
     * @return mixed
     * register users
     */
    public function register(Request $request):object
    {
        $data = $request->validate([
            'name' => 'required|string',
            'user_status'=>'required',
            'phone'=>'string',
            'email' => 'required|email|string|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ]
        ]);

        return $this->authRepository->register($data);
    }

    public function getUser ():object{
        return $this->authRepository->getUser();

    }


    /**
     * @return object
     */
    public function getUsers ():object{
        return $this->authRepository->getUsers();

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
        return $this->authRepository->login($credentials);
    }

    public function registerEmployees(Request $request):object
    {
        $data = $request->validate([
            'name' => 'required|string',
            'role_id'=>'required|int',
            'status'=>'required',
            'phone'=>'numeric',
            'email' => 'required|email|string|unique:users,email',
            'password' => [
                Password::min(8)->mixedCase()->numbers()->symbols()
            ]
        ]);

        return $this->authRepository->registerEmployees($data);

    }

    public function updateUser(Request $request,$id):object
    {
        $data = $request->validate([
            'name' => 'required|string',
            'user_status'=>'required',
            'phone'=>'numeric',
            'corp_phone'=>'numeric|nullable',
            'role_id'=>'nullable',
            'email' => 'required|email|string',
            'password' => [
                Password::min(8)->mixedCase()->numbers()->symbols()
            ]
        ]);
        return $this->authRepository->updateUser($data,$id);

    }

    public function deleteUser($id):object{

        return $this->authRepository->deleteUser($id);

    }


    public function logout():object
    {
        return $this->authRepository->logout();

    }

}
