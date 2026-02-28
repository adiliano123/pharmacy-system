<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockBatch;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'items.product'])->latest()->get();
        return response()->json($sales);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'customer_name' => 'nullable|string|max:255',
            'payment_method' => 'required|in:cash,card,mobile',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Create customer if name provided but no customer_id
            $customerId = $validated['customer_id'] ?? null;
            if (!$customerId && !empty($validated['customer_name']) && $validated['customer_name'] !== 'Walk-in Customer') {
                $customer = \App\Models\Customer::firstOrCreate(
                    ['name' => $validated['customer_name']],
                    ['phone' => '', 'email' => '']
                );
                $customerId = $customer->id;
            }

            $sale = Sale::create([
                'customer_id' => $customerId,
                'user_id' => $request->user()->id,
                'total_amount' => 0,
                'payment_method' => $validated['payment_method'],
            ]);

            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                $subtotal = $item['quantity'] * $item['price'];
                $totalAmount += $subtotal;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $subtotal,
                ]);

                // Deduct from stock (FIFO - First In First Out by expiry date)
                $remainingQty = $item['quantity'];
                $batches = StockBatch::where('product_id', $item['product_id'])
                    ->where('quantity', '>', 0)
                    ->orderBy('expiry_date')
                    ->get();

                foreach ($batches as $batch) {
                    if ($remainingQty <= 0) break;

                    $deductQty = min($batch->quantity, $remainingQty);
                    $batch->quantity -= $deductQty;
                    $batch->save();

                    $remainingQty -= $deductQty;
                }

                if ($remainingQty > 0) {
                    throw new \Exception("Insufficient stock for product ID: {$item['product_id']}");
                }
            }

            $sale->update(['total_amount' => $totalAmount]);

            // Log activity
            ActivityLog::log(
                'create',
                "Processed sale #" . $sale->id . " - Total: TZS " . number_format($totalAmount, 2),
                'Sale',
                $sale->id
            );

            return response()->json($sale->load(['customer', 'items.product']), 201);
        });
    }

    public function show($id)
    {
        $sale = Sale::with(['customer', 'items.product', 'user'])->findOrFail($id);
        return response()->json($sale);
    }

    public function destroy($id)
    {
        $sale = Sale::findOrFail($id);
        $sale->delete();

        return response()->json(['message' => 'Sale deleted successfully']);
    }
}
