<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $companyId = Auth::user()->company_id;

        $totalProducts   = Product::where('company_id', $companyId)->count();
        $totalCategories = Category::where('company_id', $companyId)->count();
        
        // Get total stock by summing all products
        $allProducts = Product::where('company_id', $companyId)->get();
        $totalStock = $allProducts->sum('quantity');

        // Low stock products (quantity <= low_stock_threshold)
        $lowStockProducts = $allProducts->filter(function ($product) {
            return $product->quantity <= $product->low_stock_threshold;
        })->load('category')->values();

        // Recent stock movements (last 10)
        $recentMovements = StockMovement::with(['product', 'user'])
            ->where('company_id', $companyId)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        // Monthly stock in/out for the last 6 months
        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();

        $movements = StockMovement::where('company_id', $companyId)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->get();

        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $label = $month->format('M Y');
            $start = $month->copy()->startOfMonth();
            $end   = $month->copy()->endOfMonth();

            $monthMovements = $movements->filter(function ($m) use ($start, $end) {
                return $m->created_at >= $start && $m->created_at <= $end;
            });

            $chartData[] = [
                'month' => $label,
                'in'    => $monthMovements->where('type', 'in')->sum('quantity'),
                'out'   => $monthMovements->where('type', 'out')->sum('quantity'),
            ];
        }

        // Top 5 products by stock value (price * quantity)
        $topProducts = $allProducts
            ->map(fn($p) => array_merge($p->toArray(), ['stock_value' => $p->price * $p->quantity]))
            ->sortByDesc('stock_value')
            ->take(5)
            ->values();

        return response()->json([
            'stats' => [
                'total_products'   => $totalProducts,
                'total_categories' => $totalCategories,
                'total_stock'      => $totalStock,
                'low_stock_count'  => $lowStockProducts->count(),
            ],
            'low_stock_products' => $lowStockProducts,
            'recent_movements'   => $recentMovements,
            'chart_data'         => $chartData,
            'top_products'       => $topProducts,
        ]);
    }
}
