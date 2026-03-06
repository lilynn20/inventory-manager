<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create company first
        $company = Company::create([
            'name'  => 'Demo Company',
            'email' => 'admin@inventory.com',
        ]);

        $companyId = (string) $company->_id;

        // Create admin user
        User::create([
            'name'       => 'Administrator',
            'email'      => 'admin@inventory.com',
            'password'   => 'password',
            'role'       => 'admin',
            'is_owner'   => true,
            'company_id' => $companyId,
        ]);

        echo "Seeding complete!\n";
        echo "Admin: admin@inventory.com / password\n";
        echo "All products, categories, and suppliers should be added by the admin.\n";
    }
}
