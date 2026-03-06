<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    /**
     * Fields to exclude from sanitization (e.g., passwords, rich text fields)
     */
    protected array $except = [
        'password',
        'password_confirmation',
        'current_password',
        'new_password',
        'new_password_confirmation',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();
        $sanitized = $this->sanitize($input);
        $request->merge($sanitized);

        return $next($request);
    }

    /**
     * Recursively sanitize the input array
     */
    protected function sanitize(array $input): array
    {
        foreach ($input as $key => $value) {
            if (in_array($key, $this->except, true)) {
                continue;
            }

            if (is_array($value)) {
                $input[$key] = $this->sanitize($value);
            } elseif (is_string($value)) {
                $input[$key] = $this->clean($value);
            }
        }

        return $input;
    }

    /**
     * Clean a single string value
     */
    protected function clean(string $value): string
    {
        // Strip HTML tags
        $value = strip_tags($value);

        // Convert special characters to HTML entities
        $value = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8', false);

        // Remove null bytes
        $value = str_replace(chr(0), '', $value);

        // Trim whitespace
        $value = trim($value);

        return $value;
    }
}
