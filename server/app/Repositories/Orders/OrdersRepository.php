<?php

namespace App\Repositories\Orders;

use App\Helpers\Core\Multitenant;
use App\Http\Resources\OrderResource;
use App\Models\Cover;
use App\Models\Customer;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Repositories\Interfaces\OrdersRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrdersRepository implements OrdersRepositoryInterface
{
    public function getData($request): object
    {

        $customer = Orders::query();
        if($request->date_picker){
            $customer->whereBetween('delivery_date', [Carbon::parse($request->date_picker[0])->startOfDay(), Carbon::parse($request->date_picker[1])->endOfDay()]);
        }
        if ($request->keyword) {
            $customer->where('surname', 'like', '%' . $request->keyword . '%');
        }

        if ($request->status) {
            $customer->where('status', $request->status);
        }

        if ($request->paymentStates) {
            $customer->where('payment_state', $request->paymentStates);
        }
        if ($request->deliveryTypes) {
            $customer->where('delivery_type', $request->deliveryTypes);
        }

        if ($request->category_id) {
            $customer->where('category_id', $request->category_id);
        }

        if ($request->user_id) {
            $customer->where('user_id', $request->user_id);
        }





        return new OrderResource($customer->with(['covers','orderItems.product','employees'])->orderByDesc('id')->paginate(10));

    }

    /**
     * @param $request
     * @return Object
     */
    public function setData($request): object
    {
        DB::beginTransaction();

        try {
            if(count($request->cart) > 0){

                if($request->customer_add){
                   $customerId =  Customer::create([
                        'social_name'=>$request->social_name,
                        'surname'=>$request->surname,
                        'phone'=>$request->phone,
                        'address'=>$request->address,
                        'payment_state'=>$request->payment_state,
                        'facebook_correspondence'=>$request->facebook_correspondence,
                    ]);
                }

                $customer = Orders::create([
                    'social_name'=>$request->social_name,
                    'surname'=>$request->surname,
                    'phone'=>$request->phone,
                    'address'=>$request->address,
                    'payment_state'=>$request->payment_state,
                    'customer_id'=>$request->customer_id?:$customerId->id,
                    'facebook_correspondence'=>$request->facebook_correspondence,
                    'delivery_type'=>$request->delivery_type,
                    'comments'=>$request->comments,
                    'card_text'=>$request->card_text,
                    'price'=>$request->price,
                    'delivery_date'=>Carbon::parse($request->delivery_date),
                    'user_id'=>Auth::id(),
                ]);



                foreach ($request->cart as $value){
                    OrderItems::query()->create([
                        'order_id'=>$customer->id,
                        'product_id'=>$value['id'],
                        'price'=>$value['price'],
                        'color'=>$value['color'],
                        'qty'=>$value['qty'],
                        'total_price'=>$value['qty']*$value['price'],
                    ]);
                }

                if($request->cover_id) {
                    /**
                     * covers
                     */
                    foreach ($request->cover_id as $key => $value) {
                        Cover::Create([
                            'files_id'       => $value,
                            'cover_type'     => $request->cover_type[$key],
                            'coverable_type' => Multitenant::getModel('Orders'),
                            'coverable_id'   => $customer->id,
                        ]);
                    }
                }

                $customerResData = [
                    'id'=>$customer->id,
                    'customer_id'=>$customer->customer_id
                ];
            }
            DB::commit();

            return response($customerResData, 200)->header('Content-Type', 'application/json');

        }catch (\Exception $exception){
            DB::rollBack();
            return response(['result' => $exception->getMessage()], 500)->header('Content-Type', 'application/json');
        }
    }

    /**
     * @param $request
     * @param $id
     * @return  object
     */
    public function show($request,$id):object
    {
        try {
            $model = Multitenant::getModel('Orders');
            //Find page with id and language id
            $customer = $model::with(['covers','employees','orderItems.product.covers'])->findOrFail($id);

            return new OrderResource($customer);

        } catch (\Exception $e) {
            return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }

    }


    /**
     * @param $request
     * @param $id
     */
    public function update($request, $id):object
    {
        try {
            if($request->customer_add){
               $customerId =  Customer::create([
                    'social_name'=>$request->social_name,
                    'surname'=>$request->surname,
                    'phone'=>$request->phone,
                    'address'=>$request->address,
                    'payment_state'=>$request->payment_state,
                    'facebook_correspondence'=>$request->facebook_correspondence,
                ]);
            }
            //Find Page
            $customer = Orders::findOrFail($id);
            $customer->social_name = $request->social_name;
            $customer->surname = $request->surname;
            $customer->status = $request->status;
            $customer->phone = $request->phone;
            $customer->address = $request->address;
            $customer->payment_state = $request->payment_state;
            $customer->comments = $request->comments;
            $customer->price = $request->price;
            $customer->customer_id = $request->customer_id?:$customerId->id;
            $customer->card_text = $request->card_text?:$customerId->id;
            $customer->delivery_type = $request->delivery_type;
            $customer->delivery_date = Carbon::parse($request->delivery_date);
            $customer->facebook_correspondence = $request->facebook_correspondence;
            $customer->save();

            /**
             * Attache covers
             */
            $coverModel = Multitenant::getModel('Cover');
            $coverModel::where('coverable_type', Multitenant::getModel('Orders'))->where('coverable_id', $customer->id)->delete();

            if ($request->cover_id) {
                //Remove covers
                foreach ($request->cover_id as $key => $value) {
                    $coverModel::Create([
                        'files_id' => $value,
                        'cover_type' => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('Orders'),
                        'coverable_id' => $customer->id,
                    ]);
                }
            }

            return new OrderResource($customer);

        } catch (\Exception $e) {
            return response(['error' => $e], 404)->header('Content-Type', 'application/json');
        }

    }

    /**
     * @param $id
     * @return
     */
    public function delete( $id):object
    {
        $customer = Orders::destroy($id);

        return response(['result' => $customer], 200)->header('Content-Type', 'application/json');
    }

    /**
     * @param $request
     * @return object|OrderResource
     */
    public function getSide( $request):object
    {
        $res = Orders::query()->select(['surname','id','created_at'])->limit(5)->orderBy('created_at','DESC')->get();

        return new OrderResource($res);
    }

    public function cartUpdate($request)
    {
        try {
            if(count($request->item) > 0 ){

                foreach ($request->item as $row){
//                    $countItem = OrderItems::query()->where('product_id',$row['id'])->count();
                    if($request->add_new ){

                            OrderItems::query()->create([
                                'order_id'=>$request->order_id,
                                'product_id'=>$row['id'],
                                'price'=>$row['price'],
                                'color'=>$row['color'],
                                'qty'=>$row['qty'],
                                'total_price'=>$row['qty']*$row['price'],
                            ]);

                    }else{
                        $or = OrderItems::query()->findOrFail($row['id']);

                        $or->qty = $row['qty'];
                        $or->save();
                    }

                }

            }
            return response()->json(['data'=>now()]);

        }catch (\Exception $exception){
            return response()->json(['errors'=>$exception]);
        }

    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteCart($id)
    {
        try {
            OrderItems::destroy($id);
            return response()->json(['data'=>now()]);

        }catch (\Exception $exception){
            return response()->json(['errors'=>$exception]);
        }
    }

}
