# 🔧 Fix Dispense Error

## ❌ Error: "Error dispensing"

This error can have several causes. Let's fix it step by step.

## 🔍 Step 1: Run Diagnostic

Visit: **http://localhost/pharmacy-system/api/test_dispense.php**

This will show:
- ✅ If tables exist
- ✅ If you have inventory
- ✅ If you're logged in
- ✅ Sample inventory data

## 🎯 Common Causes & Solutions

### Cause 1: Not Logged In
**Symptom:** "Authentication required" or "Invalid session"

**Solution:**
1. Refresh the page
2. Login again
3. Try dispensing again

### Cause 2: No Inventory
**Symptom:** "Medicine not found"

**Solution:**
1. Go to Inventory tab
2. Add stock using "Add New Batch" form
3. Then try dispensing

### Cause 3: Invalid Quantity
**Symptom:** "Invalid quantity" or "Enter a valid quantity"

**Solution:**
- Make sure you entered a number
- Make sure it's greater than 0
- Make sure it's not more than available stock

### Cause 4: Not Enough Stock
**Symptom:** "Not enough stock available"

**Solution:**
- Check the quantity column
- Enter a quantity less than or equal to available stock
- Or add more stock first

### Cause 5: Session Expired
**Symptom:** Redirected to login page

**Solution:**
1. Login again
2. Your session expired (24 hours)

## 🧪 Test Dispense Functionality

### Step-by-Step Test:

**1. Check if logged in:**
```
Press F12 → Console tab
Type: localStorage.getItem('session_token')
Should show: a long string (your token)
If null: You're not logged in
```

**2. Check inventory:**
```
Go to Inventory tab
See if there are items in the table
If empty: Add stock first
```

**3. Try dispensing:**
```
Find an item with quantity > 0
Enter a small number (e.g., 1)
Click "💊 Dispense"
```

**4. Check browser console:**
```
Press F12
Go to Console tab
Look for red error messages
Copy the error and check below
```

## 🔴 Common Error Messages

### "Authentication required"
**Fix:** Login again

### "Invalid or expired session"
**Fix:** Logout and login again

### "Medicine not found"
**Fix:** Make sure the item exists in inventory

### "Not enough stock available"
**Fix:** Enter a smaller quantity

### "Invalid inventory ID or quantity"
**Fix:** 
- Make sure you entered a number
- Make sure the input field has a value

### "Network Error" or "Failed to fetch"
**Fix:**
- Check if XAMPP Apache is running
- Check if MySQL is running
- Try: http://localhost/pharmacy-system/api/test_dispense.php

## 🛠️ Advanced Troubleshooting

### Check Database Connection:
Visit: http://localhost/pharmacy-system/api/test_connection.php

Should show: `"database_connection": true`

### Check Session:
Visit: http://localhost/pharmacy-system/api/modules/verify_session.php

Should show: Your user info

### Check Inventory:
Visit: http://localhost/pharmacy-system/api/modules/get_inventory.php

Should show: Array of inventory items

### Check Browser Network Tab:
1. Press F12
2. Go to "Network" tab
3. Click "Dispense" button
4. Look for "dispense.php" request
5. Click on it
6. Check "Response" tab for error details

## 📋 Checklist Before Dispensing

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] You are logged in (check localStorage)
- [ ] You have inventory items
- [ ] Item has quantity > 0
- [ ] You entered a valid number
- [ ] Number is ≤ available quantity

## 🎯 Quick Fix Steps

### If you see "Error dispensing":

**1. Open browser console (F12)**
- Look for detailed error message
- It will tell you exactly what's wrong

**2. Check these URLs:**
```
http://localhost/pharmacy-system/api/test_dispense.php
http://localhost/pharmacy-system/api/modules/verify_session.php
```

**3. Common fixes:**
- Refresh page and try again
- Logout and login again
- Make sure you have stock
- Enter a smaller quantity

## 💡 Enhanced Error Messages

I've updated the system to show better error messages:

**Before:**
```
Error dispensing
```

**Now:**
```
❌ Not enough stock available! Current stock: 5
```

or

```
✓ Dispensed successfully!

Quantity: 10
Revenue: TSh 25,000
Remaining Stock: 40
```

## 🔧 Manual Test

### Test the API directly:

**1. Get your session token:**
```javascript
// In browser console (F12)
localStorage.getItem('session_token')
```

**2. Test dispense API:**
```bash
# Using curl or Postman
POST http://localhost/pharmacy-system/api/modules/dispense.php

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

Body:
{
  "inventory_id": 1,
  "qty": 5
}
```

**3. Check response:**
- Success: `{"success": true, ...}`
- Error: `{"success": false, "message": "..."}`

## 📊 What Happens When You Dispense

1. **Frontend** sends request with:
   - inventory_id
   - quantity
   - your session token

2. **Backend** checks:
   - Are you logged in? ✓
   - Does the medicine exist? ✓
   - Is there enough stock? ✓

3. **Backend** does:
   - Subtracts quantity from inventory
   - Records sale in sales table
   - Logs activity
   - Returns success message

4. **Frontend** shows:
   - Success message
   - Refreshes inventory table
   - Updates quantities

## 🎉 After Fixing

Once it works, you'll see:
```
✓ Dispensed successfully!

Quantity: 5
Revenue: TSh 12,500
Remaining Stock: 45
```

And the inventory table will update automatically!

---

**Still having issues?** 

1. Visit: http://localhost/pharmacy-system/api/test_dispense.php
2. Check browser console (F12) for detailed errors
3. Make sure you're logged in
4. Make sure you have inventory with quantity > 0
