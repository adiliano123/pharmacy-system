'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { AlertTriangle, Calendar, TrendingDown, Download, FileText } from 'lucide-react';

interface ExpiryReport {
  expired: ExpiryItem[];
  expiring_7_days: ExpiryItem[];
  expiring_30_days: ExpiryItem[];
  expiring_90_days: ExpiryItem[];
  summary: {
    total_expired_value: number;
    total_expiring_value: number;
    total_items_at_risk: number;
  };
}

interface ExpiryItem {
  product_name: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  cost_value: number;
  days_until_expiry: number;
}

export default function ExpiryReportPage() {
  const [report, setReport] = useState<ExpiryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const fetchExpiryReport = async () => {
    try {
      const response = await axiosInstance.get('/reports/expiry', {
        params: dateRange
      });
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch expiry report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiryReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportReport = () => {
    alert('Export functionality would generate PDF/Excel report');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Generating expiry report...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-orange-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expiry Report</h1>
            <p className="text-gray-600 mt-1">Comprehensive analysis of expiring inventory</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="text-red-600" size={20} />
            <span className="text-gray-500 text-sm">Expired Value</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            ${(report?.summary?.total_expired_value || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-orange-600" size={20} />
            <span className="text-gray-500 text-sm">Expiring Value</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            ${(report?.summary?.total_expiring_value || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-gray-600" size={20} />
            <span className="text-gray-500 text-sm">Items at Risk</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {report?.summary?.total_items_at_risk || 0}
          </p>
        </div>
      </div>

      {report?.expired && report.expired.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Expired Products ({report?.expired?.length || 0})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50 border-b border-red-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Batch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Expired Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Value Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.expired.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{item.product_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.batch_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(item.expiry_date)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">${item.cost_value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-red-600" />
            Expiring in 7 Days ({report?.expiring_7_days?.length || 0})
          </h3>
          {report?.expiring_7_days && report.expiring_7_days.length > 0 ? (
            <div className="space-y-2">
              {report.expiring_7_days.map((item, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{item.product_name}</p>
                      <p className="text-xs text-gray-600">Batch: {item.batch_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">{item.days_until_expiry} days</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No items expiring in 7 days</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-orange-600" />
            Expiring in 30 Days ({report?.expiring_30_days?.length || 0})
          </h3>
          {report?.expiring_30_days && report.expiring_30_days.length > 0 ? (
            <div className="space-y-2">
              {report.expiring_30_days.slice(0, 5).map((item, index) => (
                <div key={index} className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{item.product_name}</p>
                      <p className="text-xs text-gray-600">Batch: {item.batch_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">{item.days_until_expiry} days</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
              {report.expiring_30_days.length > 5 && (
                <p className="text-center text-sm text-gray-600 pt-2">
                  +{report.expiring_30_days.length - 5} more items
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No items expiring in 30 days</p>
          )}
        </div>
      </div>
    </div>
  );
}
