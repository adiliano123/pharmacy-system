<?php
// QUICK FIX - Run this file once to create users
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: text/html; charset=UTF-8");

require_once 'config/database.php';

echo "<!DOCTYPE html><html><head><title>Quick Fix</title>";
echo "<style>body{font-family:Arial;padding:40px;background:#f5f5f5;}";
echo ".box{background:white;padding:30px;border-radius:10px;max-width:600px;margin:0 auto;box-shadow:0 2px 10px rgba(0,0,0,0.1);}";
echo ".success{color:green;font-size:18px;font-weight:bold;}";
echo ".error{color:red;font-size:18px;font-weight:bold;}";
echo "code{background:#f0f0f0;padding:2px 6px;border-radius:3px;}</style></head><body>";

echo "<div class='box'>";
echo "<h1>🔧 Quick User Fix</h1>";

try {
    // Generate password hash
    $password = 'admin123';
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    echo "<p>Generating password hash for: <code>$password</code></p>";
    echo "<p>Hash: <code>" . substr($hash, 0, 30) . "...</code></p>";
    echo "<hr>";
    
    // Delete existing users
    $conn->query("DELETE FROM users");
    echo "<p>✅ Cleared existing users</p>";
    
    // Insert admin
    $stmt = $conn->prepare("INSERT INTO users (username, password, full_name, email, role, is_active) VALUES (?, ?, ?, ?, ?, 1)");
    
    $username = 'admin';
    $full_name = 'System Administrator';
    $email = 'admin@pharmacy.com';
    $role = 'admin';
    $stmt->bind_param("sssss", $username, $hash, $full_name, $email, $role);
    $stmt->execute();
    echo "<p class='success'>✅ Created user: admin</p>";
    
    // Insert pharmacist
    $username = 'pharmacist1';
    $full_name = 'John Pharmacist';
    $email = 'john@pharmacy.com';
    $role = 'pharmacist';
    $stmt->bind_param("sssss", $username, $hash, $full_name, $email, $role);
    $stmt->execute();
    echo "<p class='success'>✅ Created user: pharmacist1</p>";
    
    // Insert cashier
    $username = 'cashier1';
    $full_name = 'Jane Cashier';
    $email = 'jane@pharmacy.com';
    $role = 'cashier';
    $stmt->bind_param("sssss", $username, $hash, $full_name, $email, $role);
    $stmt->execute();
    echo "<p class='success'>✅ Created user: cashier1</p>";
    
    echo "<hr>";
    echo "<h2 class='success'>✅ SUCCESS!</h2>";
    echo "<p><strong>You can now login with:</strong></p>";
    echo "<ul>";
    echo "<li>Username: <code>admin</code> | Password: <code>admin123</code></li>";
    echo "<li>Username: <code>pharmacist1</code> | Password: <code>admin123</code></li>";
    echo "<li>Username: <code>cashier1</code> | Password: <code>admin123</code></li>";
    echo "</ul>";
    echo "<p><a href='debug_login.php' style='color:blue;'>Click here to verify</a></p>";
    echo "<p><a href='http://localhost:5173' style='color:green;font-weight:bold;'>Go to Login Page</a></p>";
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . $e->getMessage() . "</p>";
    echo "<p>Make sure:</p>";
    echo "<ul>";
    echo "<li>Database 'pharmacy_system' exists</li>";
    echo "<li>Users table exists (run pharmacy_system_with_auth.sql)</li>";
    echo "<li>XAMPP/WAMP is running</li>";
    echo "</ul>";
}

echo "</div></body></html>";
?>
