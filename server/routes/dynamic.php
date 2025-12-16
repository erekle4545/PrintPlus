<?php

    Route::get('/ka', [App\Http\Controllers\Web\HomeController::class,'index']);
    Route::get('/en', [App\Http\Controllers\Web\HomeController::class,'index']);
    Route::get('/ru', [App\Http\Controllers\Web\HomeController::class,'index']);
    Route::get('/ka/test-gverdi',[ App\Http\Controllers\Web\TextController::class,'index']);
    Route::get('/ka/test-gverdi/{show}',[ App\Http\Controllers\Web\TextController::class,'show']);
    Route::get('/en/test-page',[ App\Http\Controllers\Web\TextController::class,'index']);
    Route::get('/en/test-page/{show}',[ App\Http\Controllers\Web\TextController::class,'show']);
    Route::get('/ka/test-2',[ App\Http\Controllers\Web\TextController::class,'index']);
    Route::get('/ka/test-2/{show}',[ App\Http\Controllers\Web\TextController::class,'show']);
    Route::get('/en/test-2',[ App\Http\Controllers\Web\TextController::class,'index']);
    Route::get('/en/test-2/{show}',[ App\Http\Controllers\Web\TextController::class,'show']);
    Route::get('/ka/test-3',[ App\Http\Controllers\Web\TextController::class,'index']);
    Route::get('/ka/test-3/{show}',[ App\Http\Controllers\Web\TextController::class,'show']);
