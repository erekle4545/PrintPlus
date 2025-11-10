<?php

namespace App\Repositories\Interfaces;

interface AuthRepositoryInterface
{
    public function register(array $data);
    public function registerEmployees(array $data);
    public function login(array $credentials);
    public function getUser();
    public function getUsers();
    public function logout();
    public function updateUser(array $data,$id);
    public function updateUserGlobal(array $data);
    public function deleteUser($id);
}
