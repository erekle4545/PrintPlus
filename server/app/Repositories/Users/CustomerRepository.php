<?php

namespace App\Repositories\Users;

use App\Helpers\Core\Multitenant;
use App\Http\Resources\CustomerResource;
use App\Models\Cover;
use App\Models\Customer;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CustomerRepository implements CustomerRepositoryInterface
{
    /**
     * @param $request
     * @return object|CustomerResource
     */

    public function getData($request): object
    {

        $customer = Customer::query()->with('covers');

        if ($request->keyword) {
            $customer->where('surname', 'like', '%' . $request->keyword . '%');
        }

        if ($request->status) {
            $customer->where('status', $request->status);
        }

        $customer->orderBy('created_at', 'desc');

        return new CustomerResource($customer->paginate(10));

    }

    /**
     * @param $request
     * @return Object
     */
    public function setData($request): object
    {
        DB::beginTransaction();

        try {
            $customer = Customer::create([
                'social_name'=>$request->social_name,
                'surname'=>$request->surname,
                'phone'=>$request->phone,
                'address'=>$request->address,
                'payment_state'=>$request->payment_state,
                'facebook_correspondence'=>$request->facebook_correspondence,
            ]);

            if($request->cover_id) {
                /**
                 * covers
                */
                foreach ($request->cover_id as $key => $value) {
                    Cover::Create([
                        'files_id'       => $value,
                        'cover_type'     => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('Customer'),
                        'coverable_id'   => $customer->id,
                    ]);
                }
            }

            $customerResData = [
                'id'=>$customer->id,
                ];

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
            $model = Multitenant::getModel('Customer');
            //Find page with id and language id
            $customer = $model::with('covers')->findOrFail($id);

            return new CustomerResource($customer);

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
            //Find Page
            $customer = Customer::with('covers')->findOrFail($id);
            $customer->social_name = $request->social_name;
            $customer->surname = $request->surname;
            $customer->status = $request->status;
            $customer->phone = $request->phone;
            $customer->address = $request->address;
            $customer->payment_state = $request->payment_state;
            $customer->facebook_correspondence = $request->facebook_correspondence;
            $customer->save();

            /**
             * Attache covers
             */
            $coverModel = Multitenant::getModel('Cover');
            $coverModel::where('coverable_type', Multitenant::getModel('Customer'))->where('coverable_id', $customer->id)->delete();

            if ($request->cover_id) {
                //Remove covers
                foreach ($request->cover_id as $key => $value) {
                    $coverModel::Create([
                        'files_id' => $value,
                        'cover_type' => $request->cover_type[$key],
                        'coverable_type' => Multitenant::getModel('Customer'),
                        'coverable_id' => $customer->id,
                    ]);
                }
            }

            return new CustomerResource($customer);

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
        $customer = Customer::destroy($id);

        return response(['result' => $customer], 200)->header('Content-Type', 'application/json');
    }

    /**
     * @param $request
     * @return object|CustomerResource
     */
    public function getSide( $request):object
    {
        $res = Customer::query()->select(['surname','id','created_at'])->limit(5)->orderBy('created_at','DESC')->get();

        return new CustomerResource($res);
    }

}
