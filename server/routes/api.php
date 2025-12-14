<?php

use App\Http\Controllers\API\Admin\AuthController;
use App\Http\Controllers\API\Admin\CategoryController;
use App\Http\Controllers\API\Admin\ColorsController;
use App\Http\Controllers\API\Admin\DashboardController;
use App\Http\Controllers\API\Admin\DictionaryController;
use App\Http\Controllers\API\Admin\ExtrasController;
use App\Http\Controllers\API\Admin\FilesController;
use App\Http\Controllers\API\Admin\FoldersController;
use App\Http\Controllers\API\Admin\GalleryController;
use App\Http\Controllers\API\Admin\LanguagesController;
use App\Http\Controllers\API\Admin\MenuController;
use App\Http\Controllers\API\Admin\OptionsController;
use App\Http\Controllers\API\Admin\PagesController;
use App\Http\Controllers\API\Admin\PostsController;
use App\Http\Controllers\API\Admin\ProductsController;
use App\Http\Controllers\API\Admin\RoleController;
use App\Http\Controllers\API\Admin\ServicesController;
use App\Http\Controllers\API\Admin\SettingsController;
use App\Http\Controllers\API\Admin\SizesController;
use App\Http\Controllers\API\Admin\SliderController;
use App\Http\Controllers\API\Admin\TeamController;
use App\Http\Controllers\API\Web\SocialAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'v1','middleware'=>'auth:sanctum'],function () {
    // User
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/users', [AuthController::class, 'getUsers']);

    // End User
    // Dashboard
        Route::resource('/dashboard', DashboardController::class);
    // End Dashboard
    // Permissions and Roles
        Route::resource('/permissions',RoleController::class);
        Route::resource('/role',RoleController::class);
        Route::delete('/delete_role/{id}',[RoleController::class,'destroy']);
        Route::put('/role/update/{id}',[RoleController::class,'update']);
    // END Permissions and Roles
    //Language
        Route::resource('languages', LanguagesController::class);
        Route::put('lang/update_status/{id}',[LanguagesController::class,'LangStatusUpdate']);
        Route::put('lang/update_default/{id}',[LanguagesController::class,'defaultLangUpdate']);
        Route::delete('lang/delete/{id}',[LanguagesController::class,'destroy']);
        Route::resource('dictionary', DictionaryController::class);
        Route::delete('dictionary/delete/{id}',[DictionaryController::class,'destroy']);
        Route::put('dictionary/update/{id}',[DictionaryController::class,'update']);
     // Page
        Route::post('page/update/{id}', [PagesController::class,'update']);
        Route::delete('page/delete/{id}', [PagesController::class,'destroy']);
        Route::get('page/side', [PagesController::class,'pageSideBar']);
        Route::resource('page', PagesController::class)->only([
            'index', 'store', 'show', 'destroy'
        ]);
    // post
        Route::post('post/update/{id}', [PostsController::class,'update']);
        Route::delete('post/delete/{id}', [PostsController::class,'destroy']);
        Route::get('post/side', [PostsController::class,'postSideBar']);
        Route::resource('post', PostsController::class)->only([
            'index', 'store', 'show', 'destroy'
        ]);

        // services
        Route::post('service/update/{id}', [ServicesController::class,'update']);
        Route::delete('service/delete/{id}', [ServicesController::class,'destroy']);
        Route::get('service/side', [ServicesController::class,'postSideBar']);
        Route::resource('service', ServicesController::class)->only([
            'index', 'store', 'show', 'destroy'
        ]);
    // Options
        Route::get('options/page',[OptionsController::class,'getPageConfig']);
        Route::get('options/post',[OptionsController::class,'getPostConfig']);
        Route::get('options/service',[OptionsController::class,'getPostConfig']);
        Route::get('options/users',[OptionsController::class,'getUsersConfig']);
        Route::get('options/category',[OptionsController::class,'getCategoryConfig']);
        Route::get('options/product',[OptionsController::class,'getProductConfig']);
        Route::get('options/slider',[OptionsController::class,'getSliderConfig']);
        Route::get('options/gallery',[OptionsController::class,'getGalleryConfig']);
        Route::get('options/team',[OptionsController::class,'getTeamConfig']);
        Route::get('options/menu',[OptionsController::class,'getMenuConfig']);
        Route::get('options/settings',[OptionsController::class,'getSettingsConfig']);
    // Menu
        Route::get('menu/sort', [  MenuController::class,'updateSortPosition']);
        Route::post('menu/update/{id}', [MenuController::class,'update']);
        Route::delete('menu/delete/{id}', [MenuController::class,'destroy']);
        Route::resource('menu', MenuController::class);
        Route::post('menu/sort', [MenuController::class,'updateSortPosition']);
    //Category
        Route::get('category/side', [CategoryController::class,'categorySide']);
        Route::resource('category', CategoryController::class);
        Route::post('category/update/{id}', [CategoryController::class,'update']);
        Route::delete('category/delete/{id}', [CategoryController::class,'destroy']);

     //product
        Route::get('product/side', [ProductsController::class,'productSide']);
        Route::resource('product', ProductsController::class);
        Route::post('product/update/{id}', [ProductsController::class,'update']);
        Route::delete('product/delete/{id}', [ProductsController::class,'destroy']);
    // Slider
        Route::get('slider/side', [SliderController::class,'sliderSide']);
        Route::resource('slider', SliderController::class);
        Route::post('slider/update/{id}', [SliderController::class,'update']);
        Route::delete('slider/delete/{id}', [SliderController::class,'destroy']);
    // gallery
        Route::get('gallery/side', [GalleryController::class,'gallerySide']);
        Route::resource('gallery', GalleryController::class);
        Route::post('gallery/update/{id}', [GalleryController::class,'update']);
        Route::delete('gallery/delete/{id}', [GalleryController::class,'destroy']);
    // Team
        Route::get('team/side', [TeamController::class,'teamSide']);
        Route::resource('team', TeamController::class);
        Route::post('team/update/{id}', [TeamController::class,'update']);
        Route::delete('team/delete/{id}', [TeamController::class,'destroy']);
    //File Manager
        Route::apiResource('folders', FoldersController::class);
        Route::get('files',[FilesController::class,'index']);
        Route::post('covers',[FilesController::class,'getCovers']);
        Route::post('image/resize',[FilesController::class,'resize']);
        Route::get('image/{image}',[FilesController::class,'show']);
        Route::get('image/by-folder/{folder}',[FilesController::class,'getByFolder']);
        Route::delete('image/{image}',[FilesController::class,'destroy']);
    //Settings
        Route::resource('settings', SettingsController::class);
        Route::post('settings/update/{id}', [SettingsController::class,'update']);
        Route::delete('settings/delete/{id}', [SettingsController::class,'destroy']);

        Route::apiResource('colors', ColorsController::class);
        Route::apiResource('sizes', SizesController::class);
        Route::apiResource('extras', ExtrasController::class);
});

Route::group(['prefix' => 'v1'], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});


// Public routes
Route::prefix('web')->group(function () {

    // Laravel Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Social Authentication
    Route::get('/auth/{provider}', [SocialAuthController::class, 'redirectToProvider']);
    Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback']);
});

// Protected routes
Route::prefix('web')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\API\Web\AuthController::class, 'logout']);
    Route::get('/user', [\App\Http\Controllers\API\Web\AuthController::class, 'user']);
    Route::post('/refresh', [\App\Http\Controllers\API\Web\AuthController::class, 'refresh']);
});
