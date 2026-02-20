'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';

interface CashierStats {
  today: {
    sales: number;
    transactions: number;
  };
  my_stats: {
    sales: number;
    transactions: number;
  };
  payment_methods: PaymentMethod[];
  recent_sales: Sale[];
  hourly_sales: HourlySale[];
}

interface PaymentMethod {
  payment_method: string;
  total: number;
}

interface Sale {
  id: number;
  customer?: {
    name: string;
  };
  total_amount: number;
  payment_method: string;
  created_at: string;
}

interface HourlySale {
  hour: number;
  total: number;
}

export default function CashierDashboard() {
  const [stats, setStats] = useState<CashierStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/cashier');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching cashier stats:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">🛒 Cashier Dashboard</h1>
        <p className="text-gray-600 mt-2">Today&apos;s sales and transactions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Sales"
          value={`TZS ${stats?.today?.sales?.toLocaleString() || 0}`}
          subtitle={`${stats?.today?.transactions || 0} transactions`}
          icon="💰"
          color="blue"
        />
        <StatCard
          title="My Sales"
          value={`TZS ${stats?.my_stats?.sales?.toLocaleString() || 0}`}
          subtitle={`${stats?.my_stats?.transactions || 0} transactions`}
          icon="👤"
          color="green"
        />
        <StatCard
          title="Avg Transaction"
          value={`TZS ${
            stats?.today?.transactions
              ? Math.round((stats?.today?.sales || 0) / stats.today.transactions).toLocaleString()
              : 0
          }`}
          subtitle="Per sale"
          icon="📊"
          color="purple"
        />
        <StatCard
          title="My Avg"
          value={`TZS ${
            stats?.my_stats?.transactions
              ? Math.round((stats?.my_stats?.sales || 0) / stats.my_stats.transactions).toLocaleString()
              : 0
          }`}
          subtitle="Per sale"
          icon="🎯"
          color="orange"
        />
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💳 Payment Methods (Today)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats?.payment_methods?.map((method, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium uppercase">
                    {method.payment_method}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    TZS {method.total?.toLocaleString()}
                  </p>
                </div>
                <span className="text-3xl">
                  {method.payment_method === 'cash' ? '💵' : 
                   method.payment_method === 'card' ? '💳' : 
                   method.payment_method === 'mobile' ? '📱' : '💰'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Sales Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Hourly Sales (Today)</h2>
        <div className="flex items-end justify-between h-64 gap-2">
          {Array.from({ length: 24 }, (_, i) => {
            const hourData = stats?.hourly_sales?.find(h => h.hour === i);
            const maxSale = Math.max(...(stats?.hourly_sales?.map(h => h.total) || [1]));
            const height = hourData ? (hourData.total / maxSale) * 100 : 0;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors relative group"
                     style={{ height: `${height}%`, minHeight: height > 0 ? '20px' : '0' }}>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    TZS {hourData?.total?.toLocaleString() || 0}
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{i}h</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🛒 Recent Sales (Today)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Payment</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Amount</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_sales?.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{sale.id}</td>
                  <td className="py-3 px-4">{sale.customer?.name || 'Walk-in'}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium uppercase">
                      {sale.payment_method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    TZS {sale.total_amount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600">
                    {new Date(sale.created_at).toLocaleTimeString()}
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
