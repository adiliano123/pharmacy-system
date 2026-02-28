// Product Types
export interface Product {
  id: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  totalStock?: number;
  expirySoon?: number;
  reorderLevel?: number;
  stockBatches?: StockBatch[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductInput {
  name: string;
  category: string;
  description?: string;
  price: number;
}

export interface UpdateProductInput {
  name?: string;
  category?: string;
  description?: string;
  price?: number;
}

// Stock Batch Types
export interface StockBatch {
  id: number;
  product_id: number;
  quantity: number;
  expiry_date: string;
  batch_number: string;
  supplier?: string;
  product?: Product;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStockBatchInput {
  product_id: number;
  quantity: number;
  expiry_date: string;
  batch_number: string;
  supplier?: string;
}

export interface UpdateStockBatchInput {
  quantity?: number;
  expiry_date?: string;
  batch_number?: string;
  supplier?: string;
}

// Sale Types
export interface Sale {
  id: number;
  customer_id?: number;
  user_id: number;
  total_amount: number;
  invoiceNo?: string;
  customer?: Customer;
  user?: User;
  items?: SaleItem[];
  date?: string;
  status?: "paid" | "pending" | "overdue";
  created_at?: string;
  updated_at?: string;
}

export interface CreateSaleInput {
  customer_id?: number;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

// Sale Item Types
export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: Product;
  created_at?: string;
  updated_at?: string;
}

// Customer Types
export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  creditLimit?: number;
  balance?: number;
  sales?: Sale[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// User Types
export type UserRole = "admin" | "pharmacist" | "cashier" | "store_manager" | "auditor" | "storekeeper";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

// Role Permissions
export interface RolePermissions {
  canViewInventory: boolean;
  canEditInventory: boolean;
  canViewSales: boolean;
  canCreateSales: boolean;
  canViewCustomers: boolean;
  canEditCustomers: boolean;
  canViewReports: boolean;
  canViewCompliance: boolean;
  canEditCompliance: boolean;
  canViewSettings: boolean;
  canEditSettings: boolean;
}

// API Response Types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
}

export interface SalesReportResponse {
  sales: Sale[];
  summary: {
    total_sales: number;
    total_revenue: number;
    average_sale: number;
  };
}

export interface SalesReportParams {
  start_date?: string;
  end_date?: string;
}

export interface AuditTrailParams {
  start_date?: string;
  end_date?: string;
  user_id?: number;
}

export interface InventoryReportItem {
  id: number;
  name: string;
  category: string;
  total_stock: number;
  expiring_soon: number;
  status: 'low' | 'adequate';
}

export interface ComplianceReport {
  expired_stock: number;
  low_stock_items: number;
  total_sales_today: number;
  total_revenue_today: number;
  expiring_in_30_days: number;
}
