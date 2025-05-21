<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LanguageController;

// middleware auth:sanctum and prefix /languages
Route::middleware('auth:sanctum')->prefix('/languages')->group(function () {
    Route::get('/', [LanguageController::class, 'index']);
    Route::get('/{language}', [LanguageController::class, 'show']);
    Route::post('/', [LanguageController::class, 'store']);
    Route::put('/{language}', [LanguageController::class, 'update']);
    Route::delete('/{language}', [LanguageController::class, 'destroy']);
});
