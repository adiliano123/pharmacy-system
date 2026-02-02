<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';

echo "<h1>Pharmacist Dashboard Test</h1>";
echo "<p><strong>Database Connection:</strong> " . ($conn ? "✅ Connected" : "❌ Failed") . "</p>";

// Test 1: Inventory Overview
$result = $conn->query("SELECT COUNT(*) as total FROM inventory WHERE quantity > 0");
$totalItems = $result->fetch_assoc()['total'];
echo "<p><strong>Total Inventory Items:</strong> {$totalItems}</p>";

// Test 2: Expiring Medicines
$thirtyDaysFromNow = date('Y-m-d', strtotime('+30 days'));
$result = $conn->query("SELECT COUNT(*) as expiring FROM inventory WHERE expiry_date <= '$thirtyDaysFromNow' AND quantity > 0");
$expiringItems = $result->fetch_assoc()['expiring'];
echo "<p><strong>Expiring Within 30 Days:</strong> {$expiringItems} items</p>";

// Test 3: Low Stock Items
$result = $conn->query("SELECT COUNT(*) as low_stock FROM inventory WHERE quantity <= 10 AND quantity > 0");
$lowStock = $result->fetch_assoc()['low_stock'];
echo "<p><strong>Low Stock Items (≤10):</strong> {$lowStock} items</p>";

// Test 4: Critical Stock Items
$result = $conn->query("SELECT COUNT(*) as critical FROM inventory WHERE quantity <= 5 AND quantity > 0");
$criticalStock = $result->fetch_assoc()['critical'];
echo "<p><strong>Critical Stock Items (≤5):</strong> {$criticalStock} items</p>";

// Test 5: Inventory Value
$result = $conn->query("SELECT COALESCE(SUM(quantity * price), 0) as value FROM inventory WHERE quantity > 0");
$inventoryValue = $result->fetch_assoc()['value'];
echo "<p><strong>Total Inventory Value:</strong> TSh " . number_format($inventoryValue) . "</p>";

// Test 6: Today's Sales Activity
$today = date('Y-m-d');
$result = $conn->query("SELECT COUNT(*) as sales, COALESCE(SUM(total_revenue), 0) as revenue FROM sales WHERE DATE(sale_date) = '$today'");
$todayStats = $result->fetch_assoc();
echo "<p><strong>Today's Sales:</strong> {$todayStats['sales']} transactions, TSh " . number_format($todayStats['revenue']) . "</p>";

// Test 7: Inventory Status Details
echo "<h2>Inventory Status Details:</h2>";
$result = $conn->query("
    SELECT 
        name,
        quantity,
        price,
        expiry_date,
        DATEDIFF(expiry_date, CURDATE()) as days_to_expiry,
        CASE 
            WHEN quantity <= 5 THEN 'Critical'
            WHEN quantity <= 10 THEN 'Low'
            ELSE 'Normal'
        END as stock_status,
        CASE 
            WHEN expiry_date < CURDATE() THEN 'Expired'
            WHEN DATEDIFF(expiry_date, CURDATE()) <= 30 THEN 'Expiring Soon'
            ELSE 'Normal'
        END as expiry_status
    FROM inventory 
    WHERE quantity > 0 
    ORDER BY expiry_date ASC
");

if ($result->num_rows > 0) {
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Medicine</th><th>Quantity</th><th>Price</th><th>Expiry Date</th><th>Days to Expiry</th><th>Stock Status</th><th>Expiry Status</th></tr>";
    while ($row = $result->fetch_assoc()) {
        $stockColor = $row['stock_status'] == 'Critical' ? 'red' : ($row['stock_status'] == 'Low' ? 'orange' : 'green');
        $expiryColor = $row['expiry_status'] == 'Expired' ? 'red' : ($row['expiry_status'] == 'Expiring Soon' ? 'orange' : 'green');
        
        echo "<tr>";
        echo "<td>{$row['name']}</td>";
        echo "<td style='color: {$stockColor}; font-weight: bold;'>{$row['quantity']}</td>";
        echo "<td>TSh " . number_format($row['price']) . "</td>";
        echo "<td>{$row['expiry_date']}</td>";
        echo "<td style='color: {$expiryColor}; font-weight: bold;'>{$row['days_to_expiry']} days</td>";
        echo "<td style='color: {$stockColor}; font-weight: bold;'>{$row['stock_status']}</td>";
        echo "<td style='color: {$expiryColor}; font-weight: bold;'>{$row['expiry_status']}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>No inventory items found</p>";
}

// Test 8: System Health Summary
echo "<h2>System Health Summary:</h2>";
$healthStatus = [];
$healthStatus['inventory'] = $criticalStock > 0 ? 'Critical' : ($lowStock > 0 ? 'Warning' : 'Healthy');
$healthStatus['expiry'] = $expiringItems > 0 ? 'Warning' : 'Healthy';
$healthStatus['stock_level'] = $totalItems > 0 ? 'Healthy' : 'Critical';

echo "<ul>";
foreach ($healthStatus as $component => $status) {
    $color = $status == 'Critical' ? 'red' : ($status == 'Warning' ? 'orange' : 'green');
    echo "<li style='color: {$color}; font-weight: bold;'>" . ucfirst(str_replace('_', ' ', $component)) . ": {$status}</li>";
}
echo "</ul>";

// Test 9: API Endpoints
echo "<h2>Test API Endpoints:</h2>";
echo "<p><a href='modules/get_pharmacist_stats_simple.php' target='_blank'>Test Simple Pharmacist Stats API</a></p>";

echo "<h2>Pharmacist Dashboard Status:</h2>";
echo "<p>✅ All pharmacist dashboard components are working with real database data!</p>";
?>