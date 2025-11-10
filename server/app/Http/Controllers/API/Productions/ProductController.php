<?php

namespace App\Http\Controllers\API\Productions;

use App\Http\Controllers\Controller;
use App\Models\Products;
use App\Repositories\Interfaces\ProductsRepositoryInterface;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected ProductsRepositoryInterface $productsRepository;

    // construct repository
    public function __construct(ProductsRepositoryInterface $productsRepository)
    {
        $this->productsRepository = $productsRepository;
    }


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request):object
    {
        return $this->productsRepository->getData($request);
    }

    /**
     * @param Request $request
     * @return object
     */
    public function getCart(Request $request):object
    {
        return $this->productsRepository->getCart($request);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):object
    {
        return $this->productsRepository->setData($request);

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request,string $id)
    {
        return $this->productsRepository->show($request,$id);

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return $this->productsRepository->update($request,$id);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->productsRepository->delete($id);

    }

    public function getSide(Request $request)
    {
        return $this->productsRepository->getSide($request);

    }

    public function homeProductions(Request $request)
    {
        return $this->productsRepository->homeProductions($request);

    }

    /**
     * @return object
     * get cart  items
     */
    public function cart(Request $request):object
    {
        return $this->productsRepository->getCartItems($request);
    }

    /**
     * @param Request $request
     * @return object
     */
    public function filterCategory(Request $request):object
    {
        return $this->productsRepository->filterCategory($request);
    }

    public function getPromoProduct():object
    {
        $pro = Products::query()->where('status','!=',2)->with('covers')->inRandomOrder()->first();

        return response()->json($pro);
    }

}
