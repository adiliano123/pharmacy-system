# ⚡ White Screen - Quick Fix

## 🎯 Most Likely Cause

The white screen is usually caused by one of these:

### 1. Dev Server Not Running
**Fix:**
```cmd
cd frontend
npm run dev
```

### 2. Browser Cache
**Fix:**
Press `Ctrl + Shift + R` (hard refresh)

### 3. JavaScript Error
**Fix:**
1. Press `F12`
2. Go to Console tab
3. Look for red errors
4. Copy the error message

## ⚡ Quick Fix (Try This First)

### Step 1: Restart Dev Server
```cmd
cd C:\xampp\htdocs\pharmacy-system\frontend
npm run dev
```

### Step 2: Hard Refresh Browser
```
Press: Ctrl + Shift + R
```

### Step 3: Check Console
```
Press: F12
Look for red errors in Console tab
```

## 🔍 What to Check

### In Browser Console (F12):
Look for these errors:
- ❌ "Cannot find module" → Run `npm install`
- ❌ "Unexpected token" → Syntax error in code
- ❌ "X is not defined" → Missing import
- ❌ "Failed to fetch" → Backend not running

### In Terminal:
Look for:
- ❌ Compilation errors
- ❌ "Module not found"
- ❌ Port already in use

## 💡 Common Solutions

### Solution 1: Reinstall Dependencies
```cmd
cd frontend
npm install
npm run dev
```

### Solution 2: Clear Cache & Restart
```cmd
cd frontend
npm run dev
```
Then: `Ctrl + Shift + R` in browser

### Solution 3: Check XAMPP
- Make sure Apache is running
- Make sure MySQL is running

## 🎯 90% Fix

**This fixes most white screens:**

1. Open Command Prompt
2. Run:
```cmd
cd C:\xampp\htdocs\pharmacy-system\frontend
npm run dev
```
3. Wait for "Local: http://localhost:5173"
4. Open browser to http://localhost:5173
5. Press `Ctrl + Shift + R`

## 📋 Quick Checklist

- [ ] Terminal shows "Local: http://localhost:5173"
- [ ] No red errors in terminal
- [ ] Browser URL is http://localhost:5173
- [ ] Pressed Ctrl + Shift + R
- [ ] F12 console shows no red errors
- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running

## 🆘 Still White Screen?

### Check Browser Console:
1. Press `F12`
2. Go to "Console" tab
3. Copy any red error messages
4. Look at the error - it will tell you what's wrong

### Common Error Messages:

**"jsPDF is not defined"**
```cmd
cd frontend
npm install jspdf jspdf-autotable
npm run dev
```

**"Cannot find module './utils/...'"**
- Check if the file exists
- Check the import path
- Make sure file extension is correct

**"Unexpected token"**
- Check for syntax errors
- Look at the file mentioned in error
- Check for missing brackets or quotes

## ✅ Success = No White Screen

You'll see:
- Login page (if not logged in)
- Dashboard (if logged in)
- No errors in console
- Can click and navigate

---

**TL;DR:**
```cmd
cd frontend
npm run dev
```
Then press `Ctrl + Shift + R` in browser.

If still white, press `F12` and check Console for errors.
