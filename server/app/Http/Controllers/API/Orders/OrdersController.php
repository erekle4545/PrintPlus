<?php

namespace App\Http\Controllers\API\Orders;

use App\Exports\InvoicesExport;
use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\OrdersRepositoryInterface;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class OrdersController extends Controller
{
    protected OrdersRepositoryInterface $ordersRepository;

    // construct repository
    public function __construct(OrdersRepositoryInterface $ordersRepository)
    {
        $this->ordersRepository = $ordersRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request):object
    {
        return $this->ordersRepository->getData($request);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):object
    {
        return $this->ordersRepository->setData($request);

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request,string $id)
    {
        return $this->ordersRepository->show($request,$id);

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return $this->ordersRepository->update($request,$id);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->ordersRepository->delete($id);

    }

    public function getSide(Request $request)
    {
        return $this->ordersRepository->getSide($request);

    }

    public function exportInvoice(Request $request):object{
        return Excel::download(new InvoicesExport($request->id,$request->date_picker,$request->delivery_type), 'invoices.xlsx');
    }


    /**
     * @param Request $request
     * @return mixed
     */
    public function cartUpdate(Request $request)
    {
        return $this->ordersRepository->cartUpdate($request);

    }

    public function deleteCart($id)
    {
        return $this->ordersRepository->deleteCart($id);

    }
}
