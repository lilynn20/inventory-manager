<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Register a new company with its owner (admin)
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:mongodb.users,email',
            'password'     => 'required|string|min:6',
            'company_name' => 'required|string|max:255',
        ]);

        // Create the company first
        $company = Company::create([
            'name'  => $request->company_name,
            'email' => $request->email,
        ]);

        // Create the owner/admin user
        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => $request->password,
            'role'       => 'admin',
            'is_owner'   => true,
            'company_id' => $company->_id,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Company and user registered successfully',
            'user'    => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'role'     => $user->role,
                'is_owner' => $user->is_owner,
            ],
            'company' => [
                'id'   => $company->id,
                'name' => $company->name,
            ],
            'token'   => $token,
        ], 201);
    }

    /**
     * Add an employee to the current company (admin only)
     */
    public function addEmployee(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:mongodb.users,email',
            'password' => 'required|string|min:6',
            'role'     => 'in:admin,employee',
        ]);

        $currentUser = Auth::user();

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => $request->password,
            'role'       => $request->role ?? 'employee',
            'is_owner'   => false,
            'company_id' => $currentUser->company_id,
        ]);

        return response()->json([
            'message' => 'Employee added successfully',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ], 201);
    }

    /**
     * Get all employees in current company (admin only)
     */
    public function getEmployees()
    {
        $currentUser = Auth::user();
        $employees = User::where('company_id', $currentUser->company_id)
            ->get(['_id', 'name', 'email', 'role', 'is_owner', 'created_at']);

        return response()->json($employees);
    }

    /**
     * Delete an employee (admin only, cannot delete owner)
     */
    public function deleteEmployee($id)
    {
        $currentUser = Auth::user();
        $employee = User::where('_id', $id)
            ->where('company_id', $currentUser->company_id)
            ->first();

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        if ($employee->is_owner) {
            return response()->json(['error' => 'Cannot delete company owner'], 403);
        }

        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        $user = Auth::user();
        $company = Company::find($user->company_id);

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'role'     => $user->role,
                'is_owner' => $user->is_owner ?? false,
            ],
            'company' => $company ? [
                'id'   => $company->id,
                'name' => $company->name,
            ] : null,
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me()
    {
        $user = Auth::user();
        $company = Company::find($user->company_id);

        return response()->json([
            'id'       => $user->id,
            'name'     => $user->name,
            'email'    => $user->email,
            'role'     => $user->role,
            'is_owner' => $user->is_owner ?? false,
            'company'  => $company ? [
                'id'   => $company->id,
                'name' => $company->name,
            ] : null,
        ]);
    }
}
