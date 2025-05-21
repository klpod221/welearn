<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LanguageController;

// middleware auth:sanctum and prefix /languages
Route::middleware('auth:sanctum')->prefix('/languages')->group(function () {
    Route::get('/', [LanguageController::class, 'index']);
    Route::get('/{id}', [LanguageController::class, 'show']);
    Route::post('/', [LanguageController::class, 'store']);
    Route::put('/{id}', [LanguageController::class, 'update']);
    Route::delete('/{id}', [LanguageController::class, 'destroy']);
});
