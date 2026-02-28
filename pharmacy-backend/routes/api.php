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
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WholesaleController;

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
    Route::get('/dashboard/storekeeper', [DashboardController::class, 'storekeeperStats']);

    // Activity Logs (Admin only)
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::get('/activity-logs/statistics', [ActivityLogController::class, 'statistics']);

    // Users (Admin only)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/statistics', [UserController::class, 'statistics']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::post('/users/{id}/upload-image', [UserController::class, 'uploadProfileImage']);
    Route::post('/users/change-password', [UserController::class, 'changePassword']);
    Route::post('/users/notification-settings', [UserController::class, 'updateNotificationSettings']);
    Route::delete('/users/delete-account', [UserController::class, 'deleteAccount']);

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
    Route::get('/reports/profit-loss', [ReportController::class, 'profitLossReport']);
    Route::get('/reports/stock-movement', [ReportController::class, 'stockMovementReport']);

    // Compliance
    Route::get('/compliance/expired-products', [ComplianceController::class, 'expiredProducts']);
    Route::get('/compliance/audit-trail', [ComplianceController::class, 'auditTrail']);
    Route::get('/compliance/stock-discrepancies', [ComplianceController::class, 'stockDiscrepancies']);
    Route::get('/compliance/regulatory-report', [ComplianceController::class, 'regulatoryReport']);
    Route::get('/compliance/controlled-drugs', [ComplianceController::class, 'controlledDrugs']);
    Route::get('/compliance/controlled-drugs/dispense-records', [ComplianceController::class, 'controlledDrugsDispenseRecords']);

    // Wholesale
    Route::get('/wholesale/customers', [WholesaleController::class, 'getWholesaleCustomers']);
    Route::post('/wholesale/customers', [WholesaleController::class, 'createWholesaleCustomer']);
    Route::put('/wholesale/customers/{id}', [WholesaleController::class, 'updateWholesaleCustomer']);
    Route::get('/wholesale/orders', [WholesaleController::class, 'getWholesaleOrders']);
    Route::post('/wholesale/orders', [WholesaleController::class, 'createWholesaleOrder']);
    Route::get('/wholesale/orders/{id}', [WholesaleController::class, 'getWholesaleOrder']);
    Route::post('/wholesale/orders/{id}/payment', [WholesaleController::class, 'recordPayment']);
    Route::get('/wholesale/stats', [WholesaleController::class, 'getWholesaleStats']);
});

