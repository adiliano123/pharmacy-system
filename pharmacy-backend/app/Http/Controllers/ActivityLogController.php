<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Get all activity logs (Admin only)
     */
    public function index(Request $request)
    {
        $query = ActivityLog::with('user:id,name,email,role')
            ->orderByDesc('created_at');

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        // Filter by model
        if ($request->has('model')) {
            $query->where('model', $request->model);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Search in description
        if ($request->has('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->get('per_page', 50);
        $logs = $query->paginate($perPage);

        return response()->json($logs);
    }

    /**
     * Get activity statistics
     */
    public function statistics(Request $request)
    {
        $today = now()->startOfDay();
        $thisWeek = now()->startOfWeek();
        $thisMonth = now()->startOfMonth();

        $stats = [
            'today' => [
                'total' => ActivityLog::whereDate('created_at', $today)->count(),
                'by_action' => ActivityLog::whereDate('created_at', $today)
                    ->selectRaw('action, COUNT(*) as count')
                    ->groupBy('action')
                    ->get(),
            ],
            'this_week' => [
                'total' => ActivityLog::where('created_at', '>=', $thisWeek)->count(),
                'by_user' => ActivityLog::with('user:id,name')
                    ->where('created_at', '>=', $thisWeek)
                    ->selectRaw('user_id, COUNT(*) as count')
                    ->groupBy('user_id')
                    ->get(),
            ],
            'this_month' => [
                'total' => ActivityLog::where('created_at', '>=', $thisMonth)->count(),
                'by_model' => ActivityLog::where('created_at', '>=', $thisMonth)
                    ->whereNotNull('model')
                    ->selectRaw('model, COUNT(*) as count')
                    ->groupBy('model')
                    ->get(),
            ],
            'recent_activities' => ActivityLog::with('user:id,name,role')
                ->orderByDesc('created_at')
                ->limit(10)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
