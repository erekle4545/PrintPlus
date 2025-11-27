<?php

    Route::get('/ka', [App\Http\Controllers\Web\HomeController::class,'index']);
    Route::get('/de', [App\Http\Controllers\Web\HomeController::class,'index']);
    Route::get('/ka/teeeesddd',[ App\Http\Controllers\Web\TextController::class,'index']);
    Route::get('/ka/teeeesddd/{show}',[ App\Http\Controllers\Web\TextController::class,'show']);
    Route::get('/ka/wdwqewqe',[ App\Http\Controllers\Web\TextController::class,'index']);
    Route::get('/ka/wdwqewqe/{show}',[ App\Http\Controllers\Web\TextController::class,'show']);
    Route::get('/ka/teadasfasd',[ App\Http\Controllers\Web\FormController::class,'index']);
