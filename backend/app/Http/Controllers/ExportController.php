<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Export products to CSV
     */
    public function products(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $products = Product::with(['category', 'supplier'])
            ->where('company_id', $companyId)
            ->get();

        ActivityLog::log('export', 'product', null, 'Products CSV', [
            'count' => $products->count(),
        ]);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="products_' . date('Y-m-d_His') . '.csv"',
        ];

        $callback = function () use ($products) {
            $file = fopen('php://output', 'w');
            
            // Header row
            fputcsv($file, [
                'ID', 'Name', 'Description', 'Category', 'Supplier',
                'Price', 'Quantity', 'Low Stock Threshold', 'Status', 'Created At'
            ]);

            foreach ($products as $product) {
                $status = $product->quantity <= $product->low_stock_threshold ? 'Low Stock' : 'In Stock';
                fputcsv($file, [
                    (string) $product->_id,
                    $product->name,
                    $product->description,
                    $product->category?->name ?? '',
                    $product->supplier?->name ?? '',
                    $product->price,
                    $product->quantity,
                    $product->low_stock_threshold,
                    $status,
                    $product->created_at?->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    /**
     * Export stock movements to CSV
     */
    public function stockMovements(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $query = StockMovement::with(['product', 'user'])
            ->where('company_id', $companyId);

        // Apply filters
        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->to);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $movements = $query->orderBy('created_at', 'desc')->get();

        ActivityLog::log('export', 'stock_movement', null, 'Stock Movements CSV', [
            'count' => $movements->count(),
        ]);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="stock_movements_' . date('Y-m-d_His') . '.csv"',
        ];

        $callback = function () use ($movements) {
            $file = fopen('php://output', 'w');
            
            // Header row
            fputcsv($file, [
                'ID', 'Product', 'Type', 'Quantity', 'User', 'Note', 'Date'
            ]);

            foreach ($movements as $movement) {
                fputcsv($file, [
                    (string) $movement->_id,
                    $movement->product?->name ?? 'Unknown',
                    strtoupper($movement->type),
                    $movement->quantity,
                    $movement->user?->name ?? 'Unknown',
                    $movement->note,
                    $movement->created_at?->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    /**
     * Export low stock products report
     */
    public function lowStockReport(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $products = Product::with(['category', 'supplier'])
            ->where('company_id', $companyId)
            ->whereRaw(['$expr' => ['$lte' => ['$quantity', '$low_stock_threshold']]])
            ->get();

        ActivityLog::log('export', 'product', null, 'Low Stock Report CSV', [
            'count' => $products->count(),
        ]);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="low_stock_report_' . date('Y-m-d_His') . '.csv"',
        ];

        $callback = function () use ($products) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, [
                'Product', 'Category', 'Supplier', 'Current Stock', 'Threshold', 'Shortage', 'Suggested Order'
            ]);

            foreach ($products as $product) {
                $shortage = $product->low_stock_threshold - $product->quantity;
                $suggestedOrder = max($shortage * 2, $product->low_stock_threshold); // Order double the shortage or at least threshold
                
                fputcsv($file, [
                    $product->name,
                    $product->category?->name ?? '',
                    $product->supplier?->name ?? '',
                    $product->quantity,
                    $product->low_stock_threshold,
                    $shortage > 0 ? $shortage : 0,
                    $suggestedOrder,
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}
