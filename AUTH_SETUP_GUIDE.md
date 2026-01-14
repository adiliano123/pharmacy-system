# 🔐 User Authentication & Employee Tracking Setup Guide

## Overview

This guide will help you set up the complete user login system with employee tracking for the Pharmacy ERP System.

## 🎯 Features Added

✅ **User Authentication**
- Secure login/logout system
- Session management with tokens
- Password hashing (bcrypt)
- Session expiration (24 hours)

✅ **Employee Tracking**
- Track which employee made each sale
- Employee sales reports
- Activity logging
- Role-based access (admin, pharmacist, cashier)

✅ **Security Features**
- Secure password storage
- Session tokens
- IP address logging
- Activity audit trail

## 📋 Setup Steps

### Step 1: Update Database

1. **Backup your current database** (important!)
   ```bash
   mysqldump -u root -p pharmacy_system > pharmacy_backup.sql
   ```

2. **Run the new database schema**:
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Select `pharmacy_system` database or create it
   - Import: `pharmacy_system_with_auth.sql`

   **OR** run via command line:
   ```bash
   mysql -u root -p pharmacy_system < pharmacy_system_with_auth.sql
   ```

### Step 2: Verify Database Tables

Check that these tables were created:
- ✅ `users` - Employee accounts
- ✅ `inventory` - Medicine inventory (updated)
- ✅ `sales` - Sales records (updated with employee tracking)
- ✅ `user_sessions` - Active sessions
- ✅ `activity_log` - Audit trail

### Step 3: Test Default Users

Three default users are created:

| Username | Password | Role | Full Name |
|----------|----------|------|-----------|
| `admin` | `admin123` | admin | System Administrator |
| `pharmacist1` | `admin123` | pharmacist | John Pharmacist |
| `cashier1` | `admin123` | cashier | Jane Cashier |

**⚠️ IMPORTANT**: Change these passwords in production!

### Step 4: Update API Files

The following API files have been created/updated:

**New Files:**
- `api/modules/login.php` - User login
- `api/modules/logout.php` - User logout
- `api/modules/verify_session.php` - Session verification
- `api/modules/get_employee_sales.php` - Employee sales reports

**Updated Files:**
- `api/modules/dispense.php` - Now tracks employee
- `api/modules/get_sales.php` - Returns employee info

### Step 5: Frontend Setup

No additional npm packages needed! Just restart your dev server:

```bash
cd frontend
npm run dev
```

## 🔑 How It Works

### Authentication Flow

```
1. User enters username/password
   ↓
2. Backend verifies credentials
   ↓
3. Generate session token (64-char random string)
   ↓
4. Store token in database & localStorage
   ↓
5. Include token in all API requests
   ↓
6. Backend verifies token for each request
```

### Employee Tracking Flow

```
1. Employee logs in
   ↓
2. Session stores user_id
   ↓
3. When dispensing medicine:
   - API receives session token
   - Extracts user_id from session
   - Records sale with sold_by = user_id
   ↓
4. Sales table now shows who made each sale
```

## 📊 New Features

### 1. Login Screen
- Beautiful gradient design
- Username/password fields
- Error handling
- Default credentials shown

### 2. User Profile Display
- Shows logged-in user info
- Role badge (admin/pharmacist/cashier)
- Dropdown menu with logout

### 3. Sales Tracking
- Each sale shows employee name
- Employee icon based on role
- Customer name field (optional)
- Notes field (optional)

### 4. Activity Logging
- All logins tracked
- All sales tracked
- IP addresses recorded
- Timestamps for everything

## 🔒 Security Features

### Password Security
- Passwords hashed with bcrypt
- Never stored in plain text
- Strong hashing algorithm

### Session Security
- 64-character random tokens
- 24-hour expiration
- IP address tracking
- User agent tracking

### API Security
- Token required for protected endpoints
- Automatic session verification
- 401 errors for invalid sessions
- Auto-logout on expired sessions

## 📱 Using the System

### For Employees

1. **Login**:
   - Go to `http://localhost:5173`
   - Enter username and password
   - Click "Login"

2. **Dispense Medicine**:
   - Navigate to Inventory tab
   - Enter quantity
   - Click "Dispense"
   - Sale is automatically tracked with your user ID

3. **View Sales**:
   - Navigate to Sales tab
   - See all sales with employee names
   - Your sales are marked with your name

4. **Logout**:
   - Click your profile in top-right
   - Click "Logout"

### For Administrators

1. **View Employee Performance**:
   - Check `get_employee_sales.php` endpoint
   - See total sales per employee
   - View revenue by employee

2. **Activity Monitoring**:
   - Check `activity_log` table
   - See all user actions
   - Track login/logout times

3. **User Management**:
   - Add new users via database
   - Deactivate users (set `is_active = FALSE`)
   - Change roles

## 🛠️ Adding New Users

### Via Database (phpMyAdmin)

```sql
-- Generate password hash in PHP first
-- In a PHP file or online tool:
-- password_hash('your_password', PASSWORD_DEFAULT)

INSERT INTO users (username, password, full_name, email, role) 
VALUES (
    'newuser',
    '$2y$10$...', -- paste hashed password here
    'New User Name',
    'newuser@pharmacy.com',
    'pharmacist'
);
```

### Password Hash Generator

Create a file `generate_password.php`:

```php
<?php
$password = 'your_password_here';
$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Password: $password\n";
echo "Hash: $hash\n";
?>
```

Run: `php generate_password.php`

## 📈 Reports & Analytics

### Employee Sales Report

Access: `http://localhost/pharmacy-system/api/modules/get_employee_sales.php`

Returns:
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "full_name": "John Pharmacist",
      "username": "pharmacist1",
      "role": "pharmacist",
      "total_sales": 45,
      "total_items_sold": 230,
      "total_revenue": 4567.50,
      "first_sale": "2024-01-01 10:00:00",
      "last_sale": "2024-01-14 16:30:00"
    }
  ]
}
```

### Activity Log Query

```sql
SELECT 
    u.full_name,
    a.action,
    a.description,
    a.created_at,
    a.ip_address
FROM activity_log a
JOIN users u ON a.user_id = u.user_id
ORDER BY a.created_at DESC
LIMIT 100;
```

## 🔧 Troubleshooting

### Issue: "Invalid or expired session"
**Solution**: 
- Clear localStorage
- Login again
- Check session expiration (24 hours)

### Issue: "Authentication required"
**Solution**:
- Verify session token is being sent
- Check browser console for errors
- Ensure API endpoints are accessible

### Issue: Can't login
**Solution**:
- Verify database connection
- Check username/password
- Ensure `users` table exists
- Check browser console for errors

### Issue: Sales not showing employee
**Solution**:
- Verify `sold_by` column exists in sales table
- Check foreign key constraints
- Ensure session is valid when dispensing

## 🎨 Customization

### Change Session Expiration

In `api/modules/login.php`:
```php
// Change from 24 hours to 8 hours
$expires_at = date('Y-m-d H:i:s', strtotime('+8 hours'));
```

### Add More Roles

In database:
```sql
ALTER TABLE users 
MODIFY COLUMN role ENUM('admin', 'pharmacist', 'cashier', 'manager', 'intern');
```

### Customize Login Page

Edit `frontend/src/components/Auth/LoginForm.jsx`:
- Change colors
- Add logo
- Modify layout
- Add "Remember Me" checkbox

## 📚 API Endpoints Reference

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/login.php` | POST | No | User login |
| `/logout.php` | POST | Yes | User logout |
| `/verify_session.php` | GET | Yes | Check session validity |
| `/dispense.php` | POST | Yes | Dispense medicine (tracked) |
| `/get_sales.php` | GET | No | Get all sales with employees |
| `/get_employee_sales.php` | GET | No | Employee performance report |
| `/get_inventory.php` | GET | No | Get inventory |
| `/add_medicine.php` | POST | Yes | Add new medicine |

## 🚀 Next Steps

1. **Change default passwords** immediately
2. **Add more employees** as needed
3. **Test the login system** thoroughly
4. **Monitor activity logs** regularly
5. **Backup database** frequently

## 💡 Tips

- Use strong passwords in production
- Regularly review activity logs
- Set up automatic session cleanup
- Consider adding 2FA for admins
- Implement password reset functionality
- Add email notifications for important actions

---

**Your pharmacy system now has complete user authentication and employee tracking! 🎉**
