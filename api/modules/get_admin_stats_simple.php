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
    $currentMonth = date('Y-m');
    $today = date('Y-m-d');
    
    // 1. User Statistics
    $stmt = $conn->prepare("SELECT COUNT(*) as totalUsers FROM users");
    $stmt->execute();
    $totalUsers = $stmt->get_result()->fetch_assoc()['totalUsers'];
    
    $stmt = $conn->prepare("SELECT COUNT(*) as activeUsers FROM users WHERE is_active = 1");
    $stmt->execute();
    $activeUsers = $stmt->get_result()->fetch_assoc()['activeUsers'];
    
    // 2. Monthly Revenue
    $stmt = $conn->prepare("
        SELECT COALESCE(SUM(total_revenue), 0) as monthlyRevenue 
        FROM sales 
        WHERE DATE_FORMAT(sale_date, '%Y-%m') = ?
    ");
    $stmt->bind_param("s", $currentMonth);
    $stmt->execute();
    $monthlyRevenue = $stmt->get_result()->fetch_assoc()['monthlyRevenue'];
    
    // 3. Inventory Value
    $stmt = $conn->prepare("
        SELECT COALESCE(SUM(quantity * price), 0) as inventoryValue 
        FROM inventory 
        WHERE quantity > 0
    ");
    $stmt->execute();
    $inventoryValue = $stmt->get_result()->fetch_assoc()['inventoryValue'];
    
    // 4. Low Stock Alerts
    $stmt = $conn->prepare("
        SELECT COUNT(*) as lowStockAlerts 
        FROM inventory 
        WHERE quantity <= 10 AND quantity > 0
    ");
    $stmt->execute();
    $lowStockAlerts = $stmt->get_result()->fetch_assoc()['lowStockAlerts'];
    
    // 5. Today's Activity
    $stmt = $conn->prepare("
        SELECT COUNT(*) as todayTransactions 
        FROM sales 
        WHERE DATE(sale_date) = ?
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $todayTransactions = $stmt->get_result()->fetch_assoc()['todayTransactions'];
    
    // 6. System Health Metrics
    $stmt = $conn->prepare("SELECT COUNT(*) as totalInventoryItems FROM inventory");
    $stmt->execute();
    $totalInventoryItems = $stmt->get_result()->fetch_assoc()['totalInventoryItems'];
    
    $stmt = $conn->prepare("
        SELECT COUNT(*) as expiringSoon 
        FROM inventory 
        WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
        AND quantity > 0
    ");
    $stmt->execute();
    $expiringSoon = $stmt->get_result()->fetch_assoc()['expiringSoon'];
    
    // 7. User Role Distribution
    $stmt = $conn->prepare("
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $userRoles = [];
    while ($row = $result->fetch_assoc()) {
        $userRoles[$row['role']] = (int)$row['count'];
    }
    
    // 8. Recent Activity Summary
    $stmt = $conn->prepare("
        SELECT 
            COUNT(*) as totalSales,
            COALESCE(SUM(total_revenue), 0) as totalRevenue,
            COUNT(DISTINCT sold_by) as activeCashiers
        FROM sales 
        WHERE DATE(sale_date) = ?
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $todayActivity = $stmt->get_result()->fetch_assoc();
    
    $stats = [
        'totalUsers' => (int)$totalUsers,
        'activeUsers' => (int)$activeUsers,
        'monthlyRevenue' => (float)$monthlyRevenue,
        'inventoryValue' => (float)$inventoryValue,
        'lowStockAlerts' => (int)$lowStockAlerts,
        'todayTransactions' => (int)$todayTransactions,
        'totalInventoryItems' => (int)$totalInventoryItems,
        'expiringSoon' => (int)$expiringSoon,
        'userRoles' => $userRoles,
        'systemHealth' => [
            'database' => 'healthy',
            'inventory' => $lowStockAlerts > 0 ? 'warning' : 'healthy',
            'expiry' => $expiringSoon > 0 ? 'warning' : 'healthy'
        ],
        'todayActivity' => [
            'totalSales' => (int)$todayActivity['totalSales'],
            'totalRevenue' => (float)$todayActivity['totalRevenue'],
            'activeCashiers' => (int)$todayActivity['activeCashiers']
        ]
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $stats,
        'debug' => 'Simple Admin API without authentication'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>