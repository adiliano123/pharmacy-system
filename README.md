# 💊 Pharmacy ERP System

A modern, full-stack Pharmacy Inventory Management System (PIMS) designed to balance clinical safety with business efficiency. The system ensures medications aren't expired or recalled while minimizing stockouts and overstock.

## ✨ Features

- **Inventory Management**: Track medicine stock levels, batch numbers, and expiry dates
- **Real-time Stock Monitoring**: Low stock and out-of-stock alerts
- **Sales Tracking**: Complete sales history with revenue analytics
- **Dispensing System**: Easy medicine dispensing with automatic inventory updates
- **PDF Receipts**: Generate professional receipts for transactions
- **Search & Filter**: Quick search functionality for medicines
- **Modern UI**: Beautiful gradient-based design with smooth animations

## 🏗️ Project Structure

```
pharmacy-system/
├── api/                      # Backend PHP API
│   ├── config/
│   │   └── database.php      # Database configuration
│   └── modules/
│       ├── add_medicine.php  # Add new medicine stock
│       ├── dispense.php      # Dispense medicine
│       ├── get_inventory.php # Get inventory data
│       └── get_sales.php     # Get sales data
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Dashboard/    # Dashboard cards
│   │   │   ├── Inventory/    # Inventory components
│   │   │   ├── Sales/        # Sales components
│   │   │   └── Layout/       # Layout components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Utility functions
│   │   └── constants/        # Configuration constants
│   └── PROJECT_STRUCTURE.md  # Detailed frontend structure
│
└── pharmacy_system.sql       # Database schema
```

## 🚀 Getting Started

### Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Node.js 16+ and npm
- XAMPP/WAMP or similar local server

### Backend Setup

1. **Start your local server** (XAMPP/WAMP)

2. **Create the database**:
   ```sql
   CREATE DATABASE pharmacy_system;
   ```

3. **Import the database schema**:
   ```bash
   mysql -u root -p pharmacy_system < pharmacy_system.sql
   ```

4. **Configure database connection**:
   - Edit `api/config/database.php`
   - Update credentials if needed

5. **Place the project** in your server's root directory:
   - XAMPP: `C:/xampp/htdocs/pharmacy-system/`
   - WAMP: `C:/wamp64/www/pharmacy-system/`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:5173
   ```

## 🎨 Design Features

- **Gradient Backgrounds**: Modern purple-to-blue gradient theme
- **Card-based Layout**: Clean, organized information display
- **Hover Effects**: Smooth transitions and interactive elements
- **Responsive Design**: Works on various screen sizes
- **Color-coded Status**: Visual indicators for stock levels
- **Professional Typography**: Clean, readable fonts

## 📊 Database Schema

### Tables

- **inventory**: Medicine stock information
  - inventory_id, name, generic_name, category, batch_number
  - quantity, expiry_date, price, created_at

- **sales**: Transaction records
  - id, inventory_id, quantity_sold, total_revenue
  - sale_date, batch_number, name

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/modules/get_inventory.php` | GET | Fetch all inventory items |
| `/api/modules/add_medicine.php` | POST | Add new medicine stock |
| `/api/modules/dispense.php` | POST | Dispense medicine |
| `/api/modules/get_sales.php` | GET | Fetch sales records |

## 🛠️ Technologies Used

### Frontend
- React 18
- Vite
- Axios
- jsPDF & jsPDF-AutoTable

### Backend
- PHP
- MySQL
- REST API

### Styling
- CSS-in-JS
- Custom animations
- Gradient designs

## 📱 Features in Detail

### Dashboard
- Total revenue tracking
- Low stock alerts (≤10 items)
- Out of stock monitoring
- Real-time statistics

### Inventory Management
- Add new medicine batches
- Search by name or generic name
- View stock levels with color coding
- Quick dispense functionality

### Sales Tracking
- Complete transaction history
- Revenue per sale
- Date and time stamps
- PDF receipt generation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Pharmacy ERP System - A modern solution for pharmacy management

---

**Note**: This system is designed for educational and small-scale pharmacy operations. For production use, ensure proper security measures, data validation, and compliance with healthcare regulations.
