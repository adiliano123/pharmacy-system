'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Archive, Clock } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  expiringProducts: number;
  totalStockValue: number;
  recentMovements: number;
  outOfStock: number;
}

export default function StorekeeperDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    expiringProducts: 0,
    totalStockValue: 0,
    recentMovements: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/storekeeper');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">📦 Storekeeper Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here&apos;s your inventory overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900">{stats.lowStockItems || 0}</p>
              <p className="text-sm text-orange-600 mt-2">Needs reorder</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingDown className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-900">{stats.outOfStock || 0}</p>
              <p className="text-sm text-red-600 mt-2">Urgent action needed</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-3xl font-bold text-gray-900">{stats.expiringProducts || 0}</p>
              <p className="text-sm text-yellow-600 mt-2">Within 30 days</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Stock Value</p>
              <p className="text-3xl font-bold text-gray-900">
                TZS {(stats.totalStockValue || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2">Total inventory</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recent Movements</p>
              <p className="text-3xl font-bold text-gray-900">{stats.recentMovements || 0}</p>
              <p className="text-sm text-purple-600 mt-2">Last 7 days</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Archive className="text-purple-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/dashboard/products/add'}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
          >
            <Package className="mx-auto mb-2 text-blue-600" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Product</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/inventory'}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
          >
            <Archive className="mx-auto mb-2 text-green-600" size={24} />
            <span className="text-sm font-medium text-gray-900">Manage Inventory</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/reports/stock-movement'}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
          >
            <TrendingUp className="mx-auto mb-2 text-purple-600" size={24} />
            <span className="text-sm font-medium text-gray-900">Stock Report</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/reports/expiry'}
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors"
          >
            <Clock className="mx-auto mb-2 text-orange-600" size={24} />
            <span className="text-sm font-medium text-gray-900">Expiry Report</span>
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={20} />
            Low Stock Alerts
          </h3>
          <p className="text-gray-600 text-sm">
            You have {stats.lowStockItems || 0} items running low on stock. 
            <a href="/dashboard/inventory" className="text-blue-600 hover:underline ml-1">
              View details →
            </a>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="text-yellow-600" size={20} />
            Expiry Alerts
          </h3>
          <p className="text-gray-600 text-sm">
            {stats.expiringProducts || 0} products expiring within 30 days.
            <a href="/dashboard/reports/expiry" className="text-blue-600 hover:underline ml-1">
              View details →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
