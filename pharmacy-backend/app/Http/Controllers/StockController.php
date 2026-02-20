<?php

namespace App\Http\Controllers;

use App\Models\StockBatch;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index()
    {
        $stocks = StockBatch::with('product')->get();
        return response()->json($stocks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'expiry_date' => 'required|date|after:today',
            'batch_number' => 'required|string|max:255',
            'supplier' => 'nullable|string|max:255',
        ]);

        $stock = StockBatch::create($validated);

        return response()->json($stock->load('product'), 201);
    }

    public function show($id)
    {
        $stock = StockBatch::with('product')->findOrFail($id);
        return response()->json($stock);
    }

    public function update(Request $request, $id)
    {
        $stock = StockBatch::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:0',
            'expiry_date' => 'sometimes|date',
            'batch_number' => 'sometimes|string|max:255',
            'supplier' => 'nullable|string|max:255',
        ]);

        $stock->update($validated);

        return response()->json($stock->load('product'));
    }

    public function destroy($id)
    {
        $stock = StockBatch::findOrFail($id);
        $stock->delete();

        return response()->json(['message' => 'Stock batch deleted successfully']);
    }

    public function lowStock()
    {
        $stocks = StockBatch::with('product')
            ->where('quantity', '<', 10)
            ->get();

        return response()->json($stocks);
    }

    public function expiringSoon()
    {
        $stocks = StockBatch::with('product')
            ->whereDate('expiry_date', '<=', now()->addDays(30))
            ->get();

        return response()->json($stocks);
    }
}
