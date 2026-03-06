<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Send low stock alert emails to all admins in the company
     */
    public function sendLowStockAlert(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        // Get low stock products
        $lowStockProducts = Product::where('company_id', $companyId)
            ->get()
            ->filter(function ($product) {
                return $product->quantity <= $product->low_stock_threshold;
            });

        if ($lowStockProducts->isEmpty()) {
            return response()->json([
                'message' => 'No low stock products found',
                'count' => 0
            ]);
        }

        // Get admin users
        $admins = User::where('company_id', $companyId)
            ->where('role', 'admin')
            ->get();

        if ($admins->isEmpty()) {
            return response()->json([
                'message' => 'No admin users found to notify',
                'count' => 0
            ], 400);
        }

        // Build notification content
        $productList = $lowStockProducts->map(function ($p) {
            return "- {$p->name}: {$p->quantity} units (threshold: {$p->low_stock_threshold})";
        })->join("\n");

        $subject = "[StockFlow] Low Stock Alert - {$lowStockProducts->count()} products need attention";
        $body = "Hello,\n\n";
        $body .= "The following products are running low on stock:\n\n";
        $body .= $productList;
        $body .= "\n\nPlease review and restock as needed.\n";
        $body .= "\n-- StockFlow Inventory Management";

        $sentCount = 0;
        $errors = [];

        foreach ($admins as $admin) {
            try {
                Mail::raw($body, function ($message) use ($admin, $subject) {
                    $message->to($admin->email)
                            ->subject($subject);
                });
                $sentCount++;
            } catch (\Exception $e) {
                Log::warning("Failed to send low stock notification to {$admin->email}: " . $e->getMessage());
                $errors[] = $admin->email;
            }
        }

        // Log this activity
        ActivityLog::log(
            $user->_id,
            $user->name,
            $companyId,
            'notification_sent',
            'low_stock_alert',
            null,
            "Low stock alert sent to {$sentCount} admin(s) for {$lowStockProducts->count()} products"
        );

        return response()->json([
            'message' => "Low stock alert sent to {$sentCount} admin(s)",
            'products_count' => $lowStockProducts->count(),
            'recipients_count' => $sentCount,
            'failed' => $errors
        ]);
    }

    /**
     * Get low stock products preview (before sending notification)
     */
    public function getLowStockPreview(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        $lowStockProducts = Product::where('company_id', $companyId)
            ->get()
            ->filter(function ($product) {
                return $product->quantity <= $product->low_stock_threshold;
            })
            ->map(function ($product) {
                return [
                    'id' => (string) $product->_id,
                    'name' => $product->name,
                    'quantity' => $product->quantity,
                    'low_stock_threshold' => $product->low_stock_threshold,
                    'sku' => $product->sku ?? null
                ];
            })
            ->values();

        $adminCount = User::where('company_id', $companyId)
            ->where('role', 'admin')
            ->count();

        return response()->json([
            'products' => $lowStockProducts,
            'admin_count' => $adminCount
        ]);
    }
}
