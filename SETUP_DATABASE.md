# Database Setup Instructions - QUICK FIX

## ⚠️ The Problem
Error: `Table 'pharmacy_system.medicines' doesn't exist`

The database tables haven't been created yet.

## ✅ SOLUTION (Choose ONE method)

### Method 1: Automated Setup (EASIEST) ⭐

1. **Import the SQL file using phpMyAdmin:**
   - Open: http://localhost/phpmyadmin
   - Click "Import" tab
   - Choose file: `pharmacy_system_with_auth.sql`
   - Click "Go"

2. **Run the setup wizard:**
   - Open: http://localhost/pharmacy-system/api/setup.php
   - Click "Test Connection"
   - Click "Setup Users"
   - Click "Test Login"

3. **Done!** Now refresh your frontend and try adding stock again.

### Method 2: Command Line

```cmd
cd C:\xampp\htdocs\pharmacy-system
mysql -u root < pharmacy_system_with_auth.sql
```

Then visit: http://localhost/pharmacy-system/api/setup_users.php

### Method 3: Manual SQL Execution

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "SQL" tab
3. Copy and paste the entire content of `pharmacy_system_with_auth.sql`
4. Click "Go"
5. Visit: http://localhost/pharmacy-system/api/setup_users.php

## 🔍 Verify Setup

Visit: http://localhost/pharmacy-system/api/verify_database.php

Should show:
```json
{
  "status": "success",
  "tables": {
    "users": true,
    "inventory": true,
    "sales": true,
    "user_sessions": true
  }
}
```

## 🔑 Default Login Credentials

After setup:
- **Admin:** `admin` / `admin123`
- **Pharmacist:** `pharmacist1` / `admin123`
- **Cashier:** `cashier1` / `admin123`

## 📊 Database Structure

The `pharmacy_system` database contains:
- `users` - Employee accounts with authentication
- `inventory` - Medicine stock (name, batch, quantity, price all in one table)
- `sales` - Sales transactions with employee tracking
- `user_sessions` - Active login sessions
- `activity_log` - Audit trail

## ⚡ After Setup

1. Refresh your frontend application
2. Login with admin credentials
3. Go to Inventory tab
4. Try adding stock - it should work now!
