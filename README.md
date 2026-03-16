# MediPharm — Pharmacy Management System

A full-stack pharmacy management system built for Tanzanian pharmacies. Covers inventory, sales, wholesale, compliance, reporting, and multi-role user management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Laravel 12, PHP 8.2+ |
| Auth | Laravel Sanctum (token-based) + Google OAuth (Socialite) |
| Database | SQLite (dev) / MySQL (prod) |
| State | Zustand |
| HTTP | Axios |
| Icons | Lucide React |

---

## System Structure

```
pharmacy-system/
├── README.md
│
├── pharmacy-frontend/                  # Next.js 16 App
│   ├── src/
│   │   ├── app/                        # App Router pages
│   │   │   ├── page.tsx                # Public landing page
│   │   │   ├── layout.tsx              # Root layout + providers
│   │   │   ├── providers.tsx           # GoogleOAuthProvider wrapper
│   │   │   ├── globals.css             # Global styles + dark mode
│   │   │   │
│   │   │   ├── login/                  # Login page
│   │   │   ├── register/               # Registration page
│   │   │   ├── forgot-password/        # Password reset request
│   │   │   ├── reset-password/         # Password reset form
│   │   │   │
│   │   │   └── dashboard/              # Protected dashboard area
│   │   │       ├── layout.tsx          # Dashboard shell (sidebar + header)
│   │   │       ├── page.tsx            # Role-based redirect
│   │   │       ├── admin/              # Admin dashboard
│   │   │       ├── pharmacist/         # Pharmacist dashboard
│   │   │       ├── cashier/            # Cashier dashboard
│   │   │       ├── storekeeper/        # Storekeeper dashboard
│   │   │       │
│   │   │       ├── products/           # Product catalog
│   │   │       │   ├── page.tsx        # Product list
│   │   │       │   ├── add/            # Add product
│   │   │       │   └── [id]/           # Product detail/edit
│   │   │       │
│   │   │       ├── inventory/          # Stock management
│   │   │       │   ├── page.tsx        # Inventory overview
│   │   │       │   ├── add/            # Add stock batch
│   │   │       │   ├── batches/        # Batch list
│   │   │       │   ├── expiry/         # Expiry tracking
│   │   │       │   └── warehouse/      # Warehouse view
│   │   │       │
│   │   │       ├── sales/              # Sales management
│   │   │       │   ├── page.tsx        # Sales overview
│   │   │       │   ├── new/            # New sale form
│   │   │       │   ├── history/        # Sales history
│   │   │       │   └── invoice/        # Invoice view
│   │   │       │
│   │   │       ├── pos/                # Point of Sale terminal
│   │   │       │
│   │   │       ├── customers/          # Customer management
│   │   │       │   ├── page.tsx        # Customer list
│   │   │       │   ├── add/            # Add customer
│   │   │       │   ├── history/        # Purchase history
│   │   │       │   └── credit/         # Credit management
│   │   │       │
│   │   │       ├── wholesale/          # Wholesale module
│   │   │       │   ├── page.tsx        # Wholesale overview
│   │   │       │   ├── customers/      # Wholesale customers + add
│   │   │       │   └── orders/         # Orders list + new order
│   │   │       │
│   │   │       ├── reports/            # Reporting module
│   │   │       │   ├── page.tsx        # Reports hub
│   │   │       │   ├── sales/          # Sales report
│   │   │       │   ├── profit-loss/    # P&L report
│   │   │       │   ├── stock-movement/ # Stock movement report
│   │   │       │   └── expiry/         # Expiry report
│   │   │       │
│   │   │       ├── compliance/         # Compliance & regulatory
│   │   │       │   ├── page.tsx        # Compliance overview
│   │   │       │   ├── audit-trail/    # Full audit log
│   │   │       │   ├── controlled-drugs/ # Controlled substances register
│   │   │       │   └── inspection/     # Inspection records
│   │   │       │
│   │   │       ├── users/              # User management (admin)
│   │   │       ├── activity-logs/      # System activity logs
│   │   │       ├── profile/            # User profile & avatar
│   │   │       └── settings/           # App settings & password
│   │   │
│   │   ├── components/                 # Reusable components
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx  # Auth guard wrapper
│   │   │   ├── dashboard/
│   │   │   │   ├── Header.tsx          # Top navigation bar
│   │   │   │   └── Sidebar.tsx         # Side navigation
│   │   │   ├── inventory/
│   │   │   │   └── AddProductModal.tsx
│   │   │   ├── forms/
│   │   │   │   └── ProductForm.tsx
│   │   │   ├── tables/
│   │   │   │   └── DataTable.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       └── Input.tsx
│   │   │
│   │   ├── lib/                        # Core utilities
│   │   │   ├── api.ts                  # Axios API client + all endpoints
│   │   │   ├── auth.ts                 # Auth helpers + Google OAuth
│   │   │   ├── roles.ts                # Role permission definitions
│   │   │   └── utils.ts                # Shared helpers
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts              # Auth state hook
│   │   │   └── useLocalStorage.ts      # LocalStorage hook
│   │   │
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx        # Dark mode context
│   │   │
│   │   ├── store/
│   │   │   └── index.ts                # Zustand global store
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts                # All shared TypeScript types
│   │   │   └── dashboard.ts            # Dashboard-specific types
│   │   │
│   │   └── middleware.ts               # Next.js route middleware (auth guard)
│   │
│   ├── .env.local                      # Frontend environment variables
│   └── package.json
│
└── pharmacy-backend/                   # Laravel 12 API
    ├── app/
    │   ├── Http/
    │   │   └── Controllers/
    │   │       ├── AuthController.php          # Login, register, Google OAuth
    │   │       ├── ProductController.php        # Product CRUD
    │   │       ├── StockController.php          # Stock batch CRUD + alerts
    │   │       ├── SaleController.php           # Sales CRUD
    │   │       ├── CustomerController.php       # Customer CRUD
    │   │       ├── WholesaleController.php      # Wholesale customers & orders
    │   │       ├── ReportController.php         # All report endpoints
    │   │       ├── ComplianceController.php     # Compliance & audit
    │   │       ├── DashboardController.php      # Role dashboards
    │   │       ├── UserController.php           # User management
    │   │       └── ActivityLogController.php    # Activity logs
    │   │
    │   └── Models/
    │       ├── User.php                # Users + roles
    │       ├── Product.php             # Products + wholesale price
    │       ├── StockBatch.php          # Stock batches + expiry
    │       ├── Sale.php                # Sales + payment method
    │       ├── SaleItem.php            # Line items per sale
    │       ├── Customer.php            # Customers + wholesale fields
    │       └── ActivityLog.php         # Audit trail entries
    │
    ├── database/
    │   ├── migrations/                 # 18 migration files
    │   └── seeders/                    # Product, Customer, User seeders
    │
    ├── routes/
    │   └── api.php                     # All API route definitions
    │
    ├── config/
    │   ├── sanctum.php                 # Token auth config
    │   ├── cors.php                    # CORS for frontend
    │   └── services.php                # Google OAuth credentials
    │
    ├── .env                            # Backend environment variables
    └── composer.json
```

