<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@pharmacy.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create pharmacist
        User::factory()->create([
            'name' => 'Pharmacist',
            'email' => 'pharmacist@pharmacy.com',
            'password' => bcrypt('password'),
            'role' => 'pharmacist',
        ]);

        // Create cashier
        User::factory()->create([
            'name' => 'Cashier',
            'email' => 'cashier@pharmacy.com',
            'password' => bcrypt('password'),
            'role' => 'cashier',
        ]);

        $this->call([
            ProductSeeder::class,
            CustomerSeeder::class,
        ]);
    }
}
