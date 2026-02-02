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

try {
    // Get today's date
    $today = date('Y-m-d');
    
    // 1. Today's sales (all cashiers for now)
    $stmt = $conn->prepare("
        SELECT 
            COUNT(*) as todayTransactions,
            COALESCE(SUM(total_revenue), 0) as todaySales,
            COALESCE(AVG(total_revenue), 0) as averageTransaction
        FROM sales 
        WHERE DATE(sale_date) = ?
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $salesResult = $stmt->get_result()->fetch_assoc();
    
    // 2. Count unique customers today
    $stmt = $conn->prepare("
        SELECT COUNT(DISTINCT customer_name) as todayCustomers
        FROM sales 
        WHERE DATE(sale_date) = ? AND customer_name IS NOT NULL AND customer_name != ''
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $customerResult = $stmt->get_result()->fetch_assoc();
    
    // 3. Top selling item today
    $stmt = $conn->prepare("
        SELECT name, SUM(quantity_sold) as total_quantity
        FROM sales 
        WHERE DATE(sale_date) = ?
        GROUP BY name
        ORDER BY total_quantity DESC
        LIMIT 1
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $topItemResult = $stmt->get_result()->fetch_assoc();
    
    // 4. Cash sales today
    $stmt = $conn->prepare("
        SELECT COALESCE(SUM(total_revenue), 0) as cashInHand
        FROM sales 
        WHERE DATE(sale_date) = ? AND notes LIKE '%cash%'
    ");
    $stmt->bind_param("s", $today);
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
        'pendingPayments' => 0,
        'dailyTarget' => 50000
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $stats,
        'debug' => 'Simple API without authentication'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>