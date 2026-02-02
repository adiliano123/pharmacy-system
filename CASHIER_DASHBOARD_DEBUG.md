# 🔧 Cashier Dashboard Debug Guide

## Issue: Dashboard stats and daily reports not showing data

The system has been enhanced with comprehensive debugging to identify why the cashier dashboard isn't displaying data.

## 🚀 Enhanced Debugging Features

### 1. Console Logging Added
- **CashierDashboard**: Now logs session token status and API responses
- **DailyReports**: Shows detailed API request/response information
- **Detailed error messages**: Shows exactly what's failing

### 2. Debug Endpoints Created
- **`api/debug_session.php`** - Test session token validation
- **`api/test_cashier_apis.php`** - Check database and API status

## 🔍 Step-by-Step Debugging

### Step 1: Check Browser Console
1. **Log in as cashier1** (username: `cashier1`, password: `admin123`)
2. **Open Developer Tools** (Press F12)
3. **Go to Console tab**
4. **Look for these messages**:
   - 🔍 Fetching cashier stats...
   - Session token found: Yes/No
   - 📡 Making API request...
   - ✅ API Response data: [data]

### Step 2: Test Session Token
Visit: **`http://localhost/pharmacy-system/api/debug_session.php`**

**Expected Response** (if working):
```json
{
  "session_valid": true,
  "user_info": {
    "user_id": 3,
    "username": "cashier1",
    "full_name": "Cashier One",
    "role": "cashier"
  }
}
```

### Step 3: Test Database & APIs
Visit: **`http://localhost/pharmacy-system/api/test_cashier_apis.php`**

This shows:
- Database connection status
- Number of sales records
- Today's sales data
- Links to test individual APIs

### Step 4: Check Individual APIs
Test these URLs directly:
1. **`http://localhost/pharmacy-system/api/modules/get_cashier_stats.php`**
2. **`http://localhost/pharmacy-system/api/modules/get_daily_reports.php`**

## 🛠️ Common Issues & Solutions

### Issue 1: Session Token Not Found
**Console shows**: "❌ No session token found"
**Solution**:
1. Log out completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Log in again as cashier1
4. Check localStorage in DevTools → Application → Local Storage

### Issue 2: Session Token Invalid/Expired
**Console shows**: "Invalid or expired session"
**Solution**:
1. Check `api/debug_session.php` to see session status
2. If expired, log out and log in again
3. Check if user_sessions table has active sessions

### Issue 3: API Returns 401 Unauthorized
**Console shows**: "HTTP error! status: 401"
**Solution**:
1. Verify session token is being sent correctly
2. Check if user exists in database
3. Run `api/setup_users.php` if needed

### Issue 4: API Returns 500 Server Error
**Console shows**: "HTTP error! status: 500"
**Solution**:
1. Check Apache error logs in XAMPP
2. Verify database connection
3. Check if required tables exist

### Issue 5: No Sales Data in Database
**Console shows**: API works but returns zeros
**Solution**:
1. Visit `api/test_cashier_apis.php`
2. Click "Add sample sales data"
3. Or process some sales through Point of Sale

## 🔄 Quick Fixes

### Fix 1: Reset Session
```javascript
// In browser console:
localStorage.clear();
// Then log in again
```

### Fix 2: Add Sample Data
Visit: `http://localhost/pharmacy-system/api/test_cashier_apis.php?add_sample=1`

### Fix 3: Restart XAMPP
1. Stop Apache and MySQL
2. Wait 10 seconds
3. Start both services again

### Fix 4: Check Database Tables
Run in phpMyAdmin:
```sql
SELECT COUNT(*) FROM sales;
SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW();
SELECT * FROM users WHERE role = 'cashier';
```

## 📊 What Should Happen

When working correctly:
1. **Dashboard loads** → Shows real stats (not zeros)
2. **Console shows** → "✅ API Response data: {todaySales: 12000, ...}"
3. **Daily Reports** → Shows charts and metrics
4. **Sales History** → Shows transaction list

## 📞 Next Steps

1. **Follow Step 1** - Check browser console for detailed error messages
2. **Follow Step 2** - Test session token validation
3. **Follow Step 3** - Verify database has data
4. **Report specific error** - Tell me exactly what the console shows

The enhanced debugging will pinpoint exactly what's wrong!