---

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Backend Setup

```bash
cd pharmacy-backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend Setup

```bash
cd pharmacy-frontend
npm install
cp .env.local.example .env.local   # or create manually
npm run dev
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Backend `.env` (key values)

```env
DB_CONNECTION=sqlite
APP_URL=http://localhost:8000

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=postmessage
```

---

## User Roles & Permissions

| Role | Inventory | Sales | Customers | Reports | Compliance | Settings | Users |
|---|---|---|---|---|---|---|---|
| Admin | ✅ edit | ✅ create | ✅ edit | ✅ | ✅ edit | ✅ edit | ✅ |
| Pharmacist | ✅ edit | ✅ create | ✅ view | ✅ | ✅ view | ❌ | ❌ |
| Cashier | ✅ view | ✅ create | ✅ view | ❌ | ❌ | ❌ | ❌ |
| Storekeeper | ✅ edit | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Store Manager | ✅ edit | ✅ create | ✅ edit | ✅ | ✅ view | ✅ view | ❌ |
| Auditor | ✅ view | ✅ view | ✅ view | ✅ | ✅ edit | ❌ | ❌ |

---

## Modules

### Authentication
- Email/password login and registration
- Google OAuth login (via Laravel Socialite)
- Token-based sessions (Laravel Sanctum)
- Forgot/reset password flow
- Role-based dashboard routing on login

