<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once 'verify_session.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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
    
    try {
        // Get today's date
        $today = date('Y-m-d');
        
        // 1. Today's sales for this cashier
        $stmt = $conn->prepare("
            SELECT 
                COUNT(*) as todayTransactions,
                COALESCE(SUM(total_revenue), 0) as todaySales,
                COALESCE(AVG(total_revenue), 0) as averageTransaction
            FROM sales 
            WHERE sold_by = ? AND DATE(sale_date) = ?
        ");
        $stmt->bind_param("is", $user_id, $today);
        $stmt->execute();
        $salesResult = $stmt->get_result()->fetch_assoc();
        
        // 2. Count unique customers today (based on customer_name)
        $stmt = $conn->prepare("
            SELECT COUNT(DISTINCT customer_name) as todayCustomers
            FROM sales 
            WHERE sold_by = ? AND DATE(sale_date) = ? AND customer_name IS NOT NULL AND customer_name != ''
        ");
        $stmt->bind_param("is", $user_id, $today);
        $stmt->execute();
        $customerResult = $stmt->get_result()->fetch_assoc();
        
        // 3. Top selling item today for this cashier
        $stmt = $conn->prepare("
            SELECT name, SUM(quantity_sold) as total_quantity
            FROM sales 
            WHERE sold_by = ? AND DATE(sale_date) = ?
            GROUP BY name
            ORDER BY total_quantity DESC
            LIMIT 1
        ");
        $stmt->bind_param("is", $user_id, $today);
        $stmt->execute();
        $topItemResult = $stmt->get_result()->fetch_assoc();
        
        // 4. Get pending payments (assuming we have a payments table or use notes field)
        $stmt = $conn->prepare("
            SELECT COUNT(*) as pendingPayments
            FROM sales 
            WHERE sold_by = ? AND DATE(sale_date) = ? AND notes LIKE '%pending%'
        ");
        $stmt->bind_param("is", $user_id, $today);
        $stmt->execute();
        $pendingResult = $stmt->get_result()->fetch_assoc();
        
        // 5. Calculate cash in hand (total cash sales today)
        $stmt = $conn->prepare("
            SELECT COALESCE(SUM(total_revenue), 0) as cashInHand
            FROM sales 
            WHERE sold_by = ? AND DATE(sale_date) = ? AND notes LIKE '%cash%'
        ");
        $stmt->bind_param("is", $user_id, $today);
        $stmt->execute();
        $cashResult = $stmt->get_result()->fetch_assoc();
        
        // Prepare response
        $stats = [
            'todaySales' => (float)$salesResult['todaySales'],
            'todayTransactions' => (int)$salesResult['todayTransactions'],
            'todayCustomers' => (int)$customerResult['todayCustomers'],
            'averageTransaction' => (float)$salesResult['averageTransaction'],
            'topSellingItem' => $topItemResult['name'] ?? 'No sales yet',
            'cashInHand' => (float)$cashResult['cashInHand'],
            'pendingPayments' => (int)$pendingResult['pendingPayments'],
            'dailyTarget' => 50000 // This could be configurable per user
        ];
        
        echo json_encode([
            'success' => true,
            'data' => $stats
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>