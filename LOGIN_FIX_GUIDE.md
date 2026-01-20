# 🔐 Login Issue - Quick Fix Guide

## ❌ Error: "Invalid username or password"

This means the database users haven't been created yet or passwords are incorrect.

## ✅ Solution (Follow in Order)

### Step 1: Check if Database Exists (30 seconds)

Visit: **http://localhost/pharmacy-system/api/check_users.php**

You'll see one of these:

#### Scenario A: "Users table does not exist"
```json
{
  "status": "error",
  "message": "Users table does not exist"
}
```
**Fix:** Import the database first (go to Step 2)

#### Scenario B: "No users found"
```json
{
  "status": "warning",
  "message": "No users found in database",
  "users_count": 0
}
```
**Fix:** Create users (go to Step 3)

#### Scenario C: "Users found"
```json
{
  "status": "success",
  "users_count": 3,
  "users": [...]
}
```
**Fix:** Reset passwords (go to Step 3)

---

### Step 2: Import Database (If Needed)

**Option A: Using phpMyAdmin (Easiest)**
1. Open: http://localhost/phpmyadmin
2. Click "Import" tab
3. Click "Choose File"
4. Select: `pharmacy_system_with_auth.sql`
5. Click "Go" button at bottom
6. Wait for success message

**Option B: Using Command Line**
```cmd
cd C:\xampp\htdocs\pharmacy-system
mysql -u root < pharmacy_system_with_auth.sql
```

After import, go to Step 3.

---

### Step 3: Create/Reset Users

**Visit:** http://localhost/pharmacy-system/api/setup_users.php

You should see:
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
  ]
}
```

---

### Step 4: Test Login

**Visit:** http://localhost/pharmacy-system/api/setup.php

Click the "Test Login" button. Should see:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "full_name": "System Administrator",
    "role": "admin"
  }
}
```

---

### Step 5: Login to Frontend

1. Refresh your frontend application
2. Use these credentials:

**Default Accounts:**
- **Admin:** 
  - Username: `admin`
  - Password: `admin123`

- **Pharmacist:**
  - Username: `pharmacist1`
  - Password: `admin123`

- **Cashier:**
  - Username: `cashier1`
  - Password: `admin123`

---

## 🔍 Troubleshooting

### Still Can't Login?

1. **Clear browser cache and localStorage:**
   - Press F12 (Developer Tools)
   - Go to "Application" or "Storage" tab
   - Click "Local Storage"
   - Right-click → Clear
   - Refresh page

2. **Check database connection:**
   - Visit: http://localhost/pharmacy-system/api/test_connection.php
   - Should show: `"database_connection": true`

3. **Verify users exist:**
   - Visit: http://localhost/pharmacy-system/api/check_users.php
   - Should show users list

4. **Reset passwords again:**
   - Visit: http://localhost/pharmacy-system/api/setup_users.php
   - This will update all passwords to `admin123`

5. **Check browser console:**
   - Press F12
   - Go to "Console" tab
   - Look for error messages
   - Check "Network" tab for failed requests

### Common Issues

**Issue:** "CORS error"
- **Fix:** Make sure you're accessing via `http://localhost` not `file://`

**Issue:** "Connection refused"
- **Fix:** Start XAMPP Apache and MySQL services

**Issue:** "Database not found"
- **Fix:** Import `pharmacy_system_with_auth.sql` first

**Issue:** "Wrong password after setup"
- **Fix:** Run setup_users.php again, it will reset all passwords

---

## 📋 Quick Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database `pharmacy_system` exists
- [ ] Table `users` exists
- [ ] Users are created (check_users.php shows users)
- [ ] Passwords are set to `admin123` (run setup_users.php)
- [ ] Frontend is accessed via http://localhost
- [ ] Browser cache is cleared

---

## 🚀 Quick Commands

**Check everything at once:**
1. http://localhost/pharmacy-system/api/check_users.php
2. http://localhost/pharmacy-system/api/setup_users.php
3. http://localhost/pharmacy-system/api/setup.php (click Test Login)
4. Refresh frontend and login with admin/admin123

---

## 📞 Need More Help?

Check these files:
- `SETUP_DATABASE.md` - Database setup instructions
- `LOGIN_TROUBLESHOOTING.md` - Detailed login troubleshooting
- `QUICK_FIX_SUMMARY.md` - Overall system setup

Or check the existing `LOGIN_TROUBLESHOOTING.md` file for more details.