### Inventory Management
- Product catalog (CRUD)
- Stock batch tracking with expiry dates
- Low stock alerts
- Expiring soon alerts
- Warehouse view
- Batch history

### Sales
- New sale / Point of Sale (POS)
- Sales history with filters
- Per-sale item breakdown
- Payment method tracking (cash, card, mobile)

### Customers
- Customer profiles
- Purchase history per customer
- Credit management

### Wholesale
- Wholesale customer management
- Wholesale order creation and tracking
- Payment recording per order
- Wholesale pricing on products
- Wholesale stats dashboard

### Reports
- Sales report (date range, daily breakdown)
- Profit & Loss report (gross/net margin, by category)
- Stock movement report
- Expiry report
- Inventory report
- Top-selling products

### Compliance
- Expired products tracking
- Controlled drugs register + dispense records
- Audit trail (all user actions logged)
- Stock discrepancy detection
- Regulatory report export

### User Management (Admin)
- Create, edit, deactivate users
- Role assignment
- Profile image upload
- Activity log per user
- Notification settings

### Dashboard
- Role-specific dashboards (admin, pharmacist, cashier, storekeeper)
- Sales charts, stock status, profit distribution
- Quick action shortcuts

### Settings & Profile
- Profile editing (name, phone, address, avatar)
- Password change
- Notification preferences
- Account deletion

---

## API Overview

Base URL: `http://localhost:8000/api`

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Email/password login |
| POST | `/auth/google` | Google OAuth login |
| POST | `/forgot-password` | Request password reset |
| POST | `/reset-password` | Reset password with token |

### Protected Endpoints (Bearer token required)

| Group | Endpoints |
|---|---|
| Auth | `POST /logout`, `GET /me` |
| Dashboard | `GET /dashboard/{role}` |
| Products | Full CRUD `/products` |
| Stock | CRUD `/stock`, `/stock/low-stock`, `/stock/expiring-soon` |
| Sales | CRUD `/sales` |
| Customers | CRUD `/customers` |
| Reports | `/reports/sales`, `/reports/profit-loss`, `/reports/inventory`, `/reports/expiry`, `/reports/stock-movement`, `/reports/top-selling` |
| Compliance | `/compliance/expired-products`, `/compliance/audit-trail`, `/compliance/controlled-drugs`, `/compliance/stock-discrepancies`, `/compliance/regulatory-report` |
| Wholesale | `/wholesale/customers`, `/wholesale/orders`, `/wholesale/stats` |
| Users | Full CRUD `/users`, toggle status, upload image |
| Activity Logs | `GET /activity-logs`, `/activity-logs/statistics` |

---

## Dark Mode

The app supports a full dark mode toggle (stored in `localStorage`). The theme is applied via a `.dark-mode` class on `<html>`. Toggle is available on the landing page header and the dashboard.

---

## Default Seeded Data

After running `php artisan db:seed`:
- Sample products with stock batches
- Sample customers
- Admin user: `admin@pharmacy.com` / `password`

---

## Currency

All monetary values are in **Tanzanian Shilling (TZS)**.
