<?php

namespace App\Http\Controllers\API\Users;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected CustomerRepositoryInterface $customerRepository;

    // construct repository
    public function __construct(CustomerRepositoryInterface $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request):object
    {
        return $this->customerRepository->getData($request);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):object
    {
        return $this->customerRepository->setData($request);

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request,string $id)
    {
        return $this->customerRepository->show($request,$id);

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return $this->customerRepository->update($request,$id);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->customerRepository->delete($id);

    }

    public function getSide(Request $request)
    {
        return $this->customerRepository->getSide($request);

    }
}
