<?php

use App\Http\Controllers\Web\Car_brandsController;
use App\Http\Controllers\Web\ContactController;
use App\Http\Controllers\Web\GalleryController;
use App\Http\Controllers\Web\SearchController;
use App\Http\Controllers\Web\StatementsController;
use App\Http\Controllers\Web\SubscirbesController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', function () {
    return redirect(app()->getLocale()?:'ka');
});

Route::group(['prefix' => '{locale}', 'where' => ['locale' => '[a-zA-Z]{2}'], 'middleware' => 'SetLanguage'], function() {

    Route::post('global_search',[SearchController::class,'searchResult']);
    Route::post('send_message',[ContactController::class,'sendMail']);
    Route::post('subscribe',[SubscirbesController::class,'sendMail']);

    Route::get('gallery',[GalleryController::class,'getGallery']);

    Auth::routes();
    Route::get('add-statement', [StatementsController::class, 'addStatements'])->name('addStatement');
    Route::get('{slug}/3', [Car_brandsController::class, 'index'])->name('search_product');
    Route::get('', [\App\Http\Controllers\Web\HomeController::class, 'index'])->name('home_search_product');

});


//Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
