# 🔧 White Screen Fix

## ❌ Problem: White Screen / Blank Page

A white screen usually means there's a JavaScript error preventing the app from rendering.

## 🔍 Step 1: Check Browser Console

### Open Developer Tools:
- **Windows/Linux:** Press `F12` or `Ctrl + Shift + I`
- **Mac:** Press `Cmd + Option + I`

### Go to Console Tab:
Look for **red error messages**. Common errors:

1. **"Cannot find module"** → Missing dependency
2. **"Unexpected token"** → Syntax error
3. **"X is not defined"** → Missing import
4. **"Cannot read property of undefined"** → Data issue

## 🎯 Common Causes & Solutions

### Cause 1: Missing jsPDF Library
**Error:** `jsPDF is not defined` or `Cannot find module 'jspdf'`

**Solution:**
```cmd
cd frontend
npm install jspdf jspdf-autotable
```

Then restart the dev server:
```cmd
npm run dev
```

### Cause 2: Dev Server Not Running
**Symptom:** Page loads but shows nothing

**Solution:**
```cmd
cd frontend
npm run dev
```

Make sure you see: `Local: http://localhost:5173`

### Cause 3: Build Error
**Symptom:** Console shows compilation errors

**Solution:**
```cmd
cd frontend
npm install
npm run dev
```

### Cause 4: Browser Cache
**Symptom:** Old code is cached

**Solution:**
- Press `Ctrl + Shift + R` (hard refresh)
- Or `Ctrl + F5`
- Or clear browser cache

### Cause 5: Port Conflict
**Symptom:** Dev server won't start

**Solution:**
```cmd
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F

# Then restart
npm run dev
```

## 🛠️ Quick Fix Steps

### Step 1: Check Console
```
1. Press F12
2. Go to Console tab
3. Look for red errors
4. Copy the error message
```

### Step 2: Restart Dev Server
```cmd
cd frontend
npm run dev
```

### Step 3: Hard Refresh Browser
```
Press: Ctrl + Shift + R
```

### Step 4: Reinstall Dependencies (if needed)
```cmd
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## 📋 Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] No errors in terminal
- [ ] Browser console is open (F12)
- [ ] No red errors in console
- [ ] Correct URL: http://localhost:5173
- [ ] jsPDF is installed
- [ ] Hard refresh done (Ctrl + Shift + R)

## 🔴 Specific Error Solutions

### Error: "jsPDF is not defined"
```cmd
cd frontend
npm install jspdf jspdf-autotable
npm run dev
```

### Error: "Cannot find module"
```cmd
cd frontend
npm install
npm run dev
```

### Error: "Unexpected token"
- Check for syntax errors in recent changes
- Look at the file mentioned in error
- Fix the syntax issue

### Error: "Failed to fetch"
- Check if backend (XAMPP) is running
- Check if Apache and MySQL are started
- Verify API URLs in `frontend/src/services/api.js`

## 🎯 Most Likely Solution

**90% of white screens are caused by:**

1. **Missing jsPDF library**
   ```cmd
   npm install jspdf jspdf-autotable
   ```

2. **Dev server not running**
   ```cmd
   npm run dev
   ```

3. **Browser cache**
   ```
   Ctrl + Shift + R
   ```

## 📊 Debug Information to Collect

If still having issues, collect this info:

1. **Browser Console Error:**
   - Press F12
   - Copy full error message

2. **Terminal Output:**
   - Copy any errors from `npm run dev`

3. **Package.json:**
   - Check if jspdf is listed in dependencies

4. **Browser:**
   - Which browser? (Chrome, Firefox, etc.)
   - Version?

## 🔧 Emergency Rollback

If you want to undo recent changes:

### Remove PDF Features:
1. Delete these files:
   - `frontend/src/utils/inventoryPdfGenerator.js`
   - `frontend/src/utils/salesPdfGenerator.js`

2. Remove imports from:
   - `frontend/src/components/Inventory/InventoryTable.jsx`
   - `frontend/src/components/Sales/SalesTable.jsx`

3. Restart dev server

## 💡 Prevention

To avoid white screens:

1. **Always check console** after making changes
2. **Test incrementally** - don't make too many changes at once
3. **Keep dev server running** while developing
4. **Install dependencies** before using them
5. **Use error boundaries** in React

## 🎬 Step-by-Step Recovery

### 1. Open Terminal
```cmd
cd C:\xampp\htdocs\pharmacy-system\frontend
```

### 2. Install Dependencies
```cmd
npm install jspdf jspdf-autotable
```

### 3. Start Dev Server
```cmd
npm run dev
```

### 4. Open Browser
```
Go to: http://localhost:5173
```

### 5. Check Console
```
Press F12
Look for errors
```

### 6. Hard Refresh
```
Press: Ctrl + Shift + R
```

## ✅ Success Indicators

You'll know it's fixed when:
- ✅ No errors in browser console
- ✅ No errors in terminal
- ✅ App loads and shows content
- ✅ Can navigate between tabs
- ✅ Can see data in tables

---

**Most Common Fix:**
```cmd
cd frontend
npm install jspdf jspdf-autotable
npm run dev
```

Then press `Ctrl + Shift + R` in browser.
