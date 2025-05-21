<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('/users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::patch('/{user}/role', [UserController::class, 'updateRole']);
    Route::patch('/{user}/status', [UserController::class, 'updateStatus']);
    Route::patch('/{user}/password', [UserController::class, 'updatePassword']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
});
