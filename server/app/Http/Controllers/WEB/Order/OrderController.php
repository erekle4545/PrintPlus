<?php

namespace App\Http\Controllers\WEB\Order;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Models\Cover;
use App\Models\Customer;
use App\Models\OrderItems;
use App\Models\Orders;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            if(count($request->cart) > 0){

                if($request->user_surname){
                    $customerId =  Customer::create([
                        'surname'=>$request->user_surname,
                        'phone'=>$request->user_phone,
                    ]);
                }

                $order = Orders::create([
                    'surname'=>$request->surname,
                    'phone'=>$request->phone,
                    'address'=>$request->address,
                    'customer_id'=>$customerId->id,
                    'card_text'=>$request->card_text,
                    'comments'=>$request->comments,
                    'price'=>$request->price,
                    'delivery_time'=>$request->delivery_time,
                    'payment_state'=>$request->payment_method,
                    'delivery_date'=>Carbon::parse($request->delivery_date),
                    'user_id'=>Auth::id()??null,
                ]);



                foreach ($request->cart as $value){
                    OrderItems::query()->create([
                        'order_id'=>$order->id,
                        'product_id'=>$value['id'],
                        'price'=>$value['price'],
                        'color'=>$value['color'],
                        'qty'=>$value['qty'],
                        'total_price'=>$value['qty']*$value['price'],
                    ]);
                }

                if($request->payment_method === 1){
                    $returnUrl= '/orders/transfer/'.$order->id;
                }else{
                    $returnUrl= '/404';

                }

                $customerResData = [
                    'return_url'=>$returnUrl,
                ];
            }
            DB::commit();

            return response($customerResData, 200)->header('Content-Type', 'application/json');

        }catch (\Exception $exception){
            DB::rollBack();
            return response(['result' => $exception->getMessage()], 500)->header('Content-Type', 'application/json');
        }
    }
}
