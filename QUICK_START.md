# 🚀 Quick Start Guide

## Setup in 5 Minutes

### Step 1: Database Setup (2 minutes)
```bash
# Start XAMPP/WAMP
# Open phpMyAdmin (http://localhost/phpmyadmin)
# Create database: pharmacy_system
# Import: pharmacy_system.sql
```

### Step 2: Backend Setup (1 minute)
```bash
# Ensure project is in server root:
# XAMPP: C:/xampp/htdocs/pharmacy-system/
# WAMP: C:/wamp64/www/pharmacy-system/

# Test API:
# Visit: http://localhost/pharmacy-system/api/modules/get_inventory.php
```

### Step 3: Frontend Setup (2 minutes)
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Open Application
```
Browser: http://localhost:5173
```

## 🎯 First Actions

1. **Add Medicine Stock**:
   - Click "Inventory & Stock" tab
   - Fill in the "Add New Batch" form
   - Click "Add to Stock"

2. **Dispense Medicine**:
   - Enter quantity in the table row
   - Click "Dispense" button

3. **View Sales**:
   - Click "Sales & Revenue" tab
   - See transaction history
   - Generate PDF receipts

## 🔍 Troubleshooting

### API Not Working?
- Check if XAMPP/WAMP is running
- Verify database connection in `api/config/database.php`
- Check project path matches API URL

### Frontend Not Loading?
- Run `npm install` again
- Check if port 5173 is available
- Clear browser cache

### Database Errors?
- Verify database name is `pharmacy_system`
- Check MySQL credentials
- Ensure tables are imported correctly

## 📁 Project Structure Overview

```
pharmacy-system/
├── api/              → PHP Backend
├── frontend/         → React Frontend
│   └── src/
│       ├── components/   → UI Components
│       ├── hooks/        → Custom Hooks
│       ├── services/     → API Calls
│       ├── utils/        → Utilities
│       └── constants/    → Config
└── pharmacy_system.sql   → Database
```

## 🎨 Key Features

✅ Modern gradient UI design  
✅ Real-time inventory tracking  
✅ Low stock alerts  
✅ Sales analytics  
✅ PDF receipt generation  
✅ Search functionality  
✅ Responsive layout  

## 📞 Need Help?

Check the detailed documentation:
- `README.md` - Full documentation
- `frontend/PROJECT_STRUCTURE.md` - Frontend architecture

---

**Happy Coding! 💊**
