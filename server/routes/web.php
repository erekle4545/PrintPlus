<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/{path?}', function () {
    return view('welcome');
})->where('path', '.*');
Route::get('export/invoice', [\App\Http\Controllers\API\Orders\OrdersController::class,'exportInvoice']);
//Route::group([ 'where' => ['locale' => '[a-zA-Z]{2}']], function() {
////    Route::get('/{slug?}', '\App\Http\Controllers\Web\HomeController@index')->where('slug', '([A-Za-z0-9\-\/]+)');
//    return view('welcome');
//
//});
