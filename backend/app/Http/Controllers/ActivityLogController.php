<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogController extends Controller
{
    /**
     * Get activity logs for the company
     */
    public function index(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $query = ActivityLog::where('company_id', $companyId);

        // Filter by action type
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by entity type
        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->to);
        }

        // Paginate results
        $perPage = $request->get('per_page', 20);
        $logs = $query->orderBy('created_at', 'desc')
                      ->paginate($perPage);

        return response()->json($logs);
    }

    /**
     * Get available action types for filtering
     */
    public function actionTypes()
    {
        return response()->json([
            'actions' => [
                'created', 'updated', 'deleted', 
                'stock_in', 'stock_out',
                'login', 'logout',
                'export',
            ],
            'entity_types' => [
                'product', 'category', 'supplier', 
                'stock_movement', 'user', 'employee',
            ],
        ]);
    }
}
