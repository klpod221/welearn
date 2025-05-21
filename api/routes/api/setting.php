<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingController;

Route::middleware('auth:sanctum')->prefix('/settings')->group(function () {
    Route::get('/', [SettingController::class, 'index']);
    Route::get('/{id}', [SettingController::class, 'show']);
    Route::get('/key/{key}', [SettingController::class, 'show']);
    Route::post('/', [SettingController::class, 'store']);
    Route::put('/{id}', [SettingController::class, 'update']);
    Route::delete('/{id}', [SettingController::class, 'destroy']);
});
