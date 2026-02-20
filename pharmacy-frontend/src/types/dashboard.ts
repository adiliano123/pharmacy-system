// Dashboard Types

export interface AdminStats {
  sales: {
    total: number;
    today: number;
    month: number;
  };
  transactions: {
    total: number;
    today: number;
  };
  users: {
    total: number;
    active: number;
  };
  products: {
    total: number;
    low_stock: number;
    expiring: number;
  };
  customers: {
    total: number;
  };
  top_products: TopProduct[];
  recent_sales: Sale[];
}

export interface TopProduct {
  name: string;
  total_sold: number;
}

export interface Sale {
  id: number;
  customer?: Customer;
  total_amount: number;
  payment_method: string;
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export interface AlertCardProps {
  title: string;
  count: number;
  icon: string;
  color: 'yellow' | 'red';
}
