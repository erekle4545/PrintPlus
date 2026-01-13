<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    public array $data = array();
    public function getCheckoutConfig(){

        $data['cities'] = array_values(config('order.cities'));
        $data['paymentMethods'] = array_values(config('order.paymentMethods'));

        return response()->json($data);
    }
}
