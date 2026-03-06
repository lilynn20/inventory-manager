<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $companyId = Auth::user()->company_id;
        $categories = Category::where('company_id', $companyId)->get();
        
        // Manually count products for each category (MongoDB doesn't support withCount)
        $productCounts = Product::where('company_id', $companyId)
            ->whereNotNull('category_id')
            ->get()
            ->groupBy('category_id')
            ->map(fn($products) => $products->count());
        
        // Add products_count to each category
        $categories = $categories->map(function ($category) use ($productCounts) {
            $category->products_count = $productCounts->get((string) $category->_id, 0);
            return $category;
        });
        
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Check unique within company
        if (Category::where('company_id', $companyId)->where('name', $request->name)->exists()) {
            return response()->json(['error' => 'Category name already exists'], 422);
        }

        $category = Category::create([
            'name'        => $request->name,
            'description' => $request->description,
            'company_id'  => $companyId,
        ]);

        ActivityLog::log('created', 'category', (string) $category->_id, $category->name);

        return response()->json($category, 201);
    }

    public function show($id)
    {
        $companyId = Auth::user()->company_id;
        $category = Category::where('company_id', $companyId)->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $companyId = Auth::user()->company_id;
        $category = Category::where('company_id', $companyId)->findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Check unique name within company, excluding current category
        if (Category::where('company_id', $companyId)
            ->where('name', $request->name)
            ->where('_id', '!=', $id)
            ->exists()) {
            return response()->json(['error' => 'Category name already exists'], 422);
        }

        $category->update($request->only('name', 'description'));

        ActivityLog::log('updated', 'category', (string) $category->_id, $category->name);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $companyId = Auth::user()->company_id;
        $category = Category::where('company_id', $companyId)->findOrFail($id);

        if ($category->products()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete category with existing products.',
            ], 422);
        }

        $categoryName = $category->name;
        $categoryId = (string) $category->_id;
        $category->delete();

        ActivityLog::log('deleted', 'category', $categoryId, $categoryName);

        return response()->json(['message' => 'Category deleted']);
    }
}
