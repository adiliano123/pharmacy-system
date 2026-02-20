<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '+1234567890',
                'address' => '123 Main St, City',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '+1234567891',
                'address' => '456 Oak Ave, Town',
            ],
            [
                'name' => 'Bob Johnson',
                'email' => null,
                'phone' => '+1234567892',
                'address' => '789 Pine Rd, Village',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
