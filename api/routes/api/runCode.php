<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RunCodeController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/run-code', [RunCodeController::class, 'runCode']);
    Route::post('/run-tests', [RunCodeController::class, 'runTests']);
});
