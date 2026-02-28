'use client';

import Link from 'next/link';
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      title: 'Sales Report',
      description: 'View detailed sales analytics and revenue trends',
      icon: DollarSign,
      href: '/dashboard/reports/sales',
      color: 'bg-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Profit & Loss',
      description: 'Analyze profit margins and financial performance',
      icon: TrendingUp,
      href: '/dashboard/reports/profit-loss',
      color: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Stock Movement',
      description: 'Track inventory changes and stock flow',
      icon: Package,
      href: '/dashboard/reports/stock-movement',
      color: 'bg-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Expiry Report',
      description: 'Monitor expired and expiring products',
      icon: AlertTriangle,
      href: '/dashboard/reports/expiry',
      color: 'bg-orange-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📊 Reports</h1>
        <p className="text-gray-600 mt-2">Access comprehensive business reports and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.href}
              href={report.href}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className={`${report.iconBg} p-3 rounded-xl`}>
                  <Icon className={report.iconColor} size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-gray-600 text-sm">{report.description}</p>
                  <div className="mt-4">
                    <span className="text-blue-600 font-medium text-sm hover:text-blue-700">
                      View Report →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Today&apos;s Sales</p>
            <p className="text-2xl font-bold text-green-600">TZS 0</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Monthly Profit</p>
            <p className="text-2xl font-bold text-blue-600">TZS 0</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Stock Value</p>
            <p className="text-2xl font-bold text-purple-600">TZS 0</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
            <p className="text-2xl font-bold text-orange-600">0 Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}
