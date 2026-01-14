# Pharmacy ERP System - Frontend Structure

## 📁 Project Organization

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Dashboard/       # Dashboard-related components
│   │   │   └── DashboardCards.jsx
│   │   ├── Inventory/       # Inventory management components
│   │   │   ├── AddStockForm.jsx
│   │   │   ├── InventoryTable.jsx
│   │   │   └── SearchPanel.jsx
│   │   ├── Sales/           # Sales-related components
│   │   │   └── SalesTable.jsx
│   │   └── Layout/          # Layout components
│   │       ├── Header.jsx
│   │       └── TabNavigation.jsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useInventory.js  # Inventory state & logic
│   │   └── useSales.js      # Sales state & logic
│   │
│   ├── services/            # API service layer
│   │   └── api.js           # API calls configuration
│   │
│   ├── utils/               # Utility functions
│   │   └── pdfGenerator.js  # PDF receipt generation
│   │
│   ├── constants/           # Configuration constants
│   │   └── config.js        # App configuration
│   │
│   ├── assets/              # Static assets
│   │   └── react.svg
│   │
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
│
├── public/                  # Public assets
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration
```

## 🎯 Architecture Principles

### Component Structure
- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components are designed to be reused across the application
- **Props-based**: Components receive data through props for flexibility

### Custom Hooks
- **useInventory**: Manages inventory state, CRUD operations, and filtering
- **useSales**: Manages sales data and revenue calculations

### Service Layer
- **api.js**: Centralized API calls using axios
- Separates business logic from UI components
- Easy to mock for testing

### Utilities
- **pdfGenerator.js**: Handles PDF receipt generation
- Isolated utility functions for better maintainability

### Constants
- **config.js**: Centralized configuration
- Easy to update API endpoints and thresholds

## 🚀 Benefits of This Structure

1. **Maintainability**: Easy to locate and update specific features
2. **Scalability**: Simple to add new components or features
3. **Testability**: Isolated components and hooks are easier to test
4. **Readability**: Clear folder structure makes navigation intuitive
5. **Reusability**: Components can be reused across different views
6. **Separation**: Business logic separated from presentation

## 📝 Component Hierarchy

```
App
├── Header
├── TabNavigation
├── DashboardCards
└── Conditional Rendering:
    ├── Inventory View
    │   ├── AddStockForm
    │   ├── SearchPanel
    │   └── InventoryTable
    └── Sales View
        └── SalesTable
```

## 🔧 How to Add New Features

1. **New Component**: Add to appropriate folder in `components/`
2. **New API Call**: Add to `services/api.js`
3. **New Hook**: Create in `hooks/` folder
4. **New Utility**: Add to `utils/` folder
5. **New Config**: Update `constants/config.js`
