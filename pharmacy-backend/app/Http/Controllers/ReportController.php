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
}
