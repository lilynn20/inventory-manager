<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name'     => 'Administrator',
            'email'    => 'admin@inventory.com',
            'password' => 'password',
            'role'     => 'admin',
        ]);

        // Create employee user
        $employee = User::create([
            'name'     => 'John Employee',
            'email'    => 'employee@inventory.com',
            'password' => 'password',
            'role'     => 'employee',
        ]);

        // Create categories
        $electronics = Category::create(['name' => 'Electronics', 'description' => 'Electronic devices and accessories']);
        $office      = Category::create(['name' => 'Office Supplies', 'description' => 'Stationery and office essentials']);
        $furniture   = Category::create(['name' => 'Furniture', 'description' => 'Office and home furniture']);

        // Create products
        $products = [
            ['name' => 'Laptop Pro 15"', 'description' => 'High-performance laptop', 'category_id' => (string)$electronics->id, 'price' => 1299.99, 'quantity' => 25, 'low_stock_threshold' => 5],
            ['name' => 'Wireless Mouse',  'description' => 'Ergonomic wireless mouse', 'category_id' => (string)$electronics->id, 'price' => 29.99, 'quantity' => 8, 'low_stock_threshold' => 10],
            ['name' => 'USB-C Hub',       'description' => '7-in-1 USB-C hub', 'category_id' => (string)$electronics->id, 'price' => 49.99, 'quantity' => 3, 'low_stock_threshold' => 5],
            ['name' => 'Printer Paper A4','description' => 'Box of 500 sheets', 'category_id' => (string)$office->id, 'price' => 9.99, 'quantity' => 150, 'low_stock_threshold' => 20],
            ['name' => 'Ballpoint Pens',  'description' => 'Pack of 12 blue pens', 'category_id' => (string)$office->id, 'price' => 4.99, 'quantity' => 7, 'low_stock_threshold' => 15],
            ['name' => 'Office Chair',    'description' => 'Ergonomic office chair', 'category_id' => (string)$furniture->id, 'price' => 349.99, 'quantity' => 12, 'low_stock_threshold' => 3],
            ['name' => 'Standing Desk',   'description' => 'Height-adjustable desk', 'category_id' => (string)$furniture->id, 'price' => 599.99, 'quantity' => 2, 'low_stock_threshold' => 3],
        ];

        $createdProducts = [];
        foreach ($products as $p) {
            $createdProducts[] = Product::create($p);
        }

        // Create some stock movements
        $movements = [
            ['product_id' => (string)$createdProducts[0]->id, 'type' => 'in',  'quantity' => 30, 'user_id' => (string)$admin->id,    'note' => 'Initial stock'],
            ['product_id' => (string)$createdProducts[0]->id, 'type' => 'out', 'quantity' => 5,  'user_id' => (string)$employee->id, 'note' => 'Sales order #001'],
            ['product_id' => (string)$createdProducts[1]->id, 'type' => 'in',  'quantity' => 20, 'user_id' => (string)$admin->id,    'note' => 'Restocking'],
            ['product_id' => (string)$createdProducts[1]->id, 'type' => 'out', 'quantity' => 12, 'user_id' => (string)$employee->id, 'note' => 'Office distribution'],
            ['product_id' => (string)$createdProducts[3]->id, 'type' => 'in',  'quantity' => 200, 'user_id' => (string)$admin->id,   'note' => 'Bulk purchase'],
            ['product_id' => (string)$createdProducts[3]->id, 'type' => 'out', 'quantity' => 50, 'user_id' => (string)$employee->id, 'note' => 'Monthly supply'],
        ];

        foreach ($movements as $m) {
            StockMovement::create($m);
        }

        echo "Seeding complete!\n";
        echo "Admin: admin@inventory.com / password\n";
        echo "Employee: employee@inventory.com / password\n";
    }
}
