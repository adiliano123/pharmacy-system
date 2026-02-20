# Role-Based Access Control (RBAC)

## Available Roles

### 1. Admin
**Full system access**
- ✅ View & Edit Inventory
- ✅ View & Create Sales
- ✅ View & Edit Customers
- ✅ View Reports
- ✅ View & Edit Compliance
- ✅ View & Edit Settings

### 2. Pharmacist
**Manage inventory and sales**
- ✅ View & Edit Inventory
- ✅ View & Create Sales
- ✅ View Customers (read-only)
- ✅ View Reports
- ✅ View Compliance (read-only)
- ❌ Settings

### 3. Cashier
**Process sales only**
- ✅ View Inventory (read-only)
- ✅ View & Create Sales
- ✅ View Customers (read-only)
- ❌ Reports
- ❌ Compliance
- ❌ Settings

### 4. Store Manager
**Manage store operations**
- ✅ View & Edit Inventory
- ✅ View & Create Sales
- ✅ View & Edit Customers
- ✅ View Reports
- ✅ View Compliance (read-only)
- ✅ View Settings (read-only)

### 5. Auditor
**View and audit compliance**
- ✅ View Inventory (read-only)
- ✅ View Sales (read-only)
- ✅ View Customers (read-only)
- ✅ View Reports
- ✅ View & Edit Compliance
- ❌ Settings

## Demo Login Credentials

Use these emails on the login page for quick role testing:

- **Admin**: admin@pharmacy.co.tz
- **Pharmacist**: pharmacist@pharmacy.co.tz
- **Cashier**: cashier@pharmacy.co.tz
- **Store Manager**: manager@pharmacy.co.tz
- **Auditor**: auditor@pharmacy.co.tz

Password: any (demo mode)

## Implementation

### Components
- `useAuth` hook - Access current user and permissions
- `ProtectedRoute` component - Wrap features requiring specific permissions
- `rolePermissions` - Permission configuration in `src/lib/auth.ts`

### Usage Example

```tsx
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function MyComponent() {
  const { hasPermission, user } = useAuth();

  return (
    <div>
      {hasPermission("canEditInventory") && (
        <button>Add Product</button>
      )}
      
      <ProtectedRoute permission="canViewReports">
        <ReportsSection />
      </ProtectedRoute>
    </div>
  );
}
```
