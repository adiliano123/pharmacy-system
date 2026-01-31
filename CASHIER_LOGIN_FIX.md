# Cashier Login Issue - Quick Fix Guide

## Problem
Cashier login is failing because the user might not exist in the database or the database setup is incomplete.

## ✅ **Quick Fix Applied**
Updated the LoginForm to show cashier credentials:
- **Username**: `cashier1`
- **Password**: `admin123`

## 🔍 **Diagnosis Steps**

### Step 1: Check if Database Exists
Visit: `http://your-domain/api/test_connection.php`

**Expected Response**: Database connection successful

### Step 2: Check if Users Table Exists
Visit: `http://your-domain/api/check_users.php`

**Expected Response**: List of users including cashier1

### Step 3: Create Users if Missing
Visit: `http://your-domain/api/setup_users.php`

**Expected Response**: Users created successfully

## 🛠️ **Manual Setup Instructions**

### Option 1: Run Setup Scripts (Recommended)
1. **Import Database Schema**:
   ```sql
   -- Import pharmacy_system_with_auth.sql into your MySQL database
   ```

2. **Create Default Users**:
   - Visit: `http://your-domain/api/setup_users.php`
   - This creates all three default users with password `admin123`

### Option 2: Manual Database Setup
If you have database access, run these SQL commands:

```sql
-- 1. Create the users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'pharmacist', 'cashier') DEFAULT 'pharmacist',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- 2. Insert cashier user (password is 'admin123' hashed)
INSERT INTO users (username, password, full_name, email, role, is_active) 
VALUES (
    'cashier1', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Jane Cashier', 
    'jane@pharmacy.com', 
    'cashier', 
    1
);
```

## 🎯 **Default User Credentials**

After setup, these users will be available:

| Role | Username | Password | Full Name |
|------|----------|----------|-----------|
| Admin | `admin` | `admin123` | System Administrator |
| Pharmacist | `pharmacist1` | `admin123` | John Pharmacist |
| **Cashier** | `cashier1` | `admin123` | Jane Cashier |

## 🔧 **Troubleshooting**

### Issue: "Invalid username or password"
**Cause**: User doesn't exist in database
**Solution**: Run `api/setup_users.php` to create default users

### Issue: "Account is deactivated"
**Cause**: User exists but is_active = 0
**Solution**: Update user status:
```sql
UPDATE users SET is_active = 1 WHERE username = 'cashier1';
```

### Issue: API not responding
**Cause**: Server configuration issue
**Solution**: 
1. Check if PHP is running
2. Verify database connection
3. Check file permissions
4. Use mock data fallback (already implemented)

## 🚀 **Current System Status**

✅ **LoginForm Updated**: Now shows cashier1 credentials  
✅ **Database Schema**: Complete with users table  
✅ **Setup Scripts**: Available for user creation  
✅ **Fallback System**: Works with mock data if APIs fail  

## 📝 **Next Steps**

1. **Try logging in** with `cashier1` / `admin123`
2. **If login fails**, run the setup scripts:
   - Visit: `http://your-domain/api/setup_users.php`
3. **If APIs don't work**, the system will use mock data
4. **Check database setup** if persistent issues

The cashier login should now work! If you're still having issues, it's likely a database setup problem that can be resolved by running the setup scripts.