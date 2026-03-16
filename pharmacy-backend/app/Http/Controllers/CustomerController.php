<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::withCount('sales')->get();
        return response()->json($customers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
        ]);

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    public function show($id)
    {
        $customer = Customer::with('sales')->findOrFail($id);
        return response()->json($customer);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|unique:customers,email,' . $id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'nullable|string',
        ]);

        $customer->update($validated);

        return response()->json($customer);
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }

    // ── Credit Management ──────────────────────────────────────────

    public function creditIndex()
    {
        $customers = Customer::select(
                'id', 'name', 'phone', 'credit_limit', 'current_balance'
            )
            ->where('credit_limit', '>', 0)
            ->orWhere('current_balance', '>', 0)
            ->get()
            ->map(function ($c) {
                return [
                    'id'               => $c->id,
                    'name'             => $c->name,
                    'phone'            => $c->phone,
                    'credit_limit'     => (float) $c->credit_limit,
                    'credit_used'      => (float) $c->current_balance,
                    'credit_available' => max(0, (float) $c->credit_limit - (float) $c->current_balance),
                ];
            });

        return response()->json($customers);
    }

    public function creditTransactions()
    {
        // Return credit sales (payment_status = 'credit') as charge transactions
        // and any manual payments recorded against them
        $transactions = Sale::with('customer')
            ->where('payment_method', 'credit')
            ->orWhere('payment_status', 'credit')
            ->latest()
            ->take(50)
            ->get()
            ->map(function ($sale) {
                return [
                    'id'            => $sale->id,
                    'customer_id'   => $sale->customer_id,
                    'customer_name' => $sale->customer?->name ?? 'Unknown',
                    'amount'        => (float) $sale->total_amount,
                    'type'          => $sale->payment_status === 'paid' ? 'payment' : 'charge',
                    'description'   => $sale->payment_status === 'paid'
                        ? 'Credit payment received'
                        : 'Credit sale #' . $sale->id,
                    'created_at'    => $sale->created_at,
                ];
            });

        return response()->json($transactions);
    }

    public function recordCreditPayment(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'amount'      => 'required|numeric|min:0.01',
        ]);

        $customer = Customer::findOrFail($request->customer_id);

        if ($request->amount > $customer->current_balance) {
            return response()->json([
                'message' => 'Payment amount exceeds outstanding balance of TZS ' . number_format($customer->current_balance, 2)
            ], 422);
        }

        DB::transaction(function () use ($customer, $request) {
            $customer->decrement('current_balance', $request->amount);

            // Mark the oldest unpaid credit sale(s) as paid
            $remaining = $request->amount;
            $unpaidSales = Sale::where('customer_id', $customer->id)
                ->where('payment_status', 'credit')
                ->oldest()
                ->get();

            foreach ($unpaidSales as $sale) {
                if ($remaining <= 0) break;
                if ($remaining >= $sale->total_amount) {
                    $sale->update(['payment_status' => 'paid']);
                    $remaining -= $sale->total_amount;
                } else {
                    // Partial — just reduce balance, leave sale as credit
                    break;
                }
            }
        });

        return response()->json([
            'message'         => 'Payment of TZS ' . number_format($request->amount, 2) . ' recorded successfully.',
            'new_balance'     => (float) $customer->fresh()->current_balance,
        ]);
    }
}
