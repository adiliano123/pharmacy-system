<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WholesaleController extends Controller
{
    /**
     * Get all wholesale customers
     */
    public function getWholesaleCustomers()
    {
        $customers = Customer::where('customer_type', 'wholesale')
            ->orderBy('name')
            ->get();

        return response()->json($customers);
    }

    /**
     * Create wholesale customer
     */
    public function createWholesaleCustomer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'required|string',
            'address' => 'nullable|string',
            'credit_limit' => 'required|numeric|min:0',
            'payment_terms_days' => 'required|integer|min:0',
            'tax_id' => 'nullable|string',
            'business_license' => 'nullable|string',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer = Customer::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'customer_type' => 'wholesale',
            'credit_limit' => $request->credit_limit,
            'current_balance' => 0,
            'payment_terms_days' => $request->payment_terms_days,
            'tax_id' => $request->tax_id,
            'business_license' => $request->business_license,
            'discount_percentage' => $request->discount_percentage ?? 0,
        ]);

        return response()->json($customer, 201);
    }

    /**
     * Update wholesale customer
     */
    public function updateWholesaleCustomer(Request $request, $id)
    {
        $customer = Customer::where('customer_type', 'wholesale')->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|unique:customers,email,' . $id,
            'phone' => 'sometimes|required|string',
            'address' => 'nullable|string',
            'credit_limit' => 'sometimes|numeric|min:0',
            'payment_terms_days' => 'sometimes|integer|min:0',
            'tax_id' => 'nullable|string',
            'business_license' => 'nullable|string',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer->update($request->all());

        return response()->json($customer);
    }

    /**
     * Create wholesale order
     */
    public function createWholesaleOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'required|in:paid,pending,partial',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $customer = Customer::findOrFail($request->customer_id);
            
            // Calculate totals
            $subtotal = 0;
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $price = $product->wholesale_price ?? $product->price;
                
                // Apply customer discount
                if ($customer->discount_percentage > 0) {
                    $price = $price * (1 - ($customer->discount_percentage / 100));
                }
                
                $subtotal += $price * $item['quantity'];
            }

            $discountAmount = $request->discount_amount ?? 0;
            $taxAmount = $request->tax_amount ?? 0;
            $totalAmount = $subtotal - $discountAmount + $taxAmount;

            // Create sale
            $sale = Sale::create([
                'customer_id' => $request->customer_id,
                'user_id' => auth()->id(),
                'total_amount' => $totalAmount,
                'sale_type' => 'wholesale',
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'payment_status' => $request->payment_status,
                'payment_method' => $request->payment_method ?? 'credit',
                'due_date' => $request->due_date,
                'notes' => $request->notes,
            ]);

            // Create sale items and update stock
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $price = $product->wholesale_price ?? $product->price;
                
                // Apply customer discount
                if ($customer->discount_percentage > 0) {
                    $price = $price * (1 - ($customer->discount_percentage / 100));
                }

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'subtotal' => $price * $item['quantity'],
                ]);

                // Update stock (deduct from oldest batches first - FIFO)
                $remainingQty = $item['quantity'];
                $batches = $product->stockBatches()
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

            // Update customer balance if not paid
            if ($request->payment_status !== 'paid') {
                $customer->current_balance += $totalAmount;
                $customer->save();
            }

            DB::commit();

            return response()->json([
                'sale' => $sale->load(['customer', 'items.product']),
                'message' => 'Wholesale order created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create order: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get wholesale orders
     */
    public function getWholesaleOrders(Request $request)
    {
        $query = Sale::where('sale_type', 'wholesale')
            ->with(['customer', 'user', 'items.product']);

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($orders);
    }

    /**
     * Get wholesale order by ID
     */
    public function getWholesaleOrder($id)
    {
        $order = Sale::where('sale_type', 'wholesale')
            ->with(['customer', 'user', 'items.product'])
            ->findOrFail($id);

        return response()->json($order);
    }

    /**
     * Record payment for wholesale order
     */
    public function recordPayment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $sale = Sale::where('sale_type', 'wholesale')->findOrFail($id);
            $customer = $sale->customer;

            // Update customer balance
            $customer->current_balance -= $request->amount;
            $customer->save();

            // Update payment status
            if ($customer->current_balance <= 0) {
                $sale->payment_status = 'paid';
            } else {
                $sale->payment_status = 'partial';
            }
            $sale->save();

            DB::commit();

            return response()->json([
                'message' => 'Payment recorded successfully',
                'sale' => $sale->load(['customer']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to record payment: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get wholesale dashboard stats
     */
    public function getWholesaleStats()
    {
        $totalCustomers = Customer::where('customer_type', 'wholesale')->count();
        $totalOrders = Sale::where('sale_type', 'wholesale')->count();
        $pendingOrders = Sale::where('sale_type', 'wholesale')
            ->where('payment_status', 'pending')
            ->count();
        $overdueOrders = Sale::where('sale_type', 'wholesale')
            ->where('payment_status', 'pending')
            ->where('due_date', '<', now())
            ->count();
        
        $totalRevenue = Sale::where('sale_type', 'wholesale')
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        
        $outstandingBalance = Customer::where('customer_type', 'wholesale')
            ->sum('current_balance');

        return response()->json([
            'totalCustomers' => $totalCustomers,
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'overdueOrders' => $overdueOrders,
            'totalRevenue' => $totalRevenue,
            'outstandingBalance' => $outstandingBalance,
        ]);
    }
}
