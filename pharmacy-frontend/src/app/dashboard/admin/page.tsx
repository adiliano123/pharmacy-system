'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { AdminStats } from '@/types/dashboard';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/admin');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">👑 Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your pharmacy operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value={`TZS ${stats?.sales?.total?.toLocaleString() || 0}`}
          subtitle={`Today: TZS ${stats?.sales?.today?.toLocaleString() || 0}`}
          icon="💰"
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={stats?.products?.total || 0}
          subtitle={`${stats?.products?.low_stock || 0} low stock`}
          icon="💊"
          color="green"
        />
        <StatCard
          title="Total Customers"
          value={stats?.customers?.total || 0}
          subtitle="Registered customers"
          icon="👥"
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={stats?.users?.total || 0}
          subtitle={`${stats?.users?.active || 0} active`}
          icon="👤"
          color="orange"
        />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AlertCard
          title="Low Stock Alert"
          count={stats?.products?.low_stock || 0}
          icon="⚠️"
          color="yellow"
        />
        <AlertCard
          title="Expiring Soon"
          count={stats?.products?.expiring || 0}
          icon="📅"
          color="red"
        />
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Sold</th>
              </tr>
            </thead>
            <tbody>
              {stats?.top_products?.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4 text-right font-semibold">{product.total_sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🛒 Recent Sales</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Amount</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_sales?.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{sale.id}</td>
                  <td className="py-3 px-4">{sale.customer?.name || 'Walk-in'}</td>
                  <td className="py-3 px-4 text-right font-semibold">
                    TZS {sale.total_amount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600">
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
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
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
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

function AlertCard({ title, count, icon, color }: {
  title: string;
  count: number;
  icon: string;
  color: 'yellow' | 'red';
}) {
  const colors = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`${colors[color]} border-2 rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-3xl font-bold mt-2">{count}</p>
        </div>
        <span className="text-5xl">{icon}</span>
      </div>
    </div>
  );
}
