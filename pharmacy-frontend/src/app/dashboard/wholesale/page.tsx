'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { Users, ShoppingCart, Clock, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface WholesaleStats {
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  overdueOrders: number;
  totalRevenue: number;
  outstandingBalance: number;
}

export default function WholesalePage() {
  const [stats, setStats] = useState<WholesaleStats>({
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    overdueOrders: 0,
    totalRevenue: 0,
    outstandingBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/wholesale/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch wholesale stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading wholesale dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏢 Wholesale Management</h1>
          <p className="text-gray-600 mt-2">Manage wholesale customers and bulk orders</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/wholesale/customers/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Customer
          </Link>
          <Link
            href="/dashboard/wholesale/orders/new"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + New Order
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className="text-sm text-blue-600 mt-2">Wholesale accounts</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-sm text-green-600 mt-2">All time</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingCart className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-sm text-orange-600 mt-2">Awaiting payment</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overdue Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overdueOrders}</p>
              <p className="text-sm text-red-600 mt-2">Past due date</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                TZS {stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 mt-2">Paid orders</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                TZS {stats.outstandingBalance.toLocaleString()}
              </p>
              <p className="text-sm text-yellow-600 mt-2">To be collected</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/wholesale/customers"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Manage Customers</p>
                  <p className="text-sm text-gray-600">View and edit wholesale customers</p>
                </div>
              </div>
            </Link>
            <Link
              href="/dashboard/wholesale/orders"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">View Orders</p>
                  <p className="text-sm text-gray-600">Track all wholesale orders</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="text-orange-600" size={20} />
            Alerts & Notifications
          </h3>
          <div className="space-y-3">
            {stats.overdueOrders > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <span className="font-semibold">{stats.overdueOrders}</span> orders are overdue.
                  <Link href="/dashboard/wholesale/orders?status=overdue" className="text-red-600 hover:underline ml-1">
                    View →
                  </Link>
                </p>
              </div>
            )}
            {stats.pendingOrders > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <span className="font-semibold">{stats.pendingOrders}</span> orders pending payment.
                  <Link href="/dashboard/wholesale/orders?status=pending" className="text-orange-600 hover:underline ml-1">
                    View →
                  </Link>
                </p>
              </div>
            )}
            {stats.overdueOrders === 0 && stats.pendingOrders === 0 && (
              <p className="text-sm text-gray-600">No alerts at this time. All orders are up to date!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
