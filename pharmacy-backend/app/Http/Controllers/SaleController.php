<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockBatch;
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
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $sale = Sale::create([
                'customer_id' => $validated['customer_id'] ?? null,
                'user_id' => $request->user()->id,
                'total_amount' => 0,
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

                // Deduct from stock
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
            }

            $sale->update(['total_amount' => $totalAmount]);

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
