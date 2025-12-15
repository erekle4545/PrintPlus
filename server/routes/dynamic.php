<?php

    Route::get('/ka', [App\Http\Controllers\Web\HomeController::class,'index']);
    Route::get('/us', [App\Http\Controllers\Web\HomeController::class,'index']);
    Route::get('/ru', [App\Http\Controllers\Web\HomeController::class,'index']);
