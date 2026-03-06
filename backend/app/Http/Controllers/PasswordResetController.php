<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal if email exists or not for security
            return response()->json([
                'message' => 'If that email exists in our system, you will receive a password reset link.',
            ]);
        }

        // Delete any existing tokens for this email
        PasswordReset::where('email', $request->email)->delete();

        // Generate token
        $token = Str::random(64);

        // Store reset token
        PasswordReset::create([
            'email'      => $request->email,
            'token'      => Hash::make($token),
            'expires_at' => Carbon::now()->addHours(1),
        ]);

        // In production, you would send an email here
        // For now, we'll return the token in development
        $resetUrl = config('app.frontend_url', 'http://localhost:5173') . "/reset-password?token={$token}&email={$request->email}";

        // Try to send email if configured
        try {
            Mail::raw("Click here to reset your password: {$resetUrl}", function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Password Reset Request');
            });
        } catch (\Exception $e) {
            // Email not configured, log it
            \Log::info("Password reset link for {$request->email}: {$resetUrl}");
        }

        return response()->json([
            'message' => 'If that email exists in our system, you will receive a password reset link.',
            // Only include in development
            'debug_url' => config('app.debug') ? $resetUrl : null,
        ]);
    }

    /**
     * Reset password with token
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'token'    => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $reset = PasswordReset::where('email', $request->email)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$reset) {
            return response()->json([
                'error' => 'Invalid or expired reset token.',
            ], 422);
        }

        // Verify token
        if (!Hash::check($request->token, $reset->token)) {
            return response()->json([
                'error' => 'Invalid or expired reset token.',
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'User not found.',
            ], 404);
        }

        // Update password
        $user->password = $request->password;
        $user->save();

        // Delete the reset token
        $reset->delete();

        return response()->json([
            'message' => 'Password has been reset successfully. You can now login.',
        ]);
    }
}
