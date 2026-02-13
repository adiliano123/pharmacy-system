<?php
// Start output buffering to prevent any accidental output
ob_start();

// Suppress all errors from being displayed
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

require_once '../config/database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'list':
            if ($method === 'GET') {
                listUsers($db);
            }
            break;
            
        case 'create':
            if ($method === 'POST') {
                createUser($db);
            }
            break;
            
        case 'update':
            if ($method === 'POST' || $method === 'PUT') {
                updateUser($db);
            }
            break;
            
        case 'delete':
            if ($method === 'POST' || $method === 'DELETE') {
                deleteUser($db);
            }
            break;
            
        case 'toggle_status':
            if ($method === 'POST') {
                toggleUserStatus($db);
            }
            break;
            
        case 'stats':
            if ($method === 'GET') {
                getUserStats($db);
            }
            break;
            
        default:
            throw new Exception('Invalid action specified');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function listUsers($db) {
    try {
        $query = "SELECT user_id, username, full_name, email, role, is_active, created_at, last_login 
                  FROM users 
                  ORDER BY created_at DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'users' => $users
        ]);
    } catch (Exception $e) {
        throw new Exception('Error fetching users: ' . $e->getMessage());
    }
}

function createUser($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $input = $_POST;
        }
        
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';
        $full_name = trim($input['full_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $role = $input['role'] ?? 'cashier';
        $is_active = isset($input['is_active']) ? (bool)$input['is_active'] : true;
        
        // Validation
        if (empty($username) || empty($password) || empty($full_name)) {
            throw new Exception('Username, password, and full name are required');
        }
        
        if (strlen($password) < 6) {
            throw new Exception('Password must be at least 6 characters long');
        }
        
        if (!in_array($role, ['admin', 'pharmacist', 'cashier'])) {
            throw new Exception('Invalid role specified');
        }
        
        // Check if username already exists
        $checkQuery = "SELECT user_id FROM users WHERE username = ?";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->execute([$username]);
        
        if ($checkStmt->fetch()) {
            throw new Exception('Username already exists');
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $query = "INSERT INTO users (username, password, full_name, email, role, is_active, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->execute([
            $username,
            $hashedPassword,
            $full_name,
            $email,
            $role,
            $is_active ? 1 : 0
        ]);
        
        $userId = $db->lastInsertId();
        
        // Log the action
        logAuditAction($db, 'CREATE_USER', 'User Management', "Created new user: $username", [
            'new_user_id' => $userId,
            'role' => $role
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'User created successfully',
            'user_id' => $userId
        ]);
    } catch (Exception $e) {
        throw new Exception('Error creating user: ' . $e->getMessage());
    }
}

function updateUser($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $input = $_POST;
        }
        
        $user_id = $input['user_id'] ?? 0;
        $full_name = trim($input['full_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $role = $input['role'] ?? '';
        $is_active = isset($input['is_active']) ? (bool)$input['is_active'] : true;
        $password = $input['password'] ?? '';
        
        if (!$user_id || empty($full_name)) {
            throw new Exception('User ID and full name are required');
        }
        
        if (!in_array($role, ['admin', 'pharmacist', 'cashier'])) {
            throw new Exception('Invalid role specified');
        }
        
        // Build update query
        $updateFields = ['full_name = ?', 'email = ?', 'role = ?', 'is_active = ?'];
        $params = [$full_name, $email, $role, $is_active ? 1 : 0];
        
        // Add password if provided
        if (!empty($password)) {
            if (strlen($password) < 6) {
                throw new Exception('Password must be at least 6 characters long');
            }
            $updateFields[] = 'password = ?';
            $params[] = password_hash($password, PASSWORD_DEFAULT);
        }
        
        $params[] = $user_id;
        
        $query = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE user_id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        
        // Log the action
        logAuditAction($db, 'UPDATE_USER', 'User Management', "Updated user ID: $user_id", [
            'user_id' => $user_id,
            'role' => $role
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'User updated successfully'
        ]);
    } catch (Exception $e) {
        throw new Exception('Error updating user: ' . $e->getMessage());
    }
}

function deleteUser($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $input = $_POST;
        }
        
        $user_id = $input['user_id'] ?? 0;
        
        if (!$user_id) {
            throw new Exception('User ID is required');
        }
        
        // Get user info before deletion
        $userQuery = "SELECT username FROM users WHERE user_id = ?";
        $userStmt = $db->prepare($userQuery);
        $userStmt->execute([$user_id]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            throw new Exception('User not found');
        }
        
        // Delete user
        $query = "DELETE FROM users WHERE user_id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$user_id]);
        
        // Log the action
        logAuditAction($db, 'DELETE_USER', 'User Management', "Deleted user: " . $user['username'], [
            'deleted_user_id' => $user_id
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    } catch (Exception $e) {
        throw new Exception('Error deleting user: ' . $e->getMessage());
    }
}

function toggleUserStatus($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $input = $_POST;
        }
        
        $user_id = $input['user_id'] ?? 0;
        
        if (!$user_id) {
            throw new Exception('User ID is required');
        }
        
        // Get current status
        $statusQuery = "SELECT username, is_active FROM users WHERE user_id = ?";
        $statusStmt = $db->prepare($statusQuery);
        $statusStmt->execute([$user_id]);
        $user = $statusStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            throw new Exception('User not found');
        }
        
        $newStatus = !$user['is_active'];
        
        // Update status
        $query = "UPDATE users SET is_active = ? WHERE user_id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$newStatus ? 1 : 0, $user_id]);
        
        // Log the action
        $action = $newStatus ? 'ACTIVATE_USER' : 'DEACTIVATE_USER';
        $description = ($newStatus ? 'Activated' : 'Deactivated') . " user: " . $user['username'];
        
        logAuditAction($db, $action, 'User Management', $description, [
            'user_id' => $user_id,
            'new_status' => $newStatus
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'User status updated successfully',
            'new_status' => $newStatus
        ]);
    } catch (Exception $e) {
        throw new Exception('Error updating user status: ' . $e->getMessage());
    }
}

function getUserStats($db) {
    try {
        // Get user counts by role
        $roleQuery = "SELECT role, COUNT(*) as count FROM users GROUP BY role";
        $roleStmt = $db->prepare($roleQuery);
        $roleStmt->execute();
        $roleCounts = $roleStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get active user count
        $activeQuery = "SELECT COUNT(*) as count FROM users WHERE is_active = 1";
        $activeStmt = $db->prepare($activeQuery);
        $activeStmt->execute();
        $activeCount = $activeStmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get total user count
        $totalQuery = "SELECT COUNT(*) as count FROM users";
        $totalStmt = $db->prepare($totalQuery);
        $totalStmt->execute();
        $totalCount = $totalStmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        echo json_encode([
            'success' => true,
            'stats' => [
                'total_users' => $totalCount,
                'active_users' => $activeCount,
                'role_counts' => $roleCounts
            ]
        ]);
    } catch (Exception $e) {
        throw new Exception('Error fetching user stats: ' . $e->getMessage());
    }
}

function logAuditAction($db, $action, $module, $description, $details = []) {
    try {
        // In a real implementation, you would get the current user from session
        $currentUser = 'admin'; // This should come from session
        
        $query = "INSERT INTO audit_logs (user, action, module, description, details, ip_address, user_agent, timestamp) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->execute([
            $currentUser,
            $action,
            $module,
            $description,
            json_encode($details),
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
    } catch (Exception $e) {
        // Log audit errors but don't fail the main operation
        error_log('Audit log error: ' . $e->getMessage());
    }
}
?>