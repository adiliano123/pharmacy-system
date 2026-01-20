# ✅ Complete Setup Checklist - Pharmacy System

Follow this checklist to get everything working from scratch.

## Prerequisites
- [ ] XAMPP installed
- [ ] XAMPP Apache running (green in control panel)
- [ ] XAMPP MySQL running (green in control panel)
- [ ] Project in `C:\xampp\htdocs\pharmacy-system\`

---

## Part 1: Database Setup (5 minutes)

### Option A: Using phpMyAdmin (Recommended)
- [ ] Open http://localhost/phpmyadmin
- [ ] Click "Import" tab
- [ ] Click "Choose File"
- [ ] Select `pharmacy_system_with_auth.sql`
- [ ] Click "Go" at bottom
- [ ] Wait for "Import has been successfully finished"

### Option B: Using Command Line
```cmd
cd C:\xampp\htdocs\pharmacy-system
mysql -u root < pharmacy_system_with_auth.sql
```

### Verify Database:
- [ ] Visit: http://localhost/pharmacy-system/api/verify_database.php
- [ ] Should show all tables exist

---

## Part 2: Create Users (1 minute)

- [ ] Visit: http://localhost/pharmacy-system/api/setup_users.php
- [ ] Should see: `"success": true`
- [ ] Should list 3 users created

### Verify Users:
- [ ] Visit: http://localhost/pharmacy-system/api/check_users.php
- [ ] Should show: `"users_count": 3`

---

## Part 3: Test Backend (2 minutes)

- [ ] Visit: http://localhost/pharmacy-system/api/setup.php
- [ ] Click "Test Connection" → Should be green ✓
- [ ] Click "Setup Users" → Should show 3 users ✓
- [ ] Click "Test Login" → Should show login successful ✓

---

## Part 4: Setup Frontend (2 minutes)

### If not already done:
```cmd
cd C:\xampp\htdocs\pharmacy-system\frontend
npm install
npm run dev
```

- [ ] Frontend running at http://localhost:5173
- [ ] No errors in terminal

---

## Part 5: Test Login (1 minute)

- [ ] Open http://localhost:5173
- [ ] Enter username: `admin`
- [ ] Enter password: `admin123`
- [ ] Click "Login"
- [ ] Should see dashboard

---

## Part 6: Test Stock Adding (2 minutes)

- [ ] Click "Inventory" tab
- [ ] Fill the "Add New Batch" form:
  - Medicine Name: `Aspirin`
  - Generic Name: `Acetylsalicylic Acid`
  - Category: `Painkiller`
  - Batch Number: `B001`
  - Quantity: `100`
  - Price: `2.50`
  - Expiry Date: (pick a future date)
- [ ] Click "Add to Stock"
- [ ] Should see: "✓ Stock added successfully!"
- [ ] Item appears in inventory table below

---

## Part 7: Verify Dashboard (1 minute)

- [ ] Click "Home" tab
- [ ] Should see updated statistics:
  - Stock Value shows $250.00 (100 × $2.50)
  - Inventory Items shows 1
  - All cards display properly

---

## Troubleshooting

### Can't Login?
→ See `FIX_LOGIN_NOW.md`

### Stock Adding Error?
→ See `QUICK_FIX_SUMMARY.md`

### Database Issues?
→ See `SETUP_DATABASE.md`

### Detailed Login Issues?
→ See `LOGIN_TROUBLESHOOTING.md`

---

## Quick Links

**Backend Tests:**
- Check Users: http://localhost/pharmacy-system/api/check_users.php
- Verify Database: http://localhost/pharmacy-system/api/verify_database.php
- Setup Wizard: http://localhost/pharmacy-system/api/setup.php
- Test Connection: http://localhost/pharmacy-system/api/test_connection.php

**Frontend:**
- Application: http://localhost:5173

**Database:**
- phpMyAdmin: http://localhost/phpmyadmin

---

## Default Credentials

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | admin123 | Admin | Full access |
| pharmacist1 | admin123 | Pharmacist | Inventory + Sales |
| cashier1 | admin123 | Cashier | Sales only |

⚠️ **Change these passwords in production!**

---

## Success Indicators

You're all set when:
- ✅ All backend test links work
- ✅ Can login to frontend
- ✅ Can add stock items
- ✅ Dashboard shows statistics
- ✅ Inventory table displays items
- ✅ Can dispense medicine
- ✅ Sales are recorded

---

## Next Steps

After setup is complete:
1. Add more medicine stock
2. Test dispensing functionality
3. View sales reports
4. Explore all features
5. Customize for your needs

---

**Estimated Total Time:** 15 minutes

**If you get stuck:** Check the troubleshooting guides in the project root folder.
