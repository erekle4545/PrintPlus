<?php

namespace App\Http\Controllers\API\Config;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\MenuResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\UserResource;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Support\Arr;
use Spatie\Permission\Models\Role;

class OptionsController extends Controller
{
    public function getMenuConfig()
    {
//      $data['statuses']   = config('menu.status');
        $data['templates']  = array_values(config('menu.templates'));

        return new MenuResource(collect($data));
    }

    public function getProductConfig()
    {
        $data['coverTypes'] = array_values(Arr::only(config('files.covers'), config('products.covers')));
        $data['statuses'] = config('products.status');
        $data['categories'] = ProductCategory::query()->select('title','id')->get();

        return new ProductResource(collect($data));
    }

    public function getCategoryConfig()
    {
        $data['coverTypes'] = array_values(Arr::only(config('files.covers'), config('products.covers')));
        $data['statuses'] = config('category.status');

        return new CategoryResource(collect($data));
    }

    public function getCustomersConfig()
    {
        $data['coverTypes'] = array_values(Arr::only(config('files.covers'), config('customers.covers')));
        $data['statuses'] = config('customers.status');
        $data['paymentStates'] = array_values(config('customers.payments_states'));

        return new CustomerResource(collect($data));
    }

    public function getOrdersConfig()
    {
        $data['coverTypes'] = array_values(Arr::only(config('files.covers'), config('order.covers')));
        $data['statuses'] = config('customers.status');
        $data['paymentStates'] = array_values(config('order.payments_states'));
        $data['delivery_types'] = array_values(config('order.delivery_types'));
        $data['delivery_prices'] = array_values(config('order.delivery_prices'));
        $data['delivery_time'] = array_values(config('order.delivery_time'));
        $data['users'] = User::query()->select('name','id')->get();

        return new OrderResource(collect($data));
    }

    public function getUserConfig()
    {
        $data['statuses'] = config('category.status');
        $data['roles'] = Role::query()->get();

        return new UserResource(collect($data));
    }
}
