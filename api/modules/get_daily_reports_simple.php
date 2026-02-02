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
    $today = date('Y-m-d');
    
    // 1. Sales Summary
    $stmt = $conn->prepare("
        SELECT 
            COUNT(*) as totalSales,
            COALESCE(SUM(total_revenue), 0) as totalRevenue,
            COALESCE(AVG(total_revenue), 0) as averageTransaction,
            COUNT(DISTINCT customer_name) as uniqueCustomers
        FROM sales 
        WHERE DATE(sale_date) = ?
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $salesSummary = $stmt->get_result()->fetch_assoc();
    
    // 2. Top Selling Items
    $stmt = $conn->prepare("
        SELECT 
            name,
            SUM(quantity_sold) as quantity,
            SUM(total_revenue) as revenue
        FROM sales 
        WHERE DATE(sale_date) = ?
        GROUP BY name
        ORDER BY quantity DESC
        LIMIT 5
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $topSellingItems = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $topSellingItems[] = [
            'name' => $row['name'],
            'quantity' => (int)$row['quantity'],
            'revenue' => (float)$row['revenue']
        ];
    }
    
    // 3. Payment Methods (mock data based on notes)
    $paymentMethods = [
        ['method' => 'cash', 'amount' => $salesSummary['totalRevenue'] * 0.6, 'count' => $salesSummary['totalSales'] * 0.6],
        ['method' => 'card', 'amount' => $salesSummary['totalRevenue'] * 0.25, 'count' => $salesSummary['totalSales'] * 0.25],
        ['method' => 'mobile', 'amount' => $salesSummary['totalRevenue'] * 0.15, 'count' => $salesSummary['totalSales'] * 0.15]
    ];
    
    // 4. Hourly Sales (mock data)
    $hourlySales = [];
    for ($hour = 8; $hour <= 18; $hour++) {
        $hourlySales[] = [
            'hour' => $hour,
            'revenue' => rand(500, 2000),
            'transactions' => rand(1, 5)
        ];
    }
    
    $response = [
        'success' => true,
        'data' => [
            'salesSummary' => $salesSummary,
            'topSellingItems' => $topSellingItems,
            'paymentMethods' => $paymentMethods,
            'hourlySales' => $hourlySales
        ],
        'debug' => 'Simple API without authentication'
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>