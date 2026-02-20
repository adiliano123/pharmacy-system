<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StockBatch;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Paracetamol 500mg',
                'category' => 'Pain Relief',
                'description' => 'Pain and fever relief medication',
                'price' => 5.99,
            ],
            [
                'name' => 'Amoxicillin 250mg',
                'category' => 'Antibiotics',
                'description' => 'Antibiotic for bacterial infections',
                'price' => 12.50,
            ],
            [
                'name' => 'Ibuprofen 400mg',
                'category' => 'Pain Relief',
                'description' => 'Anti-inflammatory pain relief',
                'price' => 7.99,
            ],
            [
                'name' => 'Vitamin C 1000mg',
                'category' => 'Supplements',
                'description' => 'Immune system support',
                'price' => 15.00,
            ],
            [
                'name' => 'Omeprazole 20mg',
                'category' => 'Digestive',
                'description' => 'Acid reflux treatment',
                'price' => 18.99,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::create($productData);

            // Create stock batches for each product
            StockBatch::create([
                'product_id' => $product->id,
                'quantity' => rand(50, 200),
                'expiry_date' => now()->addMonths(rand(6, 24)),
                'batch_number' => 'BATCH-' . strtoupper(uniqid()),
                'supplier' => 'Supplier ' . rand(1, 5),
            ]);
        }
    }
}
