<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $query = StockMovement::with(['product', 'user'])
            ->where('company_id', $companyId);

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->to);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        if ($request->boolean('paginate', false)) {
            $movements = $query->orderBy('created_at', 'desc')->paginate($perPage);
        } else {
            $movements = $query->orderBy('created_at', 'desc')
                               ->take($request->get('limit', 100))
                               ->get();
        }

        return response()->json($movements);
    }

    public function store(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $request->validate([
            'product_id' => 'required|string',
            'type'       => 'required|in:in,out',
            'quantity'   => 'required|integer|min:1',
            'note'       => 'nullable|string|max:500',
        ]);

        $product = Product::where('company_id', $companyId)
            ->findOrFail($request->product_id);

        if ($request->type === 'out' && $product->quantity < $request->quantity) {
            return response()->json([
                'error' => "Insufficient stock. Available: {$product->quantity}",
            ], 422);
        }

        // Use transaction to ensure atomicity
        $movement = DB::transaction(function () use ($request, $product, $companyId) {
            // Adjust product quantity
            if ($request->type === 'in') {
                $product->increment('quantity', $request->quantity);
            } else {
                $product->decrement('quantity', $request->quantity);
            }

            return StockMovement::create([
                'product_id' => $request->product_id,
                'type'       => $request->type,
                'quantity'   => $request->quantity,
                'user_id'    => Auth::id(),
                'note'       => $request->note,
                'company_id' => $companyId,
            ]);
        });

        $movement->load(['product', 'user']);

        $action = $movement->type === 'in' ? 'stock_in' : 'stock_out';
        ActivityLog::log($action, 'stock_movement', (string) $movement->_id, $movement->product?->name, [
            'quantity' => $movement->quantity,
            'type'     => $movement->type,
            'note'     => $movement->note,
        ]);

        return response()->json($movement, 201);
    }

    public function show($id)
    {
        $companyId = Auth::user()->company_id;
        $movement = StockMovement::with(['product', 'user'])
            ->where('company_id', $companyId)
            ->findOrFail($id);
        return response()->json($movement);
    }
}