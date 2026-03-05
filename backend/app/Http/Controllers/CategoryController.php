<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $companyId = Auth::user()->company_id;
        $categories = Category::where('company_id', $companyId)
            ->withCount('products')
            ->get();
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

        $category->update($request->only('name', 'description'));
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

        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
