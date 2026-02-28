<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['stockBatches' => function($q) {
            $q->orderBy('expiry_date', 'asc');
        }]);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $products = $query->paginate($perPage);

        // Add computed fields
        $products->getCollection()->transform(function ($product) {
            $totalQuantity = $product->stockBatches->sum('quantity');
            $product->total_quantity = $totalQuantity;
            $product->is_low_stock = $totalQuantity < 20;
            $product->is_out_of_stock = $totalQuantity == 0;
            
            // Check for expiring batches
            $expiringBatches = $product->stockBatches->filter(function($batch) {
                return $batch->expiry_date <= now()->addDays(30) && $batch->expiry_date > now();
            });
            $product->has_expiring_batches = $expiringBatches->count() > 0;
            
            return $product;
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $product = Product::create($validated);

        // Log activity
        ActivityLog::log(
            'create',
            "Created product: {$product->name}",
            'Product',
            $product->id
        );

        return response()->json($product, 201);
    }

    public function show($id)
    {
        $product = Product::with('stockBatches')->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
        ]);

        $product->update($validated);

        // Log activity
        ActivityLog::log(
            'update',
            "Updated product: {$product->name}",
            'Product',
            $product->id,
            ['old' => $product->getOriginal(), 'new' => $product->getAttributes()]
        );

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $productName = $product->name;
        $product->delete();

        // Log activity
        ActivityLog::log(
            'delete',
            "Deleted product: {$productName}",
            'Product',
            $id
        );

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
