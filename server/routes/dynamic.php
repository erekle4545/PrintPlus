<?php

    Route::get('/ka', [App\Http\Controllers\API\Web\HomeController::class,'index']);
    Route::get('/en', [App\Http\Controllers\API\Web\HomeController::class,'index']);
    Route::get('/ru', [App\Http\Controllers\API\Web\HomeController::class,'index']);
    Route::get('/ka/chveni-istoria-da-mizani',[ App\Http\Controllers\API\Web\AboutController::class,'index']);
    Route::get('/ka/momsaxurebis-pirobebi',[ App\Http\Controllers\API\Web\TeamController::class,'index']);
    Route::get('/ka/momsaxurebis-pirobebi/{show}',[ App\Http\Controllers\API\Web\TeamController::class,'show']);
