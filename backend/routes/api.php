<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ImportController;

// Public auth routes (with rate limiting)
Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Password reset (public, rate limited)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);
});

// Protected routes
Route::middleware('auth.jwt')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Employee management (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('/employees',         [AuthController::class, 'getEmployees']);
        Route::post('/employees',        [AuthController::class, 'addEmployee']);
        Route::delete('/employees/{id}', [AuthController::class, 'deleteEmployee']);
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Predictions & Analytics
    Route::get('/predictions',           [PredictionController::class, 'index']);
    Route::get('/predictions/top-selling', [PredictionController::class, 'topSelling']);
    Route::get('/predictions/stock-evolution', [PredictionController::class, 'stockEvolution']);

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

    // Suppliers (admin only for write, all for read)
    Route::get('/suppliers',          [SupplierController::class, 'index']);
    Route::get('/suppliers/{id}',     [SupplierController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/suppliers',         [SupplierController::class, 'store']);
        Route::put('/suppliers/{id}',     [SupplierController::class, 'update']);
        Route::delete('/suppliers/{id}',  [SupplierController::class, 'destroy']);
    });

    // Stock movements
    Route::get('/stock-movements',        [StockMovementController::class, 'index']);
    Route::get('/stock-movements/{id}',   [StockMovementController::class, 'show']);
    Route::post('/stock-movements',       [StockMovementController::class, 'store']);

    // Activity Logs (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('/activity-logs',         [ActivityLogController::class, 'index']);
        Route::get('/activity-logs/types',   [ActivityLogController::class, 'actionTypes']);
    });

    // Export Reports
    Route::prefix('export')->group(function () {
        Route::get('/products',        [ExportController::class, 'products']);
        Route::get('/stock-movements', [ExportController::class, 'stockMovements']);
        Route::get('/low-stock',       [ExportController::class, 'lowStockReport']);
    });

    // Notifications (admin only)
    Route::middleware('role:admin')->prefix('notifications')->group(function () {
        Route::get('/low-stock/preview', [NotificationController::class, 'getLowStockPreview']);
        Route::post('/low-stock/send',   [NotificationController::class, 'sendLowStockAlert']);
    });

    // Import (admin only)
    Route::middleware('role:admin')->prefix('import')->group(function () {
        Route::post('/products',      [ImportController::class, 'importProducts']);
        Route::post('/suppliers',     [ImportController::class, 'importSuppliers']);
        Route::get('/template/{type}', [ImportController::class, 'downloadTemplate']);
    });
});
