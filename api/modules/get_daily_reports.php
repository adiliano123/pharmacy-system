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
        $today = date('Y-m-d');
        
        // 1. Sales Summary
        $stmt = $conn->prepare("
            SELECT 
                COUNT(*) as totalSales,
                COALESCE(SUM(total_revenue), 0) as totalRevenue,
                COALESCE(AVG(total_revenue), 0) as averageTransaction,
                COUNT(DISTINCT customer_name) as uniqueCustomers
            FROM sales 
            WHERE sold_by = ? AND DATE(sale_date) = ?
        ");
        $stmt->bind_param("is", $user_id, $today);
        $stmt->execute();
        $salesSummary = $stmt->get_result()->fetch_assoc();
        
        // 2. Payment Methods Breakdown
        $paymentMethods = [];
        $methods = ['cash', 'card', 'mobile', 'insurance'];
        
        foreach ($methods as $method) {
            $stmt = $conn->prepare("
                SELECT 
                    COUNT(*) as count,
                    COALESCE(SUM(total_revenue), 0) as amount
                FROM sales 
                WHERE sold_by = ? AND DATE(sale_date) = ? AND LOWER(notes) LIKE ?
            ");
            $searchTerm = "%$method%";
            $stmt->bind_param("iss", $user_id, $today, $searchTerm);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            
            $paymentMethods[] = [
                'method' => ucfirst($method),
                'count' => (int)$result['count'],
                'amount' => (float)$result['amount']
            ];
        }
        
        // 3. Top Selling Items
        $stmt = $conn->prepare("
            SELECT 
                name,
                SUM(quantity_sold) as totalQuantity,
                SUM(total_revenue) as totalRevenue,
                COUNT(*) as transactionCount
            FROM sales 
            WHERE sold_by = ? AND DATE(sale_date) = ?
            GROUP BY name
            ORDER BY totalQuantity DESC
            LIMIT 5
        ");
        $stmt->bind_param("is", $user_id, $today);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $topItems = [];
        while ($row = $result->fetch_assoc()) {
            $topItems[] = [
                'name' => $row['name'],
                'quantity' => (int)$row['totalQuantity'],
                'revenue' => (float)$row['totalRevenue'],
                'transactions' => (int)$row['transactionCount']
            ];
        }
        
        // 4. Hourly Sales Distribution
        $stmt = $conn->prepare("
            SELECT 
                HOUR(sale_date) as hour,
                COUNT(*) as transactions,
                SUM(total_revenue) as revenue
            FROM sales 
            WHERE sold_by = ? AND DATE(sale_date) = ?
            GROUP BY HOUR(sale_date)
            ORDER BY hour
        ");
        $stmt->bind_param("is", $user_id, $today);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $hourlySales = [];
        while ($row = $result->fetch_assoc()) {
            $hourlySales[] = [
                'hour' => (int)$row['hour'],
                'transactions' => (int)$row['transactions'],
                'revenue' => (float)$row['revenue']
            ];
        }
        
        // 5. Performance Metrics
        $dailyTarget = 50000; // This could be configurable
        $targetProgress = ($salesSummary['totalRevenue'] / $dailyTarget) * 100;
        
        $reportData = [
            'salesSummary' => [
                'totalSales' => (int)$salesSummary['totalSales'],
                'totalRevenue' => (float)$salesSummary['totalRevenue'],
                'averageTransaction' => (float)$salesSummary['averageTransaction'],
                'uniqueCustomers' => (int)$salesSummary['uniqueCustomers'],
                'dailyTarget' => $dailyTarget,
                'targetProgress' => min($targetProgress, 100)
            ],
            'paymentMethods' => $paymentMethods,
            'topSellingItems' => $topItems,
            'hourlySales' => $hourlySales,
            'reportDate' => $today,
            'cashierName' => $session['full_name'] ?? 'Unknown'
        ];
        
        echo json_encode([
            'success' => true,
            'data' => $reportData
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