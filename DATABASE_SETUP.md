# 🗄️ Database Setup Guide

## ✅ Single Database File

We've consolidated all database files into **ONE** comprehensive file:

### 📄 `pharmacy_system_complete.sql`

This is the **ONLY** database file you need! It includes:
- ✅ All 14 tables (users, inventory, sales, prescriptions, etc.)
- ✅ All relationships and foreign keys
- ✅ All indexes for performance
- ✅ 6 database views for reporting
- ✅ Sample drug interaction data
- ✅ Complete schema documentation

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Import Database

**Option A - Using phpMyAdmin:**
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "Import" tab
3. Choose file: `pharmacy_system_complete.sql`
4. Click "Go"
5. Wait for success message

**Option B - Using MySQL Command Line:**
```cmd
mysql -u root -p < pharmacy_system_complete.sql
```

### Step 2: Create Default Users

Visit this URL in your browser:
```
http://localhost/pharmacy-system/api/setup_users.php
```

You should see:
```
✅ Users created successfully!
```

### Step 3: Verify Setup

Visit this URL to check users were created:
```
http://localhost/pharmacy-system/api/check_users.php
```

You should see 3 users listed:
- admin (Administrator)
- pharmacist1 (Pharmacist)
- cashier1 (Cashier)

---

## 🔐 Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `pharmacist1` | `admin123` | Pharmacist |
| `cashier1` | `admin123` | Cashier |

---

## 📊 Database Structure

### Core Tables (5):
1. **users** - System users and employees
2. **inventory** - Medicine stock with batch tracking
3. **sales** - Sales transactions
4. **user_sessions** - Active user sessions
5. **activity_log** - Audit trail

### Patient Management (3):
6. **patients** - Patient information
7. **prescriptions** - Prescription records
8. **prescription_items** - Prescription details

### Clinical (2):
9. **drug_interactions** - Drug interaction database
10. **patient_counseling** - Counseling records

### Supply Chain (2):
11. **supply_orders** - Purchase orders
12. **supply_order_items** - Order details

### Monitoring (2):
13. **expiry_alerts** - Expiry monitoring
14. **customers** - Customer records

### Database Views (6):
- sales_with_employee
- inventory_with_creator
- employee_sales_summary
- pending_prescriptions
- expiring_medicines
- low_stock_items

---

## 🗑️ Old Files (Can Be Deleted)

You can safely delete these old database files:
- ❌ `pharmacy_system.sql` (old version)
- ❌ `pharmacy_system_with_auth.sql` (old version)
- ❌ `pharmacy_system_enhanced.sql` (old version)
- ❌ `fix_users.sql` (not needed)

**Keep only:** ✅ `pharmacy_system_complete.sql`

---

## 🔧 Troubleshooting

### Issue: "Database already exists"
**Solution:** Drop the old database first:
```sql
DROP DATABASE IF EXISTS pharmacy_system;
```
Then import `pharmacy_system_complete.sql` again.

### Issue: "Table already exists"
**Solution:** The SQL file uses `IF NOT EXISTS`, so this shouldn't happen. If it does:
1. Drop the database
2. Import fresh

### Issue: "Users not created"
**Solution:**
1. Make sure database is imported first
2. Visit `http://localhost/pharmacy-system/api/setup_users.php`
3. Check for error messages

### Issue: "Cannot login"
**Solution:**
1. Verify users exist: `http://localhost/pharmacy-system/api/check_users.php`
2. Try default credentials: `admin` / `admin123`
3. Check browser console for errors

---

## 📈 Database Statistics

- **Total Tables:** 14
- **Total Views:** 6
- **Total Indexes:** 35+
- **Sample Data:** 8 drug interactions
- **Storage Engine:** InnoDB
- **Character Set:** UTF-8 (utf8mb4)

---

## 🔒 Security Features

- ✅ Password hashing (bcrypt)
- ✅ Session management
- ✅ Activity logging
- ✅ Role-based access control
- ✅ Foreign key constraints
- ✅ Input validation (backend)

---

## 📝 Database Maintenance

### Backup Database:
```cmd
mysqldump -u root -p pharmacy_system > backup.sql
```

### Restore Database:
```cmd
mysql -u root -p pharmacy_system < backup.sql
```

### Check Database Size:
```sql
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'pharmacy_system'
GROUP BY table_schema;
```

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Database `pharmacy_system` exists
- [ ] All 14 tables created
- [ ] All 6 views created
- [ ] 3 users created (admin, pharmacist1, cashier1)
- [ ] Can login to system
- [ ] No errors in browser console

---

## 🎉 Success!

If you completed all steps:
1. ✅ Database is set up
2. ✅ Users are created
3. ✅ System is ready to use

**Next:** Start the Next.js application and login!

```cmd
cd pharmacy-nextjs
npm run dev
```

Visit: **http://localhost:3000**

---

**Need help?** Check the troubleshooting section above or review the error messages in your browser console.
