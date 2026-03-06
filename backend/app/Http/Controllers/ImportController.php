<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ImportController extends Controller
{
    /**
     * Import products from CSV
     * Expected columns: name, description, category, supplier, price, quantity, low_stock_threshold, sku
     */
    public function importProducts(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120', // 5MB max
        ]);

        $user = Auth::user();
        $companyId = $user->company_id;

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        // Read header row
        $header = fgetcsv($handle);
        if (!$header) {
            fclose($handle);
            return response()->json(['message' => 'Empty or invalid CSV file'], 400);
        }

        // Normalize headers
        $header = array_map(function ($h) {
            return strtolower(trim($h));
        }, $header);

        // Required columns
        $requiredColumns = ['name', 'category', 'price', 'quantity'];
        $missingColumns = array_diff($requiredColumns, $header);
        if (!empty($missingColumns)) {
            fclose($handle);
            return response()->json([
                'message' => 'Missing required columns: ' . implode(', ', $missingColumns),
                'required' => $requiredColumns,
                'found' => $header
            ], 400);
        }

        // Cache categories and suppliers for lookup
        $categories = Category::where('company_id', $companyId)->get()->keyBy('name');
        $suppliers = Supplier::where('company_id', $companyId)->get()->keyBy('name');

        $imported = 0;
        $errors = [];
        $row = 1;

        DB::beginTransaction();
        try {
            while (($data = fgetcsv($handle)) !== false) {
                $row++;
                
                // Skip empty rows
                if (empty(array_filter($data))) {
                    continue;
                }

                // Map columns to data
                $rowData = array_combine($header, array_pad($data, count($header), ''));

                // Validate row
                $validator = Validator::make($rowData, [
                    'name' => 'required|string|max:255',
                    'category' => 'required|string',
                    'price' => 'required|numeric|min:0',
                    'quantity' => 'required|integer|min:0',
                ]);

                if ($validator->fails()) {
                    $errors[] = [
                        'row' => $row,
                        'errors' => $validator->errors()->all()
                    ];
                    continue;
                }

                // Find or create category
                $categoryName = trim($rowData['category']);
                if (!$categories->has($categoryName)) {
                    $newCategory = Category::create([
                        'name' => $categoryName,
                        'description' => '',
                        'company_id' => $companyId,
                    ]);
                    $categories->put($categoryName, $newCategory);
                    ActivityLog::log('created', 'category', (string) $newCategory->_id, $categoryName . ' (via import)');
                }
                $categoryId = (string) $categories->get($categoryName)->_id;

                // Find supplier if provided
                $supplierId = null;
                if (!empty($rowData['supplier'])) {
                    $supplierName = trim($rowData['supplier']);
                    if (!$suppliers->has($supplierName)) {
                        $newSupplier = Supplier::create([
                            'name' => $supplierName,
                            'email' => '',
                            'phone' => '',
                            'address' => '',
                            'company_id' => $companyId,
                        ]);
                        $suppliers->put($supplierName, $newSupplier);
                        ActivityLog::log('created', 'supplier', (string) $newSupplier->_id, $supplierName . ' (via import)');
                    }
                    $supplierId = (string) $suppliers->get($supplierName)->_id;
                }

                // Create product
                $product = Product::create([
                    'name' => trim($rowData['name']),
                    'description' => trim($rowData['description'] ?? ''),
                    'category_id' => $categoryId,
                    'supplier_id' => $supplierId,
                    'price' => floatval($rowData['price']),
                    'quantity' => intval($rowData['quantity']),
                    'low_stock_threshold' => isset($rowData['low_stock_threshold']) ? intval($rowData['low_stock_threshold']) : 10,
                    'sku' => trim($rowData['sku'] ?? ''),
                    'company_id' => $companyId,
                ]);

                ActivityLog::log('created', 'product', (string) $product->_id, $product->name . ' (via import)');
                $imported++;
            }

            fclose($handle);
            DB::commit();

            return response()->json([
                'message' => "Successfully imported {$imported} products",
                'imported' => $imported,
                'errors' => $errors,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            fclose($handle);
            return response()->json([
                'message' => 'Import failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import suppliers from CSV
     * Expected columns: name, email, phone, address
     */
    public function importSuppliers(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $user = Auth::user();
        $companyId = $user->company_id;

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        $header = fgetcsv($handle);
        if (!$header) {
            fclose($handle);
            return response()->json(['message' => 'Empty or invalid CSV file'], 400);
        }

        $header = array_map(fn($h) => strtolower(trim($h)), $header);

        if (!in_array('name', $header)) {
            fclose($handle);
            return response()->json(['message' => 'Missing required column: name'], 400);
        }

        $existingSuppliers = Supplier::where('company_id', $companyId)->pluck('name')->toArray();

        $imported = 0;
        $skipped = 0;
        $errors = [];
        $row = 1;

        DB::beginTransaction();
        try {
            while (($data = fgetcsv($handle)) !== false) {
                $row++;

                if (empty(array_filter($data))) {
                    continue;
                }

                $rowData = array_combine($header, array_pad($data, count($header), ''));
                $name = trim($rowData['name']);

                if (empty($name)) {
                    $errors[] = ['row' => $row, 'errors' => ['Name is required']];
                    continue;
                }

                // Skip duplicates
                if (in_array($name, $existingSuppliers)) {
                    $skipped++;
                    continue;
                }

                $supplier = Supplier::create([
                    'name' => $name,
                    'email' => trim($rowData['email'] ?? ''),
                    'phone' => trim($rowData['phone'] ?? ''),
                    'address' => trim($rowData['address'] ?? ''),
                    'company_id' => $companyId,
                ]);

                $existingSuppliers[] = $name;
                ActivityLog::log('created', 'supplier', (string) $supplier->_id, $name . ' (via import)');
                $imported++;
            }

            fclose($handle);
            DB::commit();

            return response()->json([
                'message' => "Imported {$imported} suppliers, skipped {$skipped} duplicates",
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            fclose($handle);
            return response()->json(['message' => 'Import failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Download sample CSV template
     */
    public function downloadTemplate($type)
    {
        $templates = [
            'products' => [
                'filename' => 'products_template.csv',
                'headers' => ['name', 'description', 'category', 'supplier', 'price', 'quantity', 'low_stock_threshold', 'sku'],
                'sample' => ['Sample Product', 'Product description', 'Electronics', 'ABC Supplies', '29.99', '100', '10', 'SKU001'],
            ],
            'suppliers' => [
                'filename' => 'suppliers_template.csv',
                'headers' => ['name', 'email', 'phone', 'address'],
                'sample' => ['ABC Supplies', 'contact@abc.com', '+1234567890', '123 Main St, City'],
            ],
        ];

        if (!isset($templates[$type])) {
            return response()->json(['message' => 'Invalid template type'], 400);
        }

        $template = $templates[$type];
        $callback = function () use ($template) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $template['headers']);
            fputcsv($handle, $template['sample']);
            fclose($handle);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $template['filename'] . '"',
        ]);
    }
}
