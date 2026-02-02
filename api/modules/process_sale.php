<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', '../debug.log');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once 'verify_session.php';

// Log the request
error_log("=== SALE PROCESSING REQUEST ===");
error_log("Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Headers: " . json_encode(getallheaders()));
error_log("Raw input: " . file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify session
    $headers = getallheaders();
    $session_token = $headers['Authorization'] ?? '';
    
    error_log("Session token received: " . ($session_token ? 'Yes' : 'No'));
    
    if (empty($session_token)) {
        error_log("ERROR: No session token provided");
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit();
    }
    
    $session_token = str_replace('Bearer ', '', $session_token);
    $session = verifySession($conn, $session_token);
    
    if (!$session) {
        error_log("ERROR: Invalid session token");
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
        exit();
    }
    
    $user_id = $session['user_id'];
    error_log("User authenticated: ID = " . $user_id);
    
    // Get request data
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("ERROR: Invalid JSON data - " . json_last_error_msg());
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit();
    }
    
    $items = $data['items'] ?? [];
    $customer = $data['customer'] ?? [];
    $payment_method = $data['payment_method'] ?? 'cash';
    $subtotal = $data['subtotal'] ?? 0;
    $discount = $data['discount'] ?? 0;
    $total = $data['total'] ?? 0;
    
    error_log("Items count: " . count($items));
    error_log("Payment method: " . $payment_method);
    error_log("Total: " . $total);
    
    if (empty($items) || !is_array($items)) {
        error_log("ERROR: No items provided or invalid format");
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No items provided']);
        exit();
    }
    
    try {
        $conn->begin_transaction();
        error_log("Transaction started");
        
        $sale_items = [];
        $total_calculated = 0;
        
        // Process each item
        foreach ($items as $index => $item) {
            error_log("Processing item " . ($index + 1) . ": " . json_encode($item));
            
            $inventory_id = $item['inventory_id'] ?? null;
            $qty = $item['quantity'] ?? null;
            
            if (empty($inventory_id) || empty($qty) || $qty <= 0) {
                throw new Exception("Invalid item data at index " . $index);
            }
            
            // Get current inventory details
            $stmt = $conn->prepare("SELECT name, generic_name, batch_number, quantity, price FROM inventory WHERE inventory_id = ?");
            $stmt->bind_param("i", $inventory_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception("Item not found: " . $inventory_id);
            }
            
            $medicine = $result->fetch_assoc();
            $current_qty = $medicine['quantity'];
            $medicine_name = $medicine['name'];
            $batch_number = $medicine['batch_number'];
            $price = $medicine['price'];
            
            error_log("Found medicine: " . $medicine_name . " (Stock: " . $current_qty . ", Price: " . $price . ")");
            
            // Check if enough stock exists
            if ($current_qty < $qty) {
                throw new Exception("Not enough stock for {$medicine_name}! Available: {$current_qty}, Requested: {$qty}");
            }
            
            // Calculate item total
            $item_total = $price * $qty;
            $total_calculated += $item_total;
            
            // Update inventory (subtract quantity)
            $stmt = $conn->prepare("UPDATE inventory SET quantity = quantity - ? WHERE inventory_id = ?");
            $stmt->bind_param("ii", $qty, $inventory_id);
            $stmt->execute();
            
            if ($stmt->affected_rows === 0) {
                throw new Exception("Failed to update inventory for " . $medicine_name);
            }
            
            error_log("Updated inventory: " . $medicine_name . " (Sold: " . $qty . ")");
            
            // Record individual sale
            $customer_name = $customer['name'] ?? '';
            $notes = "POS Sale - Payment: " . strtoupper($payment_method);
            if (!empty($customer['phone'])) {
                $notes .= " - Phone: " . $customer['phone'];
            }
            
            $stmt = $conn->prepare("
                INSERT INTO sales (inventory_id, batch_number, name, quantity_sold, total_revenue, sold_by, customer_name, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->bind_param("issidiss", $inventory_id, $batch_number, $medicine_name, $qty, $item_total, $user_id, $customer_name, $notes);
            $stmt->execute();
            
            if ($stmt->affected_rows === 0) {
                throw new Exception("Failed to record sale for " . $medicine_name);
            }
            
            error_log("Recorded sale: " . $medicine_name . " (Sale ID: " . $conn->insert_id . ")");
            
            $sale_items[] = [
                'sale_id' => $conn->insert_id,
                'name' => $medicine_name,
                'quantity' => $qty,
                'price' => $price,
                'total' => $item_total,
                'remaining_stock' => $current_qty - $qty
            ];
        }
        
        // Log the complete transaction
        $action = "POS_SALE";
        $description = "Processed POS sale with " . count($items) . " items. Total: TSh " . number_format($total) . " (" . strtoupper($payment_method) . ")";
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
        $stmt = $conn->prepare("INSERT INTO activity_log (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $user_id, $action, $description, $ip_address);
        $stmt->execute();
        
        error_log("Activity logged");
        
        $conn->commit();
        error_log("Transaction committed successfully");
        
        echo json_encode([
            'success' => true,
            'message' => 'Sale processed successfully',
            'transaction_id' => time() . '_' . $user_id,
            'items' => $sale_items,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => $total,
            'payment_method' => $payment_method,
            'customer' => $customer
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        error_log("ERROR: Transaction rolled back - " . $e->getMessage());
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    error_log("ERROR: Invalid request method - " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>