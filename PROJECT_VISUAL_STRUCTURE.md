# 📁 Pharmacy ERP System - Visual Structure

## Complete Project Tree (Excluding node_modules)

```
pharmacy-system/
│
├── 📄 README.md                          # Main documentation
├── 📄 QUICK_START.md                     # 5-minute setup guide
├── 📄 STRUCTURE_SUMMARY.md               # Architecture overview
├── 📄 BEFORE_AFTER_COMPARISON.md         # Refactoring comparison
├── 📄 PROJECT_VISUAL_STRUCTURE.md        # This file
├── 📄 pharmacy_system.sql                # Database schema
│
├── 📁 api/                               # Backend PHP API
│   ├── 📁 config/
│   │   └── 📄 database.php               # DB connection config
│   │
│   └── 📁 modules/                       # API endpoints
│       ├── 📄 add_medicine.php           # POST: Add new stock
│       ├── 📄 dispense.php               # POST: Dispense medicine
│       ├── 📄 get_inventory.php          # GET: Fetch inventory
│       └── 📄 get_sales.php              # GET: Fetch sales data
│
└── 📁 frontend/                          # React Frontend Application
    │
    ├── 📄 package.json                   # Dependencies
    ├── 📄 package-lock.json              # Locked dependencies
    ├── 📄 vite.config.js                 # Vite configuration
    ├── 📄 eslint.config.js               # ESLint rules
    ├── 📄 index.html                     # Entry HTML
    ├── 📄 .gitignore                     # Git ignore rules
    ├── 📄 README.md                      # Frontend docs
    ├── 📄 PROJECT_STRUCTURE.md           # Detailed structure
    │
    ├── 📁 public/                        # Static assets
    │   └── 📄 vite.svg
    │
    └── 📁 src/                           # Source code
        │
        ├── 📄 main.jsx                   # Application entry point
        ├── 📄 App.jsx                    # Main App component (80 lines)
        ├── 📄 App.css                    # App-specific styles
        ├── 📄 index.css                  # Global styles
        │
        ├── 📁 components/                # UI Components (Feature-based)
        │   │
        │   ├── 📁 Dashboard/             # Dashboard feature
        │   │   └── 📄 DashboardCards.jsx # Revenue & stock cards
        │   │
        │   ├── 📁 Inventory/             # Inventory management
        │   │   ├── 📄 AddStockForm.jsx   # Add medicine form
        │   │   ├── 📄 InventoryTable.jsx # Inventory display table
        │   │   └── 📄 SearchPanel.jsx    # Search functionality
        │   │
        │   ├── 📁 Sales/                 # Sales feature
        │   │   └── 📄 SalesTable.jsx     # Sales history table
        │   │
        │   └── 📁 Layout/                # Layout components
        │       ├── 📄 Header.jsx         # App header with logo
        │       └── 📄 TabNavigation.jsx  # Tab switcher
        │
        ├── 📁 hooks/                     # Custom React Hooks
        │   ├── 📄 useInventory.js        # Inventory state & logic
        │   └── 📄 useSales.js            # Sales state & logic
        │
        ├── 📁 services/                  # API Service Layer
        │   └── 📄 api.js                 # Centralized API calls
        │
        ├── 📁 utils/                     # Utility Functions
        │   └── 📄 pdfGenerator.js        # PDF receipt generation
        │
        ├── 📁 constants/                 # Configuration
        │   └── 📄 config.js              # App constants & config
        │
        └── 📁 assets/                    # Static assets
            └── 📄 react.svg              # React logo
```

## 🎯 Component Hierarchy

```
App (Main Container)
│
├── Header
│   └── Logo + Title
│
├── TabNavigation
│   ├── Inventory Tab
│   └── Sales Tab
│
├── DashboardCards
│   ├── Total Revenue Card
│   ├── Low Stock Card
│   └── Out of Stock Card
│
└── Conditional View Rendering
    │
    ├── Inventory View
    │   ├── AddStockForm
    │   │   └── Form inputs + Submit button
    │   │
    │   ├── SearchPanel
    │   │   ├── Search input
    │   │   └── Results counter
    │   │
    │   └── InventoryTable
    │       ├── Table header
    │       └── Table rows
    │           ├── Medicine info
    │           ├── Batch number
    │           ├── Quantity
    │           ├── Status badge
    │           └── Dispense action
    │
    └── Sales View
        └── SalesTable
            ├── Table header
            └── Table rows
                ├── Date & time
                ├── Medicine name
                ├── Quantity sold
                ├── Revenue
                └── Receipt button
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                       │
│                      (React Components)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      CUSTOM HOOKS LAYER                      │
│              (useInventory.js, useSales.js)                  │
│                                                               │
│  • State Management                                          │
│  • Business Logic                                            │
│  • Data Transformation                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│                        (api.js)                              │
│                                                               │
│  • API Call Abstraction                                      │
│  • Request/Response Handling                                 │
│  • Error Management                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                             │
│                    (PHP Modules)                             │
│                                                               │
│  • add_medicine.php                                          │
│  • dispense.php                                              │
│  • get_inventory.php                                         │
│  • get_sales.php                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│                    (MySQL)                                   │
│                                                               │
│  • inventory table                                           │
│  • sales table                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📦 File Size Comparison

| File | Lines | Purpose |
|------|-------|---------|
| **App.jsx** | ~80 | Main orchestrator |
| **DashboardCards.jsx** | ~40 | Dashboard UI |
| **InventoryTable.jsx** | ~120 | Inventory display |
| **AddStockForm.jsx** | ~70 | Add stock form |
| **SearchPanel.jsx** | ~35 | Search UI |
| **SalesTable.jsx** | ~90 | Sales display |
| **Header.jsx** | ~20 | Header UI |
| **TabNavigation.jsx** | ~35 | Tab switcher |
| **useInventory.js** | ~75 | Inventory logic |
| **useSales.js** | ~25 | Sales logic |
| **api.js** | ~20 | API calls |
| **pdfGenerator.js** | ~45 | PDF generation |
| **config.js** | ~20 | Configuration |

**Total: ~675 lines** (vs 500+ lines in single file)

## 🎨 Styling Architecture

```
Global Styles (index.css)
├── CSS Reset
├── Base Typography
├── Color Scheme
└── Global Utilities

Component Styles (App.css)
├── Animations
├── Transitions
└── Utility Classes

Inline Styles (Components)
├── Component-specific styling
├── Dynamic styles
└── Gradient definitions
```

## 🚀 Build & Development Flow

```
Development:
npm run dev → Vite Dev Server → http://localhost:5173

Production:
npm run build → Optimized Bundle → dist/

Preview:
npm run preview → Preview Production Build
```

## 📊 Key Metrics

- **Total Files**: 17 (excluding node_modules)
- **Components**: 8
- **Custom Hooks**: 2
- **Services**: 1
- **Utils**: 1
- **Config Files**: 1
- **Documentation Files**: 5

## ✅ Benefits Summary

✓ **Modular**: Each file has single responsibility  
✓ **Maintainable**: Easy to locate and fix issues  
✓ **Scalable**: Simple to add new features  
✓ **Testable**: Isolated components for testing  
✓ **Readable**: Clear structure and naming  
✓ **Reusable**: Components can be reused  
✓ **Professional**: Industry-standard architecture  

---

**A well-organized codebase is a joy to work with! 🎉**
