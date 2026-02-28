'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { ShoppingCart, TrendingUp, Users, Download, DollarSign } from 'lucide-react';

interface SalesReport {
  summary: {
    total_sales: number;
    total_transactions: number;
    average_transaction: number;
    total_items_sold: number;
  };
  top_products: Array<{
    product_name: string;
    quantity_sold: number;
    revenue: number;
    transactions: number;
  }>;
  payment_methods: Array<{
    method: string;
    count: number;
    total: number;
    percentage: number;
  }>;
  daily_sales: Array<{
    date: string;
    sales: number;
    transactions: number;
  }>;
  hourly_distribution: Array<{
    hour: number;
    sales: number;
    transactions: number;
  }>;
}

export default function SalesReportPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const fetchSalesReport = async () => {
    try {
      const response = await axiosInstance.get('/reports/sales', {
        params: dateRange
      });
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const exportReport = () => {
    alert('Export functionality would generate PDF/Excel report');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Generating sales report...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
            <p className="text-gray-600 mt-1">Comprehensive sales performance analysis</p>
          </div>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-gray-500 text-sm">Total Sales</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${(report?.summary?.total_sales || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="text-blue-600" size={20} />
            <span className="text-gray-500 text-sm">Transactions</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {report?.summary?.total_transactions || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-purple-600" size={20} />
            <span className="text-gray-500 text-sm">Avg Transaction</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${(report?.summary?.average_transaction || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-orange-600" size={20} />
            <span className="text-gray-500 text-sm">Items Sold</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {report?.summary?.total_items_sold || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
          {report?.top_products && report.top_products.length > 0 ? (
            <div className="space-y-3">
              {report.top_products.slice(0, 10).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{product.product_name}</p>
                      <p className="text-xs text-gray-600">{product.quantity_sold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${product.revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{product.transactions} sales</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No sales data available</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
          {report?.payment_methods && report.payment_methods.length > 0 ? (
            <div className="space-y-4">
              {report.payment_methods.map((method, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{method.method}</span>
                    <span className="text-sm font-semibold text-gray-800">${method.total.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-600">{method.count} transactions</span>
                    <span className="text-xs text-gray-600">{method.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No payment data available</p>
          )}
        </div>
      </div>

      {report?.daily_sales && report.daily_sales.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Sales Trend</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Sales</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Transactions</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Avg/Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.daily_sales.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800">
                      ${day.sales.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {day.transactions}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      ${(day.sales / day.transactions).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {report?.hourly_distribution && report.hourly_distribution.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Hour</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {report.hourly_distribution.map((hour, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">
                  {hour.hour}:00 - {hour.hour + 1}:00
                </p>
                <p className="text-sm font-semibold text-gray-800">${hour.sales.toFixed(0)}</p>
                <p className="text-xs text-gray-600">{hour.transactions} sales</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
