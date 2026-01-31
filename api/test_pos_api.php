<?php
// Simple test script to verify POS API functionality
header("Content-Type: application/json");

echo "<h2>Testing Point of Sale API</h2>";

// Test 1: Check inventory API
echo "<h3>1. Testing Inventory API</h3>";
$inventory_url = "http://localhost/pharmacy-system/api/modules/get_inventory.php";
$inventory_response = file_get_contents($inventory_url);

if ($inventory_response) {
    $inventory_data = json_decode($inventory_response, true);
    if (is_array($inventory_data) && count($inventory_data) > 0) {
        echo "<p style='color: green;'>✅ Inventory API working - Found " . count($inventory_data) . " items</p>";
        echo "<pre>" . json_encode(array_slice($inventory_data, 0, 2), JSON_PRETTY_PRINT) . "</pre>";
    } else {
        echo "<p style='color: orange;'>⚠️ Inventory API returns empty or invalid data</p>";
        echo "<pre>" . htmlspecialchars($inventory_response) . "</pre>";
    }
} else {
    echo "<p style='color: red;'>❌ Failed to connect to inventory API</p>";
}

// Test 2: Check database connection
echo "<h3>2. Testing Database Connection</h3>";
try {
    require_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "<p style='color: green;'>✅ Database connection successful</p>";
        
        // Check if inventory table exists and has data
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM inventory");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<p>Inventory table has " . $result['count'] . " items</p>";
        
        // Check if sales table exists
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM sales");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<p>Sales table has " . $result['count'] . " records</p>";
        
    } else {
        echo "<p style='color: red;'>❌ Database connection failed</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database error: " . $e->getMessage() . "</p>";
}

echo "<h3>3. API Endpoints Status</h3>";
echo "<ul>";
echo "<li>GET /api/modules/get_inventory.php - Fetch inventory</li>";
echo "<li>POST /api/modules/process_sale.php - Process POS sale</li>";
echo "</ul>";

echo "<p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Make sure XAMPP/WAMP is running</li>";
echo "<li>Ensure database is set up with inventory data</li>";
echo "<li>Test the Point of Sale component in the frontend</li>";
echo "</ol>";
?>