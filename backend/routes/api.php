<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\DashboardController;

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth.jwt')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Employee management (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('/employees',         [AuthController::class, 'getEmployees']);
        Route::post('/employees',        [AuthController::class, 'addEmployee']);
        Route::delete('/employees/{id}', [AuthController::class, 'deleteEmployee']);
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Categories (admin only for write, all for read)
    Route::get('/categories',          [CategoryController::class, 'index']);
    Route::get('/categories/{id}',     [CategoryController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/categories',         [CategoryController::class, 'store']);
        Route::put('/categories/{id}',     [CategoryController::class, 'update']);
        Route::delete('/categories/{id}',  [CategoryController::class, 'destroy']);
    });

    // Products (admin only for create/update/delete)
    Route::get('/products',          [ProductController::class, 'index']);
    Route::get('/products/{id}',     [ProductController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/products',         [ProductController::class, 'store']);
        Route::post('/products/{id}',    [ProductController::class, 'update']); // POST for multipart
        Route::delete('/products/{id}',  [ProductController::class, 'destroy']);
    });

    // Stock movements
    Route::get('/stock-movements',        [StockMovementController::class, 'index']);
    Route::get('/stock-movements/{id}',   [StockMovementController::class, 'show']);
    Route::post('/stock-movements',       [StockMovementController::class, 'store']);
});
