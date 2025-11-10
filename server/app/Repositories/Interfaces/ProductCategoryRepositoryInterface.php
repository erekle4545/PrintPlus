<?php

namespace App\Repositories\Interfaces;

interface ProductCategoryRepositoryInterface
{
    public function getData($request);
    public function setData($request);
    public function getSide($request);
    public function show($request,$id);
    public function update($request, $id);
    public function delete($id);

}
