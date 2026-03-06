<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PredictionController extends Controller
{
    /**
     * Get consumption predictions and order suggestions
     */
    public function index()
    {
        $companyId = Auth::user()->company_id;
        
        // Get all products for this company
        $products = Product::with('supplier', 'category')
            ->where('company_id', $companyId)
            ->get();

        // Get stock movements for the last 90 days
        $ninetyDaysAgo = Carbon::now()->subDays(90);
        $movements = StockMovement::where('company_id', $companyId)
            ->where('created_at', '>=', $ninetyDaysAgo)
            ->get()
            ->groupBy('product_id');

        $predictions = [];

        foreach ($products as $product) {
            $productId = (string) $product->_id;
            $productMovements = $movements->get($productId) ?? collect([]);

            // Calculate daily consumption rate (only "out" movements)
            $outMovements = $productMovements->where('type', 'out');
            $totalOut = $outMovements->sum('quantity');
            
            // Calculate days since first movement or 90 days max
            $firstMovement = $productMovements->sortBy('created_at')->first();
            $daysSinceFirst = $firstMovement 
                ? max(1, Carbon::parse($firstMovement->created_at)->diffInDays(Carbon::now()))
                : 90;
            $daysSinceFirst = min($daysSinceFirst, 90);

            // Daily consumption rate
            $dailyConsumption = $daysSinceFirst > 0 ? round($totalOut / $daysSinceFirst, 2) : 0;

            // Calculate weekly and monthly projections
            $weeklyConsumption = round($dailyConsumption * 7, 1);
            $monthlyConsumption = round($dailyConsumption * 30, 1);

            // Days until stockout (if consumption continues at this rate)
            $daysUntilStockout = $dailyConsumption > 0 
                ? round($product->quantity / $dailyConsumption)
                : null;

            // Suggested order quantity (enough for 30 days + safety buffer)
            $safetyBuffer = 1.2; // 20% extra
            $targetDays = 30;
            $suggestedOrder = 0;
            $needsReorder = false;

            if ($dailyConsumption > 0) {
                $targetStock = ceil($dailyConsumption * $targetDays * $safetyBuffer);
                $suggestedOrder = max(0, $targetStock - $product->quantity);
                
                // Need reorder if days until stockout < 14 or quantity below threshold
                $needsReorder = ($daysUntilStockout !== null && $daysUntilStockout < 14) 
                    || $product->quantity <= $product->low_stock_threshold;
            }

            // Check if low stock
            $isLowStock = $product->quantity <= $product->low_stock_threshold;

            // Consumption trend (compare last 30 days vs previous 30 days)
            $thirtyDaysAgo = Carbon::now()->subDays(30);
            $sixtyDaysAgo = Carbon::now()->subDays(60);

            $recentOut = $outMovements->filter(fn($m) => Carbon::parse($m->created_at) >= $thirtyDaysAgo)->sum('quantity');
            $previousOut = $outMovements->filter(fn($m) => Carbon::parse($m->created_at) >= $sixtyDaysAgo && Carbon::parse($m->created_at) < $thirtyDaysAgo)->sum('quantity');

            $trend = 'stable';
            if ($previousOut > 0) {
                $changePercent = (($recentOut - $previousOut) / $previousOut) * 100;
                if ($changePercent > 15) {
                    $trend = 'increasing';
                } elseif ($changePercent < -15) {
                    $trend = 'decreasing';
                }
            } elseif ($recentOut > 0) {
                $trend = 'new';
            }

            $predictions[] = [
                'product' => [
                    'id' => $productId,
                    'name' => $product->name,
                    'quantity' => $product->quantity,
                    'low_stock_threshold' => $product->low_stock_threshold,
                    'price' => $product->price,
                    'category' => $product->category?->name,
                    'supplier' => $product->supplier ? [
                        'id' => (string) $product->supplier->_id,
                        'name' => $product->supplier->name,
                        'email' => $product->supplier->email,
                    ] : null,
                ],
                'consumption' => [
                    'daily' => $dailyConsumption,
                    'weekly' => $weeklyConsumption,
                    'monthly' => $monthlyConsumption,
                    'total_90_days' => $totalOut,
                ],
                'forecast' => [
                    'days_until_stockout' => $daysUntilStockout,
                    'trend' => $trend,
                    'is_low_stock' => $isLowStock,
                ],
                'suggestion' => [
                    'needs_reorder' => $needsReorder,
                    'suggested_quantity' => $suggestedOrder,
                    'reorder_value' => round($suggestedOrder * $product->price, 2),
                ],
            ];
        }

        // Sort by urgency: first those needing reorder, then by days until stockout
        usort($predictions, function ($a, $b) {
            if ($a['suggestion']['needs_reorder'] !== $b['suggestion']['needs_reorder']) {
                return $b['suggestion']['needs_reorder'] <=> $a['suggestion']['needs_reorder'];
            }
            $aDays = $a['forecast']['days_until_stockout'] ?? PHP_INT_MAX;
            $bDays = $b['forecast']['days_until_stockout'] ?? PHP_INT_MAX;
            return $aDays <=> $bDays;
        });

        // Summary statistics
        $totalProductsNeedingReorder = collect($predictions)->where('suggestion.needs_reorder', true)->count();
        $totalReorderValue = collect($predictions)->sum('suggestion.reorder_value');
        $lowStockCount = collect($predictions)->where('forecast.is_low_stock', true)->count();
        $criticalCount = collect($predictions)->filter(function ($p) {
            return ($p['forecast']['days_until_stockout'] ?? PHP_INT_MAX) <= 7;
        })->count();

        return response()->json([
            'summary' => [
                'total_products' => count($predictions),
                'needs_reorder' => $totalProductsNeedingReorder,
                'low_stock' => $lowStockCount,
                'critical' => $criticalCount,
                'total_reorder_value' => round($totalReorderValue, 2),
            ],
            'predictions' => $predictions,
        ]);
    }

    /**
     * Get top-selling products analysis
     */
    public function topSelling(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $days = $request->get('days', 30);
        $limit = $request->get('limit', 10);

        $since = Carbon::now()->subDays($days);

        $movements = StockMovement::where('company_id', $companyId)
            ->where('type', 'out')
            ->where('created_at', '>=', $since)
            ->get()
            ->groupBy('product_id');

        $products = Product::with('category')
            ->where('company_id', $companyId)
            ->get()
            ->keyBy(fn($p) => (string) $p->_id);

        $salesData = [];
        foreach ($movements as $productId => $productMovements) {
            $product = $products->get($productId);
            if (!$product) continue;

            $totalSold = $productMovements->sum('quantity');
            $revenue = $totalSold * $product->price;

            $salesData[] = [
                'product_id' => $productId,
                'product_name' => $product->name,
                'category' => $product->category?->name,
                'quantity_sold' => $totalSold,
                'revenue' => round($revenue, 2),
                'current_stock' => $product->quantity,
                'transactions' => $productMovements->count(),
            ];
        }

        // Sort by quantity sold descending
        usort($salesData, fn($a, $b) => $b['quantity_sold'] <=> $a['quantity_sold']);

        // Get top N
        $topSelling = array_slice($salesData, 0, $limit);

        // Calculate total revenue
        $totalRevenue = array_sum(array_column($salesData, 'revenue'));
        $totalQuantity = array_sum(array_column($salesData, 'quantity_sold'));

        return response()->json([
            'period' => [
                'days' => $days,
                'from' => $since->toDateString(),
                'to' => Carbon::now()->toDateString(),
            ],
            'summary' => [
                'total_revenue' => round($totalRevenue, 2),
                'total_quantity_sold' => $totalQuantity,
                'unique_products_sold' => count($salesData),
            ],
            'top_selling' => $topSelling,
        ]);
    }

    /**
     * Get stock evolution over time
     */
    public function stockEvolution(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $days = $request->get('days', 30);
        $productId = $request->get('product_id');

        $since = Carbon::now()->subDays($days)->startOfDay();

        $movementsQuery = StockMovement::where('company_id', $companyId)
            ->where('created_at', '>=', $since);

        if ($productId) {
            $movementsQuery->where('product_id', $productId);
        }

        $movements = $movementsQuery->orderBy('created_at')->get();

        // Build daily aggregates
        $dailyData = [];
        $currentDate = $since->copy();
        $today = Carbon::now()->endOfDay();

        while ($currentDate <= $today) {
            $dateKey = $currentDate->format('Y-m-d');
            $dayMovements = $movements->filter(function ($m) use ($currentDate) {
                return Carbon::parse($m->created_at)->isSameDay($currentDate);
            });

            $dailyData[] = [
                'date' => $dateKey,
                'stock_in' => $dayMovements->where('type', 'in')->sum('quantity'),
                'stock_out' => $dayMovements->where('type', 'out')->sum('quantity'),
                'net_change' => $dayMovements->where('type', 'in')->sum('quantity') 
                    - $dayMovements->where('type', 'out')->sum('quantity'),
                'transactions' => $dayMovements->count(),
            ];

            $currentDate->addDay();
        }

        // Calculate cumulative net change
        $cumulative = 0;
        foreach ($dailyData as &$day) {
            $cumulative += $day['net_change'];
            $day['cumulative_net'] = $cumulative;
        }

        return response()->json([
            'period' => [
                'days' => $days,
                'from' => $since->toDateString(),
                'to' => Carbon::now()->toDateString(),
            ],
            'data' => $dailyData,
        ]);
    }
}
