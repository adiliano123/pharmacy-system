# 🚀 Quick Authentication Reference Card

## Setup in 3 Steps

### 1️⃣ Database
```bash
mysql -u root -p pharmacy_system < pharmacy_system_with_auth.sql
```

### 2️⃣ Backend
Files already in `api/modules/`:
- ✅ login.php
- ✅ logout.php
- ✅ verify_session.php
- ✅ dispense.php (updated)
- ✅ get_sales.php (updated)

### 3️⃣ Frontend
```bash
cd frontend
npm run dev
```

## Default Login Credentials

```
Username: admin
Password: admin123
Role: Admin

Username: pharmacist1
Password: admin123
Role: Pharmacist

Username: cashier1
Password: admin123
Role: Cashier
```

## How to Use

### Login
1. Open `http://localhost:5173`
2. Enter username & password
3. Click "Login"

### Dispense Medicine (Tracked)
1. Go to Inventory tab
2. Enter quantity
3. Click "Dispense"
4. ✅ Your name is automatically recorded!

### View Sales with Employees
1. Go to Sales tab
2. See employee name for each sale
3. Generate receipts

### Logout
1. Click your profile (top-right)
2. Click "Logout"

## API Endpoints

```
POST /api/modules/login.php
Body: { username, password }

POST /api/modules/logout.php
Header: Authorization: Bearer {token}

GET /api/modules/verify_session.php
Header: Authorization: Bearer {token}

POST /api/modules/dispense.php
Header: Authorization: Bearer {token}
Body: { inventory_id, qty, customer_name?, notes? }

GET /api/modules/get_sales.php
Returns: Sales with employee info

GET /api/modules/get_employee_sales.php
Returns: Employee performance metrics
```

## Database Tables

```sql
users           -- Employee accounts
user_sessions   -- Active sessions
activity_log    -- Audit trail
inventory       -- Medicine stock (+ created_by)
sales           -- Sales records (+ sold_by)
```

## Security Features

✅ Bcrypt password hashing  
✅ Session tokens (64-char)  
✅ 24-hour expiration  
✅ IP address logging  
✅ Activity audit trail  
✅ Auto-logout on expiry  

## Troubleshooting

**Can't login?**
- Check database connection
- Verify users table exists
- Check browser console

**Session expired?**
- Sessions last 24 hours
- Just login again
- Clear localStorage if needed

**Sales not showing employee?**
- Verify you're logged in
- Check session token
- Ensure dispense.php is updated

## Adding New Users

```sql
-- Generate hash first (use generate_password.php)
INSERT INTO users (username, pas