<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $companyId = Auth::user()->company_id;

        // Date range filter (default: last 6 months)
        $period = $request->get('period', '6months'); // 7days, 30days, 3months, 6months, 12months, custom
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        switch ($period) {
            case '7days':
                $dateFrom = now()->subDays(7)->startOfDay();
                $dateTo = now()->endOfDay();
                $chartMonths = 7;
                $chartUnit = 'day';
                break;
            case '30days':
                $dateFrom = now()->subDays(30)->startOfDay();
                $dateTo = now()->endOfDay();
                $chartMonths = 30;
                $chartUnit = 'day';
                break;
            case '3months':
                $dateFrom = now()->subMonths(3)->startOfMonth();
                $dateTo = now()->endOfMonth();
                $chartMonths = 3;
                $chartUnit = 'month';
                break;
            case '12months':
                $dateFrom = now()->subMonths(12)->startOfMonth();
                $dateTo = now()->endOfMonth();
                $chartMonths = 12;
                $chartUnit = 'month';
                break;
            case 'custom':
                $dateFrom = $startDate ? Carbon::parse($startDate)->startOfDay() : now()->subMonths(6)->startOfMonth();
                $dateTo = $endDate ? Carbon::parse($endDate)->endOfDay() : now()->endOfMonth();
                $chartMonths = max(1, $dateFrom->diffInMonths($dateTo) + 1);
                $chartUnit = 'month';
                break;
            default: // 6months
                $dateFrom = now()->subMonths(6)->startOfMonth();
                $dateTo = now()->endOfMonth();
                $chartMonths = 6;
                $chartUnit = 'month';
        }

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

        // Stock movements within date range
        $movements = StockMovement::where('company_id', $companyId)
            ->where('created_at', '>=', $dateFrom)
            ->where('created_at', '<=', $dateTo)
            ->get();

        // Build chart data
        $chartData = [];
        if ($chartUnit === 'day') {
            for ($i = $chartMonths - 1; $i >= 0; $i--) {
                $day = now()->subDays($i);
                $label = $day->format('M d');
                $start = $day->copy()->startOfDay();
                $end = $day->copy()->endOfDay();

                $dayMovements = $movements->filter(function ($m) use ($start, $end) {
                    return $m->created_at >= $start && $m->created_at <= $end;
                });

                $chartData[] = [
                    'month' => $label,
                    'in'    => $dayMovements->where('type', 'in')->sum('quantity'),
                    'out'   => $dayMovements->where('type', 'out')->sum('quantity'),
                ];
            }
        } else {
            for ($i = $chartMonths - 1; $i >= 0; $i--) {
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
