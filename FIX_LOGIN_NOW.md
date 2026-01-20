# 🚨 Can't Login? Fix It in 3 Steps!

## Step 1: Check Users (10 seconds)
Open this link: **http://localhost/pharmacy-system/api/check_users.php**

---

## Step 2: Create/Reset Users (10 seconds)
Open this link: **http://localhost/pharmacy-system/api/setup_users.php**

You should see:
```
"success": true
"users_created": [...]
```

---

## Step 3: Login (10 seconds)
Refresh your frontend and login with:
- **Username:** `admin`
- **Password:** `admin123`

---

## ❌ Still Not Working?

### If Step 1 shows "Users table does not exist":
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "Import"
3. Select file: `pharmacy_system_with_auth.sql`
4. Click "Go"
5. Then go back to Step 2

### If you see CORS or connection errors:
1. Make sure XAMPP Apache and MySQL are running
2. Access frontend via http://localhost (not file://)
3. Clear browser cache (Ctrl+Shift+Delete)

### If password still wrong:
1. Open: http://localhost/pharmacy-system/api/setup_users.php
2. This resets ALL passwords to `admin123`
3. Try login again

---

## 🎯 Quick Test
Visit: http://localhost/pharmacy-system/api/setup.php
Click all 3 buttons:
1. Test Connection ✓
2. Setup Users ✓
3. Test Login ✓

If all show success, you can login!

---

## 📋 Default Accounts
After setup, you have 3 accounts:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| pharmacist1 | admin123 | Pharmacist |
| cashier1 | admin123 | Cashier |

---

**That's it!** If you followed these steps, you should be able to login now.

For detailed troubleshooting, see: `LOGIN_TROUBLESHOOTING.md`
