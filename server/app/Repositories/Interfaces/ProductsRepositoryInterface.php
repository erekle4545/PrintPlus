<?php

namespace App\Repositories\Interfaces;

interface ProductsRepositoryInterface
{
    public function getData($request);
    public function setData($request);
    public function getSide($request);
    public function show($request,$id);
    public function update($request, $id);
    public function delete( $id);
    public function homeProductions( $request);
    public function getCartItems($request);
    public function filterCategory($request);
    public function getCart( $request);

}
