# 🚀 Quick Start Guide - Next.js Pharmacy System

## ✅ Migration Complete!

All 21 components have been successfully converted from React to Next.js!

---

## 📋 Prerequisites

Before starting, make sure you have:

1. **XAMPP Running:**
   - ✅ Apache (for PHP backend)
   - ✅ MySQL (for database)

2. **Database Setup:**
   - ✅ Import `pharmacy_system_with_auth.sql` into MySQL
   - ✅ Run `api/setup_users.php` to create default users

3. **Node.js Installed:**
   - Version 18 or higher

---

## 🎯 How to Start

### Step 1: Install Dependencies
```cmd
cd pharmacy-nextjs
npm install
```

### Step 2: Check Environment Variables
The `.env.local` file should already exist with:
```
NEXT_PUBLIC_API_URL=http://localhost/pharmacy-system/api
```

### Step 3: Start Development Server
```cmd
npm run dev
```

### Step 4: Open in Browser
Visit: **http://localhost:3000**

---

## 🔐 Default Login Credentials

### Administrator:
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full system access

### Pharmacist:
- **Username:** `pharmacist1`
- **Password:** `admin123`
- **Access:** Clinical duties, inventory, prescriptions

### Cashier:
- **Username:** `cashier1`
- **Password:** `admin123`
- **Access:** Point of sale, sales history, customer management

---

## 🧪 Testing Checklist

### Login Page:
- [ ] Page loads with pharmacy.jpg background
- [ ] Login form displays correctly
- [ ] Can login with admin credentials
- [ ] Can login with pharmacist credentials
- [ ] Can login with cashier credentials
- [ ] Error messages display for wrong credentials

### Admin Dashboard:
- [ ] Dashboard stats display (users, revenue, inventory)
- [ ] User Management tab works
- [ ] Reports & Analytics tab works
- [ ] System Settings tab works
- [ ] Audit Logs tab works
- [ ] Backup & Restore tab works

### Cashier Dashboard:
- [ ] Today's stats display (sales, revenue, customers)
- [ ] Point of Sale works
- [ ] Can add items to cart
- [ ] Can process sales
- [ ] Sales History displays
- [ ] Daily Reports show data

### Pharmacist Dashboard:
- [ ] Dashboard stats display
- [ ] Prescription Verification works
- [ ] Drug Interaction Checker works
- [ ] Patient Counseling works
- [ ] Expiry Monitoring works
- [ ] Supply Order Management works

### General Features:
- [ ] User profile dropdown works
- [ ] Time-based greeting displays correctly
- [ ] Logout works
- [ ] Navigation between tabs works
- [ ] No console errors
- [ ] All currency displays show TSh (Tanzanian Shillings)

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors
**Solution:** Make sure you ran `npm install` in the pharmacy-nextjs folder

### Issue: API calls failing
**Solution:** 
1. Check XAMPP is running (Apache + MySQL)
2. Verify backend is accessible at `http://localhost/pharmacy-system/api/`
3. Check browser console for specific error messages

### Issue: Login not working
**Solution:**
1. Make sure database is imported
2. Run `api/setup_users.php` to create users
3. Check `api/check_users.php` to verify users exist

### Issue: Blank page or white screen
**Solution:**
1. Check browser console for errors
2. Make sure all components have `'use client';` directive
3. Verify imports use `@/` alias

### Issue: Background image not showing
**Solution:**
1. Verify `pharmacy.jpg` exists in `pharmacy-nextjs/public/`
2. Clear browser cache
3. Check browser console for 404 errors

---

## 📁 Project Structure

```
pharmacy-nextjs/
├── public/
│   └── pharmacy.jpg          # Background image
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.jsx  # Login page
│   │   ├── admin/
│   │   │   └── page.jsx      # Admin dashboard page
│   │   ├── cashier/
│   │   │   └── page.jsx      # Cashier dashboard page
│   │   ├── pharmacist/
│   │   │   └── page.jsx      # Pharmacist dashboard page
│   │   ├── layout.jsx        # Root layout
│   │   ├── page.jsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── Admin/            # 6 admin components
│   │   ├── Auth/             # 1 auth component
│   │   ├── Cashier/          # 6 cashier components
│   │   ├── Layout/           # 2 layout components
│   │   └── Pharmacist/       # 6 pharmacist components
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   └── lib/
│       └── api.js            # API client
├── .env.local                # Environment variables
├── package.json              # Dependencies
└── next.config.js            # Next.js configuration
```

---

## 🔄 Backend API Endpoints

All endpoints remain at: `http://localhost/pharmacy-system/api/modules/`

### Authentication:
- `login.php` - User login
- `logout.php` - User logout

### Admin:
- `get_admin_stats.php` - Admin dashboard stats
- `get_admin_stats_simple.php` - Fallback without auth
- `admin_users.php` - User management

### Cashier:
- `get_cashier_stats.php` - Cashier dashboard stats
- `get_cashier_stats_simple.php` - Fallback without auth
- `process_sale.php` - Process sales
- `get_customers.php` - Customer data
- `get_daily_reports.php` - Daily reports

### Pharmacist:
- `get_pharmacist_stats.php` - Pharmacist dashboard stats
- `get_pharmacist_stats_simple.php` - Fallback without auth
- `prescriptions.php` - Prescription management
- `drug_interactions.php` - Drug interaction checks
- `expiry_monitoring.php` - Expiry alerts

### Inventory:
- `get_medicines.php` - Get all medicines
- `add_medicine.php` - Add new medicine
- `update_medicine.php` - Update medicine
- `delete_medicine.php` - Delete medicine

---

## 💡 Tips

1. **Development Mode:** The app runs in development mode with hot reload
2. **Console Logs:** Check browser console for debugging information
3. **API Responses:** All API responses are logged to console
4. **Session Storage:** Session token is stored in localStorage as `session_token`
5. **Currency:** All prices display in TSh (Tanzanian Shillings)

---

## 🎉 Success!

If you can:
- ✅ Login successfully
- ✅ See dashboard data
- ✅ Navigate between tabs
- ✅ No console errors

**Congratulations! Your Next.js migration is complete and working!** 🚀

---

## 📞 Need Help?

Check these files for more information:
- `MIGRATION_PROGRESS.md` - Complete migration details
- `MIGRATION_SUMMARY.md` - Overview of changes
- `QUICK_REFERENCE.md` - Quick reference guide
- `NEXTJS_MIGRATION_COMPLETE.md` - Full implementation guide

---

**Happy coding!** 💻✨
