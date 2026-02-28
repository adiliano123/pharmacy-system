'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { AlertTriangle, Calendar, Package, Download } from 'lucide-react';

interface ExpiringBatch {
  id: number;
  product_id: number;
  product_name: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  supplier: string;
  days_until_expiry: number;
  cost_value: number;
}

export default function ExpiryPage() {
  const [batches, setBatches] = useState<ExpiringBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState('90');

  useEffect(() => {
    const fetchExpiringBatches = async () => {
      try {
        const response = await axiosInstance.get(`/inventory/expiry?days=${filterDays}`);
        setBatches(response.data);
      } catch (error) {
        console.error('Failed to fetch expiring batches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringBatches();
  }, [filterDays]);

  const getExpiryStatus = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800', priority: 'critical' };
    } else if (daysUntilExpiry <= 7) {
      return { label: 'Critical', color: 'bg-red-100 text-red-800', priority: 'critical' };
    } else if (daysUntilExpiry <= 30) {
      return { label: 'Urgent', color: 'bg-orange-100 text-orange-800', priority: 'urgent' };
    } else if (daysUntilExpiry <= 60) {
      return { label: 'Warning', color: 'bg-yellow-100 text-yellow-800', priority: 'warning' };
    }
    return { label: 'Monitor', color: 'bg-blue-100 text-blue-800', priority: 'monitor' };
  };

  const expiredBatches = batches.filter(b => b.days_until_expiry < 0);
  const criticalBatches = batches.filter(b => b.days_until_expiry >= 0 && b.days_until_expiry <= 7);
  const urgentBatches = batches.filter(b => b.days_until_expiry > 7 && b.days_until_expiry <= 30);

  const totalValue = batches.reduce((sum, b) => sum + b.cost_value, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading expiry data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Expiry Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage expiring inventory</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-red-600" size={20} />
            <span className="text-gray-500 text-sm">Expired</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{expiredBatches.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-red-600" size={20} />
            <span className="text-gray-500 text-sm">Critical (≤7 days)</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{criticalBatches.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-orange-600" size={20} />
            <span className="text-gray-500 text-sm">Urgent (≤30 days)</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{urgentBatches.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-gray-600" size={20} />
            <span className="text-gray-500 text-sm">Total Value at Risk</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filter by Days Until Expiry</h3>
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="30">Next 30 Days</option>
            <option value="60">Next 60 Days</option>
            <option value="90">Next 90 Days</option>
            <option value="180">Next 6 Months</option>
            <option value="365">Next Year</option>
          </select>
        </div>
      </div>

      {expiredBatches.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="text-red-600 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Expired Products - Immediate Action Required</h3>
              <p className="text-red-700 text-sm">These products have already expired and must be removed from inventory</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-100 border-b border-red-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase">Batch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase">Expired Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase">Days Overdue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase">Value Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-200">
                {expiredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-red-100 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{batch.product_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{batch.batch_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{batch.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(batch.expiry_date)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">
                      {Math.abs(batch.days_until_expiry)} days
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">
                      ${batch.cost_value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Expiries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.filter(b => b.days_until_expiry >= 0).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <Calendar className="mx-auto mb-2 text-gray-400" size={48} />
                    <p>No expiring batches found in this period</p>
                  </td>
                </tr>
              ) : (
                batches
                  .filter(b => b.days_until_expiry >= 0)
                  .sort((a, b) => a.days_until_expiry - b.days_until_expiry)
                  .map((batch) => {
                    const status = getExpiryStatus(batch.days_until_expiry);
                    return (
                      <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {batch.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {batch.batch_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {batch.supplier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {batch.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(batch.expiry_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                          {batch.days_until_expiry} days
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${batch.cost_value.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-600 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-yellow-800">Expiry Management Tips</h4>
            <ul className="text-yellow-700 text-sm mt-2 space-y-1">
              <li>• Implement FEFO (First Expired, First Out) rotation system</li>
              <li>• Consider discounting products expiring within 30 days</li>
              <li>• Contact suppliers for return policies on near-expiry items</li>
              <li>• Document all expired product disposals for compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
