# 🔧 HTTP 405 Method Not Allowed - Troubleshooting Guide

## Issue: Sale processing fails with HTTP 405 "Method not allowed"

This error means the server is rejecting POST requests to the process_sale.php endpoint.

## 🚀 Immediate Testing Steps

### Step 1: Test Direct Access
Visit these URLs in your browser to test the endpoints:

1. **Direct Test Page**: `http://localhost/pharmacy-system/api/direct_test.php`
2. **Simple Endpoint**: `http://localhost/pharmacy-system/api/modules/process_sale_simple.php`
3. **Method Test**: `http://localhost/pharmacy-system/api/test_method.php`

### Step 2: Check XAMPP Status
1. Open XAMPP Control Panel
2. Ensure Apache is running (green "Running" status)
3. Ensure MySQL is running (green "Running" status)
4. If not running, click "Start" for both services

### Step 3: Test with Browser Console
1. Open the Point of Sale page
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Try processing a sale
5. Look for the test endpoint results

## 🔍 Common Causes & Solutions

### Cause 1: Apache Not Running
**Symptoms**: Cannot connect to server
**Solution**: 
- Start Apache in XAMPP Control Panel
- Check if port 80 is available
- Try port 8080 if 80 is blocked

### Cause 2: PHP Module Not Loaded
**Symptoms**: 405 Method Not Allowed
**Solution**:
- Restart Apache in XAMPP
- Check Apache error logs in XAMPP/logs/
- Verify PHP is working: visit `http://localhost/dashboard/`

### Cause 3: File Permissions
**Symptoms**: 403 Forbidden or 405 errors
**Solution**:
- Ensure files are in correct location: `C:/xampp/htdocs/pharmacy-system/`
- Check file permissions (should be readable)

### Cause 4: URL Rewriting Issues
**Symptoms**: 405 on POST but GET works
**Solution**:
- Check if mod_rewrite is enabled in Apache
- Look for .htaccess files that might interfere
- Test with direct file access

### Cause 5: Server Configuration
**Symptoms**: Consistent 405 errors
**Solution**:
- Restart XAMPP completely
- Check Apache configuration
- Try different port (8080)

## 🛠️ Advanced Troubleshooting

### Check Apache Error Logs
1. Go to `C:/xampp/apache/logs/error.log`
2. Look for recent errors when you tried to process sale
3. Check for PHP or module errors

### Test PHP Processing
1. Create a simple test file: `test.php`
```php
<?php
echo "PHP is working: " . date('Y-m-d H:i:s');
echo "<br>Method: " . $_SERVER['REQUEST_METHOD'];
?>
```
2. Visit `http://localhost/pharmacy-system/api/test.php`

### Verify File Structure
Ensure your files are in the correct location:
```
C:/xampp/htdocs/pharmacy-system/
├── api/
│   ├── modules/
│   │   ├── process_sale.php
│   │   └── process_sale_simple.php
│   ├── config/
│   │   └── database.php
│   └── direct_test.php
└── frontend/
```

## 🔄 Quick Fixes to Try

### Fix 1: Restart XAMPP
1. Stop Apache and MySQL in XAMPP
2. Wait 10 seconds
3. Start Apache and MySQL again
4. Try the sale again

### Fix 2: Clear Browser Cache
1. Press Ctrl+Shift+Delete
2. Clear browsing data
3. Refresh the page
4. Log in again

### Fix 3: Use Alternative URL
Try changing the URL in PointOfSale.jsx to:
- `http://127.0.0.1/pharmacy-system/api/modules/process_sale.php`
- `http://localhost:8080/pharmacy-system/api/modules/process_sale.php` (if using port 8080)

### Fix 4: Test with Postman/Curl
Test the endpoint directly:
```bash
curl -X POST http://localhost/pharmacy-system/api/modules/process_sale_simple.php \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 📞 What to Check Next

1. **Visit the direct test page** - This will show if basic PHP is working
2. **Check browser console** - Look for the test endpoint results
3. **Check XAMPP logs** - Look for Apache/PHP errors
4. **Try the simple endpoint** - See if basic POST works

The enhanced debugging will show exactly where the issue is occurring!