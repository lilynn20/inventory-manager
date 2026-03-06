<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DebugAuth extends Command
{
    protected $signature = 'debug:auth';
    protected $description = 'Debug authentication';

    public function handle()
    {
        $user = User::where('email', 'admin@inventory.com')->first();
        
        if (!$user) {
            $this->error('User not found!');
            return;
        }

        $this->info('User found: ' . $user->email);
        $this->info('Role: ' . $user->role);
        $this->info('Company ID: ' . $user->company_id);
        $this->info('Password hash: ' . substr($user->password, 0, 20) . '...');
        
        $check = Hash::check('password', $user->password);
        $this->info('Password check: ' . ($check ? 'PASS' : 'FAIL'));

        // Check auth attempt
        $credentials = ['email' => 'admin@inventory.com', 'password' => 'password'];
        $token = auth()->attempt($credentials);
        $this->info('JWT attempt: ' . ($token ? 'SUCCESS - token: ' . substr($token, 0, 30) . '...' : 'FAILED'));
    }
}
