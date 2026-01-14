<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login Debug</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
        pre { background: #f0f0f0; padding: 10px; border-radius: 4px; overflow-x: auto; }
        h2 { color: #2d3748; }
    </style>
</head>
<body>
    <h1>🔍 Login Debug Tool</h1>

    <?php
    require_once 'config/database.php';

    // Test 1: Database Connection
    echo '<div class="section">';
    echo '<h2>1. Database Connection</h2>';
    if ($conn->ping()) {
        echo '<p class="success">✅ Connected to database: ' . $db_name . '</p>';
    } else {
        echo '<p class="error">❌ Database connection failed</p>';
        exit;
    }
    echo '</div>';

    // Test 2: Check if users table exists
    echo '<div class="section">';
    echo '<h2>2. Users Table</h2>';
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->num_rows > 0) {
        echo '<p class="success">✅ Users table exists</p>';
        
        // Count users
        $result = $conn->query("SELECT COUNT(*) as count FROM users");
        $row = $result->fetch_assoc();
        echo '<p class="info">📊 Total users: ' . $row['count'] . '</p>';
        
        // Show users
        $result = $conn->query("SELECT user_id, username, full_name, role, is_active, LEFT(password, 30) as pwd_preview, LENGTH(password) as pwd_length FROM users");
        if ($result->num_rows > 0) {
            echo '<table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">';
            echo '<tr><th>ID</th><th>Username</th><th>Full Name</th><th>Role</th><th>Active</th><th>Password Preview</th><th>Hash Length</th></tr>';
            while ($user = $result->fetch_assoc()) {
                $activeStatus = $user['is_active'] ? '✅' : '❌';
                $hashValid = ($user['pwd_length'] == 60 && strpos($user['pwd_preview'], '$2y$') === 0) ? '✅' : '❌';
                echo '<tr>';
                echo '<td>' . $user['user_id'] . '</td>';
                echo '<td><strong>' . $user['username'] . '</strong></td>';
                echo '<td>' . $user['full_name'] . '</td>';
                echo '<td>' . $user['role'] . '</td>';
                echo '<td>' . $activeStatus . '</td>';
                echo '<td><code>' . $user['pwd_preview'] . '...</code></td>';
                echo '<td>' . $user['pwd_length'] . ' ' . $hashValid . '</td>';
                echo '</tr>';
            }
            echo '</table>';
        }
    } else {
        echo '<p class="error">❌ Users table does not exist!</p>';
        echo '<p>Run the SQL file first: pharmacy_system_with_auth.sql</p>';
        exit;
    }
    echo '</div>';

    // Test 3: Password Hash Test
    echo '<div class="section">';
    echo '<h2>3. Password Hash Test</h2>';
    $test_password = 'admin123';
    $test_hash = password_hash($test_password, PASSWORD_DEFAULT);
    $verify = password_verify($test_password, $test_hash);
    
    echo '<p class="info">Test Password: <code>' . $test_password . '</code></p>';
    echo '<p class="info">Generated Hash: <code>' . substr($test_hash, 0, 40) . '...</code></p>';
    echo '<p class="info">Hash Length: ' . strlen($test_hash) . '</p>';
    echo '<p class="' . ($verify ? 'success' : 'error') . '">Verification: ' . ($verify ? '✅ PASS' : '❌ FAIL') . '</p>';
    echo '</div>';

    // Test 4: Try to login with admin
    echo '<div class="section">';
    echo '<h2>4. Test Login with "admin" / "admin123"</h2>';
    
    $stmt = $conn->prepare("SELECT user_id, username, password, full_name, role, is_active FROM users WHERE username = ?");
    $username = 'admin';
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo '<p class="error">❌ User "admin" not found in database</p>';
        echo '<p><strong>Solution:</strong> Run <a href="setup_users.php">setup_users.php</a> to create users</p>';
    } else {
        $user = $result->fetch_assoc();
        echo '<p class="success">✅ User "admin" found</p>';
        echo '<p class="info">Full Name: ' . $user['full_name'] . '</p>';
        echo '<p class="info">Role: ' . $user['role'] . '</p>';
        echo '<p class="info">Active: ' . ($user['is_active'] ? 'Yes ✅' : 'No ❌') . '</p>';
        echo '<p class="info">Password Hash: <code>' . substr($user['password'], 0, 40) . '...</code></p>';
        
        // Try to verify password
        $password = 'admin123';
        $verify_result = password_verify($password, $user['password']);
        
        if ($verify_result) {
            echo '<p class="success">✅ Password verification SUCCESSFUL!</p>';
            echo '<p class="success"><strong>Login should work!</strong></p>';
        } else {
            echo '<p class="error">❌ Password verification FAILED!</p>';
            echo '<p class="error"><strong>The password hash in the database is incorrect.</strong></p>';
            echo '<p><strong>Solution:</strong> Run <a href="setup_users.php" style="color: blue; font-weight: bold;">setup_users.php</a> to fix password hashes</p>';
        }
    }
    echo '</div>';

    // Test 5: Check other required tables
    echo '<div class="section">';
    echo '<h2>5. Other Required Tables</h2>';
    $tables = ['inventory', 'sales', 'user_sessions', 'activity_log'];
    foreach ($tables as $table) {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        if ($result->num_rows > 0) {
            echo '<p class="success">✅ ' . $table . '</p>';
        } else {
            echo '<p class="error">❌ ' . $table . ' (missing)</p>';
        }
    }
    echo '</div>';

    // Test 6: Quick Fix Button
    echo '<div class="section">';
    echo '<h2>6. Quick Fix</h2>';
    echo '<p>If password verification failed above, click this button to create/update users with correct password hashes:</p>';
    echo '<form method="POST" action="setup_users.php" target="_blank">';
    echo '<button type="submit" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">🔧 Fix Users & Passwords</button>';
    echo '</form>';
    echo '</div>';
    ?>

    <div class="section">
        <h2>📝 Summary</h2>
        <p>If you see "Password verification SUCCESSFUL" above, your login should work.</p>
        <p>If you see "Password verification FAILED", click the "Fix Users & Passwords" button above.</p>
        <p>After fixing, try logging in again with:</p>
        <ul>
            <li><strong>Username:</strong> admin</li>
            <li><strong>Password:</strong> admin123</li>
        </ul>
    </div>
</body>
</html>
