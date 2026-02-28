<?php

namespace App\Http\Controllers;

use App\Models\StockBatch;
use App\Models\Sale;
use App\Models\ActivityLog;
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
        $query = ActivityLog::with('user');

        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        $logs = $query->latest()->paginate(50);

        // Transform the data to match frontend expectations
        $transformedLogs = $logs->map(function ($log) {
            return [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'user_name' => $log->user ? $log->user->name : 'System',
                'user_role' => $log->user ? $log->user->role : 'system',
                'created_at' => $log->created_at->toISOString(),
                'metadata' => [
                    'model' => $log->model,
                    'model_id' => $log->model_id,
                    'changes' => $log->changes,
                    'ip_address' => $log->ip_address,
                ],
            ];
        });

        return response()->json($transformedLogs);
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

    public function controlledDrugs()
    {
        // Get products that are controlled substances
        // For now, we'll filter by category or add a flag
        $controlledDrugs = \App\Models\Product::with(['stock_batches' => function ($query) {
            $query->where('quantity', '>', 0);
        }])
        ->whereIn('category', ['Controlled Substances', 'Narcotics', 'Psychotropics'])
        ->orWhere('name', 'like', '%morphine%')
        ->orWhere('name', 'like', '%codeine%')
        ->orWhere('name', 'like', '%tramadol%')
        ->get();

        return response()->json($controlledDrugs);
    }

    public function controlledDrugsDispenseRecords()
    {
        // Get sales records for controlled drugs
        $records = \App\Models\Sale::with(['user', 'customer', 'items.product'])
            ->whereHas('items.product', function ($query) {
                $query->whereIn('category', ['Controlled Substances', 'Narcotics', 'Psychotropics'])
                    ->orWhere('name', 'like', '%morphine%')
                    ->orWhere('name', 'like', '%codeine%')
                    ->orWhere('name', 'like', '%tramadol%');
            })
            ->latest()
            ->take(100)
            ->get();

        return response()->json($records);
    }
}
