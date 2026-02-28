'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { TrendingUp, Package, Users, DollarSign, AlertTriangle, ShoppingCart } from 'lucide-react';

interface DashboardStats {
  todaySales: number;
  monthlySales: number;
  totalProducts: number;
  lowStockItems: number;
  totalCustomers: number;
  expiringProducts: number;
}

interface SalesData {
  day: string;
  amount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    monthlySales: 0,
    totalProducts: 0,
    lowStockItems: 0,
    totalCustomers: 0,
    expiringProducts: 0,
  });
  const [salesData] = useState<SalesData[]>([
    { day: 'Mon', amount: 45000 },
    { day: 'Tue', amount: 52000 },
    { day: 'Wed', amount: 38000 },
    { day: 'Thu', amount: 65000 },
    { day: 'Fri', amount: 78000 },
    { day: 'Sat', amount: 92000 },
    { day: 'Sun', amount: 58000 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/admin');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxSales = Math.max(...salesData.map(d => d.amount));

  const stockStatus = [
    { label: 'In Stock', value: 65, color: 'bg-green-500' },
    { label: 'Low Stock', value: 25, color: 'bg-yellow-500' },
    { label: 'Out of Stock', value: 10, color: 'bg-red-500' },
  ];

  const profitData = [
    { label: 'Revenue', value: 60, color: 'bg-blue-500' },
    { label: 'Cost', value: 30, color: 'bg-orange-500' },
    { label: 'Profit', value: 30, color: 'bg-green-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today&apos;s Sales</p>
              <p className="text-3xl font-bold text-gray-900">
                TZS {(stats.todaySales || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2">↑ 12% from yesterday</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
              <p className="text-sm text-blue-600 mt-2">In inventory</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers || 0}</p>
              <p className="text-sm text-purple-600 mt-2">Registered</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900">{stats.lowStockItems || 0}</p>
              <p className="text-sm text-orange-600 mt-2">Needs reorder</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-3xl font-bold text-gray-900">{stats.expiringProducts || 0}</p>
              <p className="text-sm text-red-600 mt-2">Within 30 days</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Sales</p>
              <p className="text-3xl font-bold text-gray-900">
                TZS {(stats.monthlySales || 0).toLocaleString()}
              </p>
              <p className="text-sm text-indigo-600 mt-2">This month</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <TrendingUp className="text-indigo-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Sales</h2>
          <div className="space-y-4">
            {salesData.map((data) => (
              <div key={data.day} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-12">{data.day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${(data.amount / maxSales) * 100}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {data.amount >= maxSales * 0.3 && `TZS ${(data.amount / 1000).toFixed(0)}k`}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                  TZS {(data.amount / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Stock Status</h2>
          <div className="space-y-6">
            {stockStatus.map((status) => (
              <div key={status.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{status.label}</span>
                  <span className="text-sm font-bold text-gray-900">{status.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${status.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${status.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pie Chart Representation */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="163 251" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#eab308" strokeWidth="20" strokeDasharray="63 251" strokeDashoffset="-163" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="25 251" strokeDashoffset="-226" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingCart className="text-gray-400" size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Distribution */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profit Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profitData.map((item) => (
            <div key={item.label} className="text-center">
              <div className="mb-4">
                <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-200 flex items-center justify-center relative">
                  <div className={`absolute inset-0 rounded-full ${item.color} opacity-20`}></div>
                  <span className="text-3xl font-bold text-gray-900 relative z-10">{item.value}%</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
              <p className="text-sm text-gray-600 mt-1">TZS {(item.value * 10000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <Package className="mx-auto mb-2 text-blue-600" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Product</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <ShoppingCart className="mx-auto mb-2 text-green-600" size={24} />
            <span className="text-sm font-medium text-gray-900">New Sale</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <Users className="mx-auto mb-2 text-purple-600" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Customer</span>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <TrendingUp className="mx-auto mb-2 text-orange-600" size={24} />
            <span className="text-sm font-medium text-gray-900">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
