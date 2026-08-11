'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { axiosInstance } from '@/lib/api';
import { TrendingUp, Package, AlertTriangle, DollarSign, ArrowRight } from 'lucide-react';

interface QuickStats {
  todaySales: number;
  monthlySales: number;
  stockValue: number;
  expiringSoon: number;
}

export default function ReportsPage() {
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    axiosInstance.get('/dashboard/admin')
      .then(res => {
        const d = res.data;
        setQuickStats({
          todaySales: d.todaySales ?? 0,
          monthlySales: d.monthlySales ?? 0,
          stockValue: d.stockValue ?? 0,
          expiringSoon: d.expiringProducts ?? 0,
        });
      })
      .catch(() => setQuickStats(null))
      .finally(() => setLoadingStats(false));
  }, []);
  const reports = [
    {
      title: 'Sales Report',
      emoji: '💰',
      description: 'View detailed sales analytics, revenue trends, and top-selling products',
      icon: DollarSign,
      href: '/dashboard/reports/sales',
      borderColor: 'border-t-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      badgeColor: 'bg-green-50 text-green-700',
      badge: 'Revenue',
    },
    {
      title: 'Profit & Loss',
      emoji: '📊',
      description: 'Analyze profit margins, cost breakdowns, and financial performance over time',
      icon: TrendingUp,
      href: '/dashboard/reports/profit-loss',
      borderColor: 'border-t-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700',
      badge: 'Finance',
    },
    {
      title: 'Stock Movement',
      emoji: '📦',
      description: 'Track inventory changes, stock flow, purchases, and dispensing history',
      icon: Package,
      href: '/dashboard/reports/stock-movement',
      borderColor: 'border-t-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badgeColor: 'bg-purple-50 text-purple-700',
      badge: 'Inventory',
    },
    {
      title: 'Expiry Report',
      emoji: '⚠️',
      description: 'Monitor expired and expiring products to reduce waste and ensure compliance',
      icon: AlertTriangle,
      href: '/dashboard/reports/expiry',
      borderColor: 'border-t-orange-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      badgeColor: 'bg-orange-50 text-orange-700',
      badge: 'Compliance',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📊 Reports</h1>
        <p className="text-gray-500 mt-2">Access comprehensive business reports and analytics</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.href}
              href={report.href}
              className={`group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 border-t-4 ${report.borderColor} flex flex-col`}
            >
              <div className="p-6 flex-1">
                {/* Top row — icon + badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`${report.iconBg} p-3 rounded-xl`}>
                    <Icon className={report.iconColor} size={28} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${report.badgeColor}`}>
                    {report.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  <span className="mr-2">{report.emoji}</span>
                  {report.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">{report.description}</p>
              </div>

              {/* Footer CTA */}
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-600 transition-colors">
                  View Report
                </span>
                <ArrowRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Overview</h2>
        {loadingStats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-100 rounded-xl animate-pulse h-16" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Today&apos;s Sales</p>
              <p className="text-2xl font-bold text-green-600">
                TZS {(quickStats?.todaySales ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Monthly Sales</p>
              <p className="text-2xl font-bold text-blue-600">
                TZS {(quickStats?.monthlySales ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Stock Value</p>
              <p className="text-2xl font-bold text-purple-600">
                TZS {(quickStats?.stockValue ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">
                {quickStats?.expiringSoon ?? 0} Items
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
