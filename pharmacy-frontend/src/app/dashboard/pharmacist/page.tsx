'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';

interface PharmacistStats {
  inventory: {
    total_products: number;
    low_stock: number;
    out_of_stock: number;
    inventory_value: number;
  };
  expiry: {
    expiring_soon: number;
    expired: number;
  };
  alerts: {
    low_stock_items: Product[];
    expiring_items: Product[];
  };
}

interface Product {
  id: number;
  name: string;
  quantity: number;
  minimum_stock: number;
  expiry_date: string;
  selling_price: number;
}

export default function PharmacistDashboard() {
  const [stats, setStats] = useState<PharmacistStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/pharmacist');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching pharmacist stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">💊 Pharmacist Dashboard</h1>
        <p className="text-gray-600 mt-2">Inventory and stock management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats?.inventory?.total_products || 0}
          subtitle="In inventory"
          icon="📦"
          color="blue"
        />
        <StatCard
          title="Inventory Value"
          value={`TZS ${stats?.inventory?.inventory_value?.toLocaleString() || 0}`}
          subtitle="Total stock value"
          icon="💰"
          color="green"
        />
        <StatCard
          title="Low Stock"
          value={stats?.inventory?.low_stock || 0}
          subtitle={`${stats?.inventory?.out_of_stock || 0} out of stock`}
          icon="⚠️"
          color="orange"
        />
        <StatCard
          title="Expiring Soon"
          value={stats?.expiry?.expiring_soon || 0}
          subtitle={`${stats?.expiry?.expired || 0} expired`}
          icon="📅"
          color="red"
        />
      </div>

      {/* Low Stock Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ Low Stock Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Current</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Minimum</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.alerts?.low_stock_items?.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {product.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {product.minimum_stock}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {product.quantity === 0 ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                        Low Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expiring Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Expiring Items (Next 30 Days)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Quantity</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Expiry Date</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Days Left</th>
              </tr>
            </thead>
            <tbody>
              {stats?.alerts?.expiring_items?.map((product) => {
                const daysLeft = Math.ceil(
                  (new Date(product.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {product.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {new Date(product.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          daysLeft <= 7
                            ? 'bg-red-100 text-red-800'
                            : daysLeft <= 14
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {daysLeft} days
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'red';
}) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className={`bg-linear-to-br ${colors[color]} text-white rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-white/80 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-white/70 text-sm mt-1">{subtitle}</p>
    </div>
  );
}
