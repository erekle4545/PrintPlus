<?php

namespace App\Repositories\Interfaces;

interface OrdersRepositoryInterface
{
    public function getData($request);
    public function setData($request);
    public function getSide($request);
    public function show($request,$id);
    public function update($request, $id);
    public function delete($id);
    public function cartUpdate($request);
    public function deleteCart($id);
}
