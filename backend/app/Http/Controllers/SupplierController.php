<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupplierController extends Controller
{
    /**
     * List all suppliers for the current company
     */
    public function index(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $query = Supplier::where('company_id', $companyId);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $suppliers = $query->orderBy('name')->get();

        return response()->json($suppliers);
    }

    /**
     * Create a new supplier
     */
    public function store(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'nullable|email|max:255',
            'phone'   => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        $supplier = Supplier::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'phone'      => $request->phone,
            'address'    => $request->address,
            'company_id' => $companyId,
        ]);

        ActivityLog::log('created', 'supplier', (string) $supplier->_id, $supplier->name);

        return response()->json($supplier, 201);
    }

    /**
     * Show a single supplier
     */
    public function show($id)
    {
        $companyId = Auth::user()->company_id;
        $supplier = Supplier::where('company_id', $companyId)->findOrFail($id);
        
        return response()->json($supplier);
    }

    /**
     * Update a supplier
     */
    public function update(Request $request, $id)
    {
        $companyId = Auth::user()->company_id;
        $supplier = Supplier::where('company_id', $companyId)->findOrFail($id);

        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'nullable|email|max:255',
            'phone'   => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        $supplier->update([
            'name'    => $request->name,
            'email'   => $request->email,
            'phone'   => $request->phone,
            'address' => $request->address,
        ]);

        ActivityLog::log('updated', 'supplier', (string) $supplier->_id, $supplier->name);

        return response()->json($supplier);
    }

    /**
     * Delete a supplier
     */
    public function destroy($id)
    {
        $companyId = Auth::user()->company_id;
        $supplier = Supplier::where('company_id', $companyId)->findOrFail($id);

        // Check if supplier has products before deleting
        if ($supplier->products()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete supplier with existing products. Reassign products first.',
            ], 422);
        }

        $supplierName = $supplier->name;
        $supplierId = (string) $supplier->_id;
        $supplier->delete();

        ActivityLog::log('deleted', 'supplier', $supplierId, $supplierName);

        return response()->json(['message' => 'Supplier deleted successfully']);
    }
}
