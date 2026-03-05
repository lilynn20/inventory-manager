<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $query = Product::with('category')->where('company_id', $companyId);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        // Filter low stock in memory for MongoDB compatibility
        if ($request->boolean('low_stock')) {
            $products = $products->filter(function ($p) {
                return $p->quantity <= $p->low_stock_threshold;
            })->values();
        }

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $request->validate([
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'category_id'         => 'required|string',
            'price'               => 'required|numeric|min:0',
            'quantity'            => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'image'               => 'nullable|image|max:2048',
        ]);

        $data = $request->except('image');
        $data['company_id'] = $companyId;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }

        // Validate category exists and belongs to company
        Category::where('company_id', $companyId)->findOrFail($request->category_id);

        $product = Product::create($data);
        $product->load('category');

        return response()->json($product, 201);
    }

    public function show($id)
    {
        $companyId = Auth::user()->company_id;
        $product = Product::with('category')
            ->where('company_id', $companyId)
            ->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $companyId = Auth::user()->company_id;
        $product = Product::where('company_id', $companyId)->findOrFail($id);

        $request->validate([
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'category_id'         => 'required|string',
            'price'               => 'required|numeric|min:0',
            'quantity'            => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'image'               => 'nullable|image|max:2048',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }

        Category::where('company_id', $companyId)->findOrFail($request->category_id);

        $product->update($data);
        $product->load('category');

        return response()->json($product);
    }

    public function destroy($id)
    {
        $companyId = Auth::user()->company_id;
        $product = Product::where('company_id', $companyId)->findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
