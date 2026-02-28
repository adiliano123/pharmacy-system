<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\StockBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function salesReport(Request $request)
    {
        $query = Sale::with(['items.product', 'customer']);

        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $sales = $query->latest()->get();

        $summary = [
            'total_sales' => $sales->count(),
            'total_revenue' => $sales->sum('total_amount'),
            'average_sale' => $sales->avg('total_amount'),
        ];

        return response()->json([
            'sales' => $sales,
            'summary' => $summary,
        ]);
    }

    public function inventoryReport()
    {
        $products = Product::with('stockBatches')->get()->map(function ($product) {
            $totalStock = $product->stockBatches->sum('quantity');
            $expiringStock = $product->stockBatches
                ->where('expiry_date', '<=', now()->addDays(30))
                ->sum('quantity');

            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'total_stock' => $totalStock,
                'expiring_soon' => $expiringStock,
                'status' => $totalStock < 10 ? 'low' : 'adequate',
            ];
        });

        return response()->json($products);
    }

    public function topSellingProducts(Request $request)
    {
        $limit = $request->get('limit', 10);

        $topProducts = DB::table('sale_items')
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(subtotal) as total_revenue'))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get();

        $products = Product::whereIn('id', $topProducts->pluck('product_id'))
            ->get()
            ->map(function ($product) use ($topProducts) {
                $stats = $topProducts->firstWhere('product_id', $product->id);
                return [
                    'product' => $product,
                    'total_sold' => $stats->total_sold,
                    'total_revenue' => $stats->total_revenue,
                ];
            });

        return response()->json($products);
    }

    public function expiryReport()
    {
        $expiringSoon = StockBatch::with('product')
            ->whereDate('expiry_date', '<=', now()->addDays(30))
            ->orderBy('expiry_date')
            ->get();

        $expired = StockBatch::with('product')
            ->whereDate('expiry_date', '<', now())
            ->orderBy('expiry_date')
            ->get();

        return response()->json([
            'expiring_soon' => $expiringSoon,
            'expired' => $expired,
        ]);
    }

    public function profitLossReport(Request $request)
    {
        $startDate = $request->get('from', now()->subDays(30)->toDateString());
        $endDate = $request->get('to', now()->toDateString());

        // Get sales data
        $sales = Sale::whereBetween('created_at', [$startDate, $endDate])->get();
        
        $totalRevenue = $sales->sum('total_amount') ?? 0;
        $totalTransactions = $sales->count();
        $averageTransaction = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;

        // Estimate cost as 60% of revenue (since products table doesn't have cost column)
        $costOfGoodsSold = $totalRevenue * 0.6;
        $operatingExpenses = $totalRevenue * 0.05; // 5% for operating expenses
        $totalCosts = $costOfGoodsSold + $operatingExpenses;

        $grossProfit = $totalRevenue - $costOfGoodsSold;
        $netProfit = $totalRevenue - $totalCosts;
        $grossMargin = $totalRevenue > 0 ? ($grossProfit / $totalRevenue) * 100 : 0;
        $netMargin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0;

        // Daily breakdown
        $dailyData = DB::table('sales')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as transactions')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                $item->costs = $item->revenue * 0.65;
                $item->profit = $item->revenue * 0.35;
                return $item;
            });

        // Category breakdown
        $categoryBreakdown = DB::table('sale_items')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select(
                'products.category',
                DB::raw('SUM(sale_items.subtotal) as revenue')
            )
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->groupBy('products.category')
            ->get()
            ->map(function ($item) {
                $item->cost = $item->revenue * 0.6;
                $item->profit = $item->revenue * 0.4;
                $item->margin = 40; // 40% margin
                return $item;
            });

        return response()->json([
            'period' => [
                'from' => $startDate,
                'to' => $endDate,
            ],
            'revenue' => [
                'total_sales' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'average_transaction' => $averageTransaction,
            ],
            'costs' => [
                'cost_of_goods_sold' => $costOfGoodsSold,
                'operating_expenses' => $operatingExpenses,
                'total_costs' => $totalCosts,
            ],
            'profit' => [
                'gross_profit' => $grossProfit,
                'gross_margin_percentage' => $grossMargin,
                'net_profit' => $netProfit,
                'net_margin_percentage' => $netMargin,
            ],
            'breakdown' => [
                'daily' => $dailyData,
                'by_category' => $categoryBreakdown,
            ],
        ]);
    }

    public function stockMovementReport(Request $request)
    {
        $startDate = $request->get('from', now()->subDays(30)->toDateString());
        $endDate = $request->get('to', now()->toDateString());

        // Get stock movements from sales
        $movements = DB::table('sale_items')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select(
                'products.id as product_id',
                'products.name as product_name',
                'products.category',
                DB::raw('SUM(sale_items.quantity) as quantity_sold'),
                DB::raw('COUNT(DISTINCT sales.id) as transactions'),
                DB::raw('SUM(sale_items.subtotal) as revenue')
            )
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->groupBy('products.id', 'products.name', 'products.category')
            ->orderByDesc('quantity_sold')
            ->get();

        // Get current stock levels
        $stockLevels = DB::table('products')
            ->leftJoin('stock_batches', 'products.id', '=', 'stock_batches.product_id')
            ->select(
                'products.id',
                'products.name',
                DB::raw('COALESCE(SUM(stock_batches.quantity), 0) as current_stock')
            )
            ->groupBy('products.id', 'products.name')
            ->get()
            ->keyBy('id');

        // Combine data
        $report = $movements->map(function ($movement) use ($stockLevels) {
            $stock = $stockLevels->get($movement->product_id);
            $movement->current_stock = $stock ? $stock->current_stock : 0;
            $movement->turnover_rate = $movement->current_stock > 0 
                ? round($movement->quantity_sold / $movement->current_stock, 2) 
                : 0;
            return $movement;
        });

        return response()->json([
            'movements' => $report,
            'summary' => [
                'total_products_moved' => $movements->count(),
                'total_quantity_sold' => $movements->sum('quantity_sold'),
                'total_revenue' => $movements->sum('revenue'),
            ],
        ]);
    }
}
