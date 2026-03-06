<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\User;
use App\Models\Company;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CheckLowStock extends Command
{
    protected $signature = 'stock:check-low';
    protected $description = 'Check for low stock products and send notifications to admins';

    public function handle()
    {
        $this->info('Checking for low stock products...');

        // Get all companies
        $companies = Company::all();
        $totalNotifications = 0;

        foreach ($companies as $company) {
            $companyId = (string) $company->_id;

            // Find low stock products for this company
            $lowStockProducts = Product::where('company_id', $companyId)
                ->get()
                ->filter(function ($product) {
                    return $product->quantity <= $product->low_stock_threshold;
                });

            if ($lowStockProducts->isEmpty()) {
                continue;
            }

            // Get admin users for this company
            $admins = User::where('company_id', $companyId)
                ->where('role', 'admin')
                ->get();

            if ($admins->isEmpty()) {
                continue;
            }

            // Build the notification content
            $productList = $lowStockProducts->map(function ($p) {
                return "- {$p->name}: {$p->quantity} units (threshold: {$p->low_stock_threshold})";
            })->join("\n");

            $subject = "[StockFlow] Low Stock Alert - {$lowStockProducts->count()} products need attention";
            $body = "Hello,\n\n";
            $body .= "The following products are running low on stock:\n\n";
            $body .= $productList;
            $body .= "\n\nPlease review and restock as needed.\n";
            $body .= "\n-- StockFlow Inventory Management";

            foreach ($admins as $admin) {
                try {
                    Mail::raw($body, function ($message) use ($admin, $subject) {
                        $message->to($admin->email)
                                ->subject($subject);
                    });
                    $this->info("Notification sent to {$admin->email}");
                    $totalNotifications++;
                } catch (\Exception $e) {
                    // Log the error but continue
                    Log::warning("Failed to send low stock notification to {$admin->email}: " . $e->getMessage());
                    $this->warn("Failed to send to {$admin->email}: " . $e->getMessage());
                }
            }
        }

        $this->info("Low stock check complete. Sent {$totalNotifications} notifications.");
        return 0;
    }
}
