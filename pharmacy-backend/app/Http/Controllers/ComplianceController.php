<?php

namespace App\Http\Controllers;

use App\Models\StockBatch;
use App\Models\Sale;
use Illuminate\Http\Request;

class ComplianceController extends Controller
{
    public function expiredProducts()
    {
        $expired = StockBatch::with('product')
            ->whereDate('expiry_date', '<', now())
            ->where('quantity', '>', 0)
            ->get();

        return response()->json([
            'count' => $expired->count(),
            'products' => $expired,
            'total_value' => $expired->sum(function ($batch) {
                return $batch->quantity * $batch->product->price;
            }),
        ]);
    }

    public function auditTrail(Request $request)
    {
        $query = Sale::with(['user', 'customer', 'items.product']);

        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $transactions = $query->latest()->paginate(50);

        return response()->json($transactions);
    }

    public function stockDiscrepancies()
    {
        $batches = StockBatch::with('product')
            ->where('quantity', '<', 0)
            ->orWhereNull('batch_number')
            ->get();

        return response()->json([
            'count' => $batches->count(),
            'discrepancies' => $batches,
        ]);
    }

    public function regulatoryReport()
    {
        $report = [
            'expired_stock' => StockBatch::whereDate('expiry_date', '<', now())
                ->where('quantity', '>', 0)
                ->count(),
            'low_stock_items' => StockBatch::where('quantity', '<', 10)->count(),
            'total_sales_today' => Sale::whereDate('created_at', today())->count(),
            'total_revenue_today' => Sale::whereDate('created_at', today())->sum('total_amount'),
            'expiring_in_30_days' => StockBatch::whereDate('expiry_date', '<=', now()->addDays(30))
                ->whereDate('expiry_date', '>=', now())
                ->count(),
        ];

        return response()->json($report);
    }
}
