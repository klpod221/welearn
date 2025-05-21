<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingController;

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('/settings')->group(function () {
    Route::get('/', [SettingController::class, 'index']);
    Route::get('/{setting}', [SettingController::class, 'show']);
    Route::post('/', [SettingController::class, 'store']);
    Route::put('/{setting}', [SettingController::class, 'update']);
    Route::delete('/{setting}', [SettingController::class, 'destroy']);
});
