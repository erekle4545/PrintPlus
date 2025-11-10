<?php

namespace App\Http\Controllers\API\Category;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\ProductCategoryRepositoryInterface;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{

    protected ProductCategoryRepositoryInterface $productCategoryRepository;

    // construct repository
    public function __construct(ProductCategoryRepositoryInterface $productCategoryRepository)
    {
        $this->productCategoryRepository = $productCategoryRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request):object
    {
        return $this->productCategoryRepository->getData($request);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):object
    {
        return $this->productCategoryRepository->setData($request);

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request,string $id)
    {
        return $this->productCategoryRepository->show($request,$id);

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return $this->productCategoryRepository->update($request,$id);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->productCategoryRepository->delete($id);

    }

    public function getSide(Request $request)
    {
        return $this->productCategoryRepository->getSide($request);

    }
}
