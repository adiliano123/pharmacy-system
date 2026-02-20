<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ComplianceController;
use App\Http\Controllers\DashboardController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats']);
    Route::get('/dashboard/pharmacist', [DashboardController::class, 'pharmacistStats']);
    Route::get('/dashboard/cashier', [DashboardController::class, 'cashierStats']);

    // Products
    Route::apiResource('products', ProductController::class);

    // Customers
    Route::apiResource('customers', CustomerController::class);

    // Sales
    Route::apiResource('sales', SaleController::class);

    // Stock
    Route::get('/stock/low-stock', [StockController::class, 'lowStock']);
    Route::get('/stock/expiring-soon', [StockController::class, 'expiringSoon']);
    Route::apiResource('stock', StockController::class);

    // Reports
    Route::get('/reports/sales', [ReportController::class, 'salesReport']);
    Route::get('/reports/inventory', [ReportController::class, 'inventoryReport']);
    Route::get('/reports/top-selling', [ReportController::class, 'topSellingProducts']);
    Route::get('/reports/expiry', [ReportController::class, 'expiryReport']);

    // Compliance
    Route::get('/compliance/expired-products', [ComplianceController::class, 'expiredProducts']);
    Route::get('/compliance/audit-trail', [ComplianceController::class, 'auditTrail']);
    Route::get('/compliance/stock-discrepancies', [ComplianceController::class, 'stockDiscrepancies']);
    Route::get('/compliance/regulatory-report', [ComplianceController::class, 'regulatoryReport']);
});

