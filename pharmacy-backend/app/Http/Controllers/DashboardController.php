<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get Admin Dashboard Statistics
     */
    public function adminStats(Request $request)
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        
        // Today's Sales
        $todaySales = Sale::whereDate('created_at', $today)->sum('total_amount') ?? 0;
        
        // Monthly Sales
        $monthlySales = Sale::where('created_at', '>=', $thisMonth)->sum('total_amount') ?? 0;
        
        // Total Products
        $totalProducts = Product::count();
        
        // Low stock - products with total batch quantity below threshold
        $lowStockItems = DB::table('products')
            ->leftJoin('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->select('products.id')
            ->groupBy('products.id')
            ->havingRaw('COALESCE(SUM(stock_batches.quantity), 0) < 20')
            ->count();
        
        // Total Customers
        $totalCustomers = Customer::count();
        
        // Expiring products - batches expiring in next 30 days
        $expiringProducts = DB::table('stock_batches')
            ->where('expiry_date', '<=', Carbon::now()->addDays(30))
            ->where('expiry_date', '>', Carbon::now())
            ->distinct('product_id')
            ->count('product_id');
        
        return response()->json([
            'todaySales' => $todaySales,
            'monthlySales' => $monthlySales,
            'totalProducts' => $totalProducts,
            'lowStockItems' => $lowStockItems,
            'totalCustomers' => $totalCustomers,
            'expiringProducts' => $expiringProducts,
        ]);
    }

    /**
     * Get Admin Dashboard Full Statistics (detailed)
     */
    public function adminStatsDetailed(Request $request)
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        
        // Total Sales
        $totalSales = Sale::sum('total_amount');
        $todaySales = Sale::whereDate('created_at', $today)->sum('total_amount');
        $monthSales = Sale::where('created_at', '>=', $thisMonth)->sum('total_amount');
        
        // Transaction Counts
        $totalTransactions = Sale::count();
        $todayTransactions = Sale::whereDate('created_at', $today)->count();
        
        // Users
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        
        // Products
        $totalProducts = Product::count();
        
        // Low stock - products with total batch quantity below threshold (simplified)
        $lowStockProducts = DB::table('products')
            ->leftJoin('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->select('products.id')
            ->groupBy('products.id')
            ->havingRaw('COALESCE(SUM(stock_batches.quantity), 0) < 20')
            ->count();
        
        // Expiring products - batches expiring in next 30 days
        $expiringProducts = DB::table('stock_batches')
            ->where('expiry_date', '<=', Carbon::now()->addDays(30))
            ->where('expiry_date', '>', Carbon::now())
            ->distinct('product_id')
            ->count('product_id');
        
        // Customers
        $totalCustomers = Customer::count();
        
        // Top Selling Products (if sale_items table exists)
        $topProducts = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select('products.name', DB::raw('SUM(sale_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();
        
        // Recent Sales
        $recentSales = Sale::with('customer')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => [
                'sales' => [
                    'total' => $totalSales,
                    'today' => $todaySales,
                    'month' => $monthSales,
                ],
                'transactions' => [
                    'total' => $totalTransactions,
                    'today' => $todayTransactions,
                ],
                'users' => [
                    'total' => $totalUsers,
                    'active' => $activeUsers,
                ],
                'products' => [
                    'total' => $totalProducts,
                    'low_stock' => $lowStockProducts,
                    'expiring' => $expiringProducts,
                ],
                'customers' => [
                    'total' => $totalCustomers,
                ],
                'top_products' => $topProducts,
                'recent_sales' => $recentSales,
            ]
        ]);
    }

    /**
     * Get Pharmacist Dashboard Statistics
     */
    public function pharmacistStats(Request $request)
    {
        $today = Carbon::today();
        
        // Inventory Stats
        $totalProducts = Product::count();
        
        // Total stock quantity across all batches
        $totalStockQuantity = DB::table('stock_batches')->sum('quantity');
        
        // Low stock products (products with total batch quantity < 20)
        $lowStockProducts = DB::table('products')
            ->leftJoin('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->select('products.id')
            ->groupBy('products.id')
            ->havingRaw('COALESCE(SUM(stock_batches.quantity), 0) < 20')
            ->count();
        
        // Out of stock products
        $outOfStock = DB::table('products')
            ->leftJoin('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->select('products.id')
            ->groupBy('products.id')
            ->havingRaw('COALESCE(SUM(stock_batches.quantity), 0) = 0')
            ->count();
        
        // Expiry Management
        $expiringSoon = DB::table('stock_batches')
            ->where('expiry_date', '<=', Carbon::now()->addDays(30))
            ->where('expiry_date', '>', Carbon::now())
            ->count();
            
        $expired = DB::table('stock_batches')
            ->where('expiry_date', '<', Carbon::now())
            ->count();
        
        // Inventory Value (using product price * batch quantity)
        $inventoryValue = DB::table('products')
            ->join('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->sum(DB::raw('products.price * stock_batches.quantity'));
        
        // Products needing attention - low stock items
        $lowStockItems = DB::table('products')
            ->leftJoin('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->select(
                'products.id',
                'products.name',
                DB::raw('COALESCE(SUM(stock_batches.quantity), 0) as quantity'),
                DB::raw('20 as minimum_stock')
            )
            ->groupBy('products.id', 'products.name')
            ->havingRaw('COALESCE(SUM(stock_batches.quantity), 0) < 20')
            ->orderBy('quantity')
            ->limit(10)
            ->get();
        
        // Expiring items
        $expiringItems = DB::table('stock_batches')
            ->join('products', 'stock_batches.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name',
                'stock_batches.quantity',
                'stock_batches.expiry_date'
            )
            ->where('stock_batches.expiry_date', '<=', Carbon::now()->addDays(30))
            ->where('stock_batches.expiry_date', '>', Carbon::now())
            ->orderBy('stock_batches.expiry_date')
            ->limit(10)
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => [
                'inventory' => [
                    'total_products' => $totalProducts,
                    'low_stock' => $lowStockProducts,
                    'out_of_stock' => $outOfStock,
                    'inventory_value' => $inventoryValue,
                ],
                'expiry' => [
                    'expiring_soon' => $expiringSoon,
                    'expired' => $expired,
                ],
                'alerts' => [
                    'low_stock_items' => $lowStockItems,
                    'expiring_items' => $expiringItems,
                ],
            ]
        ]);
    }

    /**
     * Get Cashier Dashboard Statistics
     */
    public function cashierStats(Request $request)
    {
        $today = Carbon::today();
        $userId = $request->user()->id;
        
        // Today's Sales
        $todaySales = Sale::whereDate('created_at', $today)->sum('total_amount');
        $todayTransactions = Sale::whereDate('created_at', $today)->count();
        
        // My Sales (if cashier)
        $mySales = Sale::where('user_id', $userId)
            ->whereDate('created_at', $today)
            ->sum('total_amount');
        $myTransactions = Sale::where('user_id', $userId)
            ->whereDate('created_at', $today)
            ->count();
        
        // Payment Methods
        $paymentMethods = Sale::whereDate('created_at', $today)
            ->select('payment_method', DB::raw('SUM(total_amount) as total'))
            ->groupBy('payment_method')
            ->get();
        
        // Recent Sales
        $recentSales = Sale::with('customer')
            ->whereDate('created_at', $today)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();
        
        // Hourly Sales (for chart)
        $hourlySales = Sale::whereDate('created_at', $today)
            ->select(DB::raw('HOUR(created_at) as hour'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => [
                'today' => [
                    'sales' => $todaySales,
                    'transactions' => $todayTransactions,
                ],
                'my_stats' => [
                    'sales' => $mySales,
                    'transactions' => $myTransactions,
                ],
                'payment_methods' => $paymentMethods,
                'recent_sales' => $recentSales,
                'hourly_sales' => $hourlySales,
            ]
        ]);
    }

    /**
     * Get Storekeeper Dashboard Statistics
     */
    public function storekeeperStats(Request $request)
    {
        // Total Products
        $totalProducts = Product::count();
        
        // Low stock products (products with total batch quantity < 20)
        $lowStockItems = DB::table('products')
            ->leftJoin('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->select('products.id')
            ->groupBy('products.id')
            ->havingRaw('COALESCE(SUM(stock_batches.quantity), 0) < 20')
            ->count();
        
        // Out of stock products
        $outOfStock = DB::table('products')
            ->leftJoin('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->select('products.id')
            ->groupBy('products.id')
            ->havingRaw('COALESCE(SUM(stock_batches.quantity), 0) = 0')
            ->count();
        
        // Expiring products - batches expiring in next 30 days
        $expiringProducts = DB::table('stock_batches')
            ->where('expiry_date', '<=', Carbon::now()->addDays(30))
            ->where('expiry_date', '>', Carbon::now())
            ->distinct('product_id')
            ->count('product_id');
        
        // Total stock value (using product price * batch quantity)
        $totalStockValue = DB::table('products')
            ->join('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->sum(DB::raw('products.price * stock_batches.quantity'));
        
        // Recent movements (last 7 days) - count of sales
        $recentMovements = Sale::where('created_at', '>=', Carbon::now()->subDays(7))->count();
        
        return response()->json([
            'totalProducts' => $totalProducts,
            'lowStockItems' => $lowStockItems,
            'outOfStock' => $outOfStock,
            'expiringProducts' => $expiringProducts,
            'totalStockValue' => $totalStockValue,
            'recentMovements' => $recentMovements,
        ]);
    }
}
