# 🚀 Quick Setup Instructions

## Why Login Fails

The most common reason login fails is because the password hashes in the database are incorrect or users don't exist.

## ✅ Solution: Use the Setup Wizard

### Step 1: Import Database

```bash
# Open phpMyAdmin: http://localhost/phpmyadmin
# Create database: pharmacy_system
# Import file: pharmacy_system_with_auth.sql
```

**OR** via command line:
```bash
mysql -u root -p pharmacy_system < pharmacy_system_with_auth.sql
```

### Step 2: Run Setup Wizard

Open in your browser:
```
http://localhost/pharmacy-system/api/setup.php
```

This beautiful setup page will:
1. ✅ Test your database connection
2. ✅ Create users with proper password hashes
3. ✅ Test the login functionality
4. ✅ Show you the credentials

### Step 3: Login

Open the frontend:
```
http://localhost:5173
```

Use these credentials:
- **Username:** `admin`
- **Password:** `admin123`

## 🔧 Alternative: Manual Setup

If you prefer command line:

### 1. Test Connection
```
http://localhost/pharmacy-system/api/test_connection.php
```

### 2. Setup Users
```
http://localhost/pharmacy-system/api/setup_users.php
```

### 3. Test Login
```bash
curl -X POST http://localhost/pharmacy-system/api/modules/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📋 Default Accounts

After running setup, you'll have:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| pharmacist1 | admin123 | Pharmacist |
| cashier1 | admin123 | Cashier |

## ❓ Still Having Issues?

See the detailed troubleshooting guide:
- `LOGIN_TROUBLESHOOTING.md`

## 🎯 Quick Checklist

Before attempting login:
- [ ] XAMPP/WAMP is running
- [ ] Database `pharmacy_system` exists
- [ ] SQL file is imported
- [ ] Ran `api/setup.php` or `api/setup_users.php`
- [ ] Frontend is running (`npm run dev`)
- [ ] Using correct URL: `http://localhost:5173`

## 🎉 Success!

Once you see "Login Successful" in the setup wizard, you're ready to use the system!

---

**TL;DR:** 
1. Import SQL file
2. Visit `http://localhost/pharmacy-system/api/setup.php`
3. Click all three buttons
4. Login with `admin` / `admin123`
