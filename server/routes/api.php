<?php

use App\Http\Controllers\API\Category\ProductCategoryController;
use App\Http\Controllers\API\Config\OptionsController;
use App\Http\Controllers\API\Media\FilesController;
use App\Http\Controllers\API\Media\FoldersController;
use App\Http\Controllers\API\Orders\OrdersController;
use App\Http\Controllers\API\Productions\ProductController;
use App\Http\Controllers\API\Role\RoleController;
use App\Http\Controllers\API\Users\AuthController;
use App\Http\Controllers\API\Users\CustomerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'v1','middleware'=>'auth:sanctum'],function () {

    Route::get('menu/options',[OptionsController::class,'getMenuConfig']);
    Route::get('users/options',[OptionsController::class,'getUserConfig']);
    Route::get('products/options',[OptionsController::class,'getProductConfig']);
    Route::get('category/options',[OptionsController::class,'getCategoryConfig']);
    Route::get('customers/options',[OptionsController::class,'getCustomersConfig']);
    Route::get('orders/options',[OptionsController::class,'getOrdersConfig']);
//    Route::middleware( ['permission:view construction projects'])->get('menu/options',[optionsController::class,'getMenuConfig']);

    Route::get('user',[AuthController::class,'getUser']);
    Route::post('logout', [AuthController::class, 'logout']);
    //File Manager
    Route::apiResource('folders', FoldersController::class);
    Route::get('files',[FilesController::class,'index']);
    Route::post('covers',[FilesController::class,'getCovers']);
    Route::post('image/resize',[FilesController::class,'resize']);
    Route::get('image/{image}',[FilesController::class,'show']);
    Route::get('image/by-folder/{folder}',[FilesController::class,'getByFolder']);
    Route::delete('image/{image}',[FilesController::class,'destroy']);
    // users
    Route::get('users', [AuthController::class, 'getUsers']);

    Route::get('category/side', [ProductCategoryController::class,'getSide']);
    Route::get('product/side', [ProductController::class,'getSide']);
    Route::middleware(['permission:create users'])->post('user/register',[AuthController::class,'registerEmployees']);

    //Category
    Route::middleware(['permission:create category|view category'])->resource('category', ProductCategoryController::class);
    Route::middleware(['permission:update category'])->post('category/update/{id}', [ProductCategoryController::class,'update']);
    Route::middleware(['permission:delete category'])->delete('category/delete/{id}', [ProductCategoryController::class,'destroy']);
    //customers
    Route::middleware(['permission:create customers|view customers'])->resource('customers', CustomerController::class);
    Route::middleware(['permission:update customers'])->post('customer/update/{id}', [CustomerController::class,'update']);
    Route::middleware(['permission:delete customers'])->delete('customer/delete/{id}', [CustomerController::class,'destroy']);
    //orders
    Route::middleware(['permission:create orders|view orders'])->resource('orders', OrdersController::class);
    Route::middleware(['permission:update orders'])->post('order/update/{id}', [OrdersController::class,'update']);
    Route::middleware(['permission:update orders'])->post('cart/update', [OrdersController::class,'cartUpdate']);
    Route::delete('cart/delete/{id}', [OrdersController::class,'deleteCart']);

    Route::middleware(['permission:delete orders'])->delete('order/delete/{id}', [OrdersController::class,'destroy']);
    //product
    Route::middleware(['permission:create products|view products'])->resource('products', ProductController::class);
    Route::middleware(['permission:update products'])->post('product/update/{id}', [ProductController::class,'update']);
    Route::middleware(['permission:view products'])->get('home-production', [ProductController::class,'homeProductions']);
    Route::middleware(['permission:view products'])->get('filter-category-production', [ProductController::class,'filterCategory']);
    Route::middleware(['permission:delete products'])->delete('product/delete/{id}', [ProductController::class,'destroy']);
    //cart
    Route::post('cart', [ProductController::class,'getCart']);
    // Exports
    Route::get('export/invoice', [OrdersController::class,'exportInvoice']);

    Route::get('permissions',[RoleController::class,'getPermissions']);
    Route::middleware( ['permission:view roles'])->resource('role',RoleController::class);
    Route::middleware( ['permission:update roles'])->put('role/update/{id}',[RoleController::class,'update']);
    Route::middleware( ['permission:delete roles'])->delete('role/delete/{id}',[RoleController::class,'destroy']);
    Route::put('update_route_permissions_menu',[RoleController::class,'sync_route_permissions_menu']);
    Route::put('user/update/',[AuthController::class,'updateUserGlobal']);

    Route::middleware( ['permission:delete users'])->delete('user/delete/{id}',[AuthController::class,'deleteUser']);

});
Route::group(['prefix' => 'v1'],function () {
    Route::post('login', [AuthController::class, 'login']);
});

Route::group(['prefix' => 'v2'],function () {
    Route::resource('products', ProductController::class);
    Route::get('user',[AuthController::class,'getUser']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('filter-category-production', [ProductController::class,'filterCategory']);
    Route::resource('category', ProductCategoryController::class);
    Route::get('home-production', [ProductController::class,'homeProductions']);
    Route::get('promo-product', [ProductController::class,'getPromoProduct']);
    Route::get('orders/options',[OptionsController::class,'getOrdersConfig']);
    Route::post('create/web/order', [\App\Http\Controllers\WEB\Order\OrderController::class,'store']);

    Route::post('cart', [ProductController::class,'getCart']);
    Route::get('menu/options',[OptionsController::class,'getMenuConfig']);

});
