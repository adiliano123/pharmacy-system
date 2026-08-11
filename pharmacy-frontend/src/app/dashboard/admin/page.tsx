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

interface StockStatusData {
  label: string;
  value: number;
  color: string;
  dashArray: string;
  dashOffset: string;
  stroke: string;
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
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [stockStatus, setStockStatus] = useState<StockStatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/admin');
      const data = response.data;
      setStats(data);

      // Build weekly sales from API data if available, else empty
      if (data.weeklySales && Array.isArray(data.weeklySales)) {
        setSalesData(data.weeklySales);
      } else {
        setSalesData([]);
      }

      // Calculate stock status percentages from real counts
      const total = (data.totalProducts || 0);
      if (total > 0) {
        const outCount = data.outOfStock || 0;
        const lowCount = (data.lowStockItems || 0) - outCount;
        const inCount = total - (data.lowStockItems || 0);
        const inPct = Math.round((inCount / total) * 100);
        const lowPct = Math.round((lowCount / total) * 100);
        const outPct = 100 - inPct - lowPct;
        const circumference = 251;
        setStockStatus([
          { label: 'In Stock', value: inPct, color: 'bg-green-500', stroke: '#10b981', dashArray: `${(inPct / 100) * circumference} ${circumference}`, dashOffset: '0' },
          { label: 'Low Stock', value: lowPct, color: 'bg-yellow-500', stroke: '#eab308', dashArray: `${(lowPct / 100) * circumference} ${circumference}`, dashOffset: `-${(inPct / 100) * circumference}` },
          { label: 'Out of Stock', value: outPct, color: 'bg-red-500', stroke: '#ef4444', dashArray: `${(outPct / 100) * circumference} ${circumference}`, dashOffset: `-${((inPct + lowPct) / 100) * circumference}` },
        ]);
      } else {
        setStockStatus([]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxSales = salesData.length > 0 ? Math.max(...salesData.map(d => d.amount)) : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
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
              <p className="text-sm text-green-600 mt-2">Current day total</p>
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
          {salesData.length > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <TrendingUp size={40} className="mb-3 opacity-40" />
              <p className="text-sm">No sales data for this week yet</p>
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Stock Status</h2>
          {stockStatus.length > 0 ? (
            <>
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
              <div className="mt-8 flex justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90" style={{ overflow: 'visible' }}>
                    {stockStatus.map((s) => (
                      <circle key={s.label} cx="50" cy="50" r="40" fill="none" stroke={s.stroke} strokeWidth="20"
                        strokeDasharray={s.dashArray} strokeDashoffset={s.dashOffset} />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingCart className="text-gray-400" size={32} />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-sm">
                {stockStatus.map((s) => (
                  <span key={s.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: s.stroke }}></span>
                    {s.label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Package size={40} className="mb-3 opacity-40" />
              <p className="text-sm">No inventory data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors" onClick={() => window.location.href='/dashboard/products/add'}>
            <Package className="mx-auto mb-2 text-blue-600" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Product</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors" onClick={() => window.location.href='/dashboard/pos'}>
            <ShoppingCart className="mx-auto mb-2 text-green-600" size={24} />
            <span className="text-sm font-medium text-gray-900">New Sale</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors" onClick={() => window.location.href='/dashboard/customers/add'}>
            <Users className="mx-auto mb-2 text-purple-600" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Customer</span>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors" onClick={() => window.location.href='/dashboard/reports'}>
            <TrendingUp className="mx-auto mb-2 text-orange-600" size={24} />
            <span className="text-sm font-medium text-gray-900">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}