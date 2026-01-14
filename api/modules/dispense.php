<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once 'verify_session.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify session
    $headers = getallheaders();
    $session_token = $headers['Authorization'] ?? '';
    
    if (empty($session_token)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit();
    }
    
    $session_token = str_replace('Bearer ', '', $session_token);
    $session = verifySession($conn, $session_token);
    
    if (!$session) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
        exit();
    }
    
    $user_id = $session['user_id'];
    
    // Get request data
    $data = json_decode(file_get_contents("php://input"), true);
    $inventory_id = $data['inventory_id'] ?? null;
    $qty = $data['qty'] ?? null;
    $customer_name = $data['customer_name'] ?? null;
    $notes = $data['notes'] ?? null;
    
    if (empty($inventory_id) || empty($qty) || $qty <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid inventory ID or quantity']);
        exit();
    }
    
    try {
        $conn->begin_transaction();
        
        // 1. Get current inventory details
        $stmt = $conn->prepare("SELECT name, batch_number, quantity, price FROM inventory WHERE inventory_id = ?");
        $stmt->bind_param("i", $inventory_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            throw new Exception("Medicine not found");
        }
        
        $medicine = $result->fetch_assoc();
        $current_qty = $medicine['quantity'];
        $medicine_name = $medicine['name'];
        $batch_number = $medicine['batch_number'];
        $price = $medicine['price'];
        
        // 2. Check if enough stock exists
        if ($current_qty < $qty) {
            throw new Exception("Not enough stock available! Current stock: " . $current_qty);
        }
        
        // 3. Calculate total revenue
        $total_revenue = $price * $qty;
        
        // 4. Update inventory (subtract quantity)
        $stmt = $conn->prepare("UPDATE inventory SET quantity = quantity - ? WHERE inventory_id = ?");
        $stmt->bind_param("ii", $qty, $inventory_id);
        $stmt->execute();
        
        // 5. Record the sale with employee tracking
        $stmt = $conn->prepare("
            INSERT INTO sales (inventory_id, batch_number, name, quantity_sold, total_revenue, sold_by, customer_name, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("issidiss", $inventory_id, $batch_number, $medicine_name, $qty, $total_revenue, $user_id, $customer_name, $notes);
        $stmt->execute();
        
        $sale_id = $conn->insert_id;
        
        // 6. Log activity
        $action = "DISPENSE";
        $description = "Dispensed $qty units of $medicine_name (Batch: $batch_number)";
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
        $stmt = $conn->prepare("INSERT INTO activity_log (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $user_id, $action, $description, $ip_address);
        $stmt->execute();
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Medicine dispensed successfully',
            'sale_id' => $sale_id,
            'quantity_dispensed' => $qty,
            'total_revenue' => $total_revenue,
            'remaining_stock' => $current_qty - $qty
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
