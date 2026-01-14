# 🔧 Login Troubleshooting Guide

## Quick Fix Steps

### Step 1: Test Database Connection

Visit: `http://localhost/pharmacy-system/api/test_connection.php`

This will show:
- ✅ Database connection status
- ✅ Which tables exist
- ✅ Number of users
- ✅ Sample user data
- ✅ Password hashing test

### Step 2: Setup Users with Correct Password Hashes

Visit: `http://localhost/pharmacy-system/api/setup_users.php`

This will:
- Create/update default users
- Generate proper password hashes
- Show you the credentials

**Expected Output:**
```json
{
  "success": true,
  "users_created": [
    {
      "username": "admin",
      "action": "created",
      "password": "admin123"
    },
    ...
  ],
  "default_password": "admin123"
}
```

### Step 3: Test Login

Now try logging in with:
- Username: `admin`
- Password: `admin123`

## Common Issues & Solutions

### Issue 1: "Invalid username or password"

**Possible Causes:**
1. Users table is empty
2. Password hash is incorrect
3. Username doesn't exist

**Solution:**
```bash
# Run the setup script
Visit: http://localhost/pharmacy-system/api/setup_users.php
```

### Issue 2: "Connection failed"

**Possible Causes:**
1. XAMPP/WAMP not running
2. Wrong database name
3. Database doesn't exist

**Solution:**
```bash
# 1. Start XAMPP/WAMP
# 2. Check database exists
# 3. Verify database name in api/config/database.php
```

### Issue 3: "Table doesn't exist"

**Possible Causes:**
1. SQL file not imported
2. Wrong database selected

**Solution:**
```bash
# Import the SQL file
mysql -u root -p pharmacy_system < pharmacy_system_with_auth.sql

# OR use phpMyAdmin
# 1. Go to http://localhost/phpmyadmin
# 2. Select pharmacy_system database
# 3. Import pharmacy_system_with_auth.sql
```

### Issue 4: CORS Error in Browser

**Possible Causes:**
1. API not accessible
2. Wrong API URL

**Solution:**
Check browser console and verify API URL in:
`frontend/src/services/api.js`

Should be:
```javascript
const API_BASE_URL = 'http://localhost/pharmacy-system/api/modules';
```

### Issue 5: "Session token not found"

**Possible Causes:**
1. user_sessions table doesn't exist
2. Session creation failed

**Solution:**
```bash
# Check if table exists
Visit: http://localhost/pharmacy-system/api/test_connection.php

# If missing, re-import SQL file
```

## Manual Database Check

### Check if users exist:
```sql
SELECT user_id, username, full_name, role, is_active 
FROM users;
```

### Check password hash:
```sql
SELECT username, 
       LEFT(password, 20) as password_preview,
       LENGTH(password) as hash_length
FROM users;
```

**Note:** Password hash should be 60 characters long and start with `$2y$`

### Manually insert a user:
```sql
-- First generate hash using api/generate_hash.php
-- Then insert:
INSERT INTO users (username, password, full_name, email, role, is_active) 
VALUES (
    'testuser',
    '$2y$10$...your_generated_hash_here...',
    'Test User',
    'test@pharmacy.com',
    'pharmacist',
    1
);
```

## Testing Workflow

### 1. Test Database Connection
```bash
curl http://localhost/pharmacy-system/api/test_connection.php
```

### 2. Setup Users
```bash
curl http://localhost/pharmacy-system/api/setup_users.php
```

### 3. Test Login API Directly
```bash
curl -X POST http://localhost/pharmacy-system/api/modules/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "session_token": "abc123...",
  "user": {
    "user_id": 1,
    "username": "admin",
    "full_name": "System Administrator",
    "email": "admin@pharmacy.com",
    "role": "admin",
    "is_active": 1
  }
}
```

### 4. Test Frontend Login
1. Open `http://localhost:5173`
2. Enter credentials
3. Check browser console for errors

## Browser Console Debugging

Open browser console (F12) and check for:

### Network Tab:
- Is the login request being sent?
- What's the response status code?
- What's the response body?

### Console Tab:
- Any JavaScript errors?
- Any CORS errors?
- Any network errors?

## Password Hash Information

### Valid Password Hash Format:
```
$2y$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOP
```

- Starts with `$2y$`
- 60 characters total
- Contains random characters

### Generate New Hash:
```bash
# Method 1: Use the PHP script
php api/generate_hash.php

# Method 2: Use online tool
# Visit: https://bcrypt-generator.com/
# Enter: admin123
# Rounds: 10
```

## Complete Reset Procedure

If nothing works, do a complete reset:

### 1. Drop and recreate database:
```sql
DROP DATABASE IF EXISTS pharmacy_system;
CREATE DATABASE pharmacy_system;
USE pharmacy_system;
```

### 2. Import SQL file:
```bash
mysql -u root -p pharmacy_system < pharmacy_system_with_auth.sql
```

### 3. Setup users:
```bash
Visit: http://localhost/pharmacy-system/api/setup_users.php
```

### 4. Test connection:
```bash
Visit: http://localhost/pharmacy-system/api/test_connection.php
```

### 5. Try login again

## Verification Checklist

Before attempting login, verify:

- [ ] XAMPP/WAMP is running
- [ ] MySQL service is active
- [ ] Database `pharmacy_system` exists
- [ ] All tables are created (users, inventory, sales, user_sessions, activity_log)
- [ ] Users table has at least one user
- [ ] Password hash is 60 characters and starts with `$2y$`
- [ ] User `is_active` = 1
- [ ] Frontend is running on `http://localhost:5173`
- [ ] API is accessible at `http://localhost/pharmacy-system/api/`
- [ ] No CORS errors in browser console

## Still Not Working?

### Check PHP Error Log:
- XAMPP: `C:\xampp\apache\logs\error.log`
- WAMP: `C:\wamp64\logs\php_error.log`

### Enable Error Display:
Add to `api/modules/login.php` at the top:
```php
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

### Check MySQL Error Log:
- XAMPP: `C:\xampp\mysql\data\mysql_error.log`

## Contact Information

If you've tried everything and it still doesn't work:

1. Check `api/test_connection.php` output
2. Check browser console errors
3. Check PHP error logs
4. Verify database structure matches SQL file

---

**Most Common Solution:** Run `http://localhost/pharmacy-system/api/setup_users.php` to create users with proper password hashes!
