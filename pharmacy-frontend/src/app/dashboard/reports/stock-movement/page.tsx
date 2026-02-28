'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { TrendingUp, TrendingDown, Package, Download, ArrowRightLeft } from 'lucide-react';

interface StockMovementReport {
  summary: {
    total_inbound: number;
    total_outbound: number;
    net_movement: number;
    active_products: number;
  };
  movements: Array<{
    product_name: string;
    opening_stock: number;
    inbound: number;
    outbound: number;
    closing_stock: number;
    turnover_rate: number;
  }>;
  inbound_details: Array<{
    date: string;
    product_name: string;
    quantity: number;
    type: string;
    reference: string;
  }>;
  outbound_details: Array<{
    date: string;
    product_name: string;
    quantity: number;
    type: string;
    reference: string;
  }>;
}

export default function StockMovementReportPage() {
  const [report, setReport] = useState<StockMovementReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'inbound' | 'outbound'>('summary');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const fetchStockMovementReport = async () => {
    try {
      const response = await axiosInstance.get('/reports/stock-movement', {
        params: dateRange
      });
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch stock movement report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockMovementReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const exportReport = () => {
    alert('Export functionality would generate PDF/Excel report');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Generating stock movement report...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Movement Report</h1>
            <p className="text-gray-600 mt-1">Track inventory inbound and outbound movements</p>
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
        <div className="bg-white p-4 rounded-2xl shadow-md border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-gray-500 text-sm">Total Inbound</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {(report?.summary?.total_inbound || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">units received</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="text-red-600" size={20} />
            <span className="text-gray-500 text-sm">Total Outbound</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {(report?.summary?.total_outbound || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">units sold/used</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <ArrowRightLeft className="text-blue-600" size={20} />
            <span className="text-gray-500 text-sm">Net Movement</span>
          </div>
          <p className={`text-2xl font-bold ${
            (report?.summary?.net_movement || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {(report?.summary?.net_movement ?? 0) >= 0 ? '+' : ''}
            {(report?.summary?.net_movement ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">net change</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-purple-600" size={20} />
            <span className="text-gray-500 text-sm">Active Products</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {report?.summary?.active_products || 0}
          </p>
          <p className="text-xs text-gray-600 mt-1">with movement</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Movement Summary
            </button>
            <button
              onClick={() => setActiveTab('inbound')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'inbound'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Inbound Details
            </button>
            <button
              onClick={() => setActiveTab('outbound')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'outbound'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Outbound Details
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'summary' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Opening</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Inbound</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Outbound</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Closing</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Turnover</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report?.movements && report.movements.length > 0 ? (
                    report.movements.map((movement, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{movement.product_name}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{movement.opening_stock}</td>
                        <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                          +{movement.inbound}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                          -{movement.outbound}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800">
                          {movement.closing_stock}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {movement.turnover_rate.toFixed(2)}x
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No stock movements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'inbound' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50 border-b border-green-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report?.inbound_details && report.inbound_details.length > 0 ? (
                    report.inbound_details.map((detail, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(detail.date)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{detail.product_name}</td>
                        <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                          +{detail.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{detail.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{detail.reference}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No inbound movements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'outbound' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b border-red-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report?.outbound_details && report.outbound_details.length > 0 ? (
                    report.outbound_details.map((detail, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(detail.date)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{detail.product_name}</td>
                        <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                          -{detail.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{detail.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{detail.reference}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No outbound movements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Stock Movement Insights</h4>
        <div className="text-blue-700 text-sm space-y-1">
          <p>• Turnover rate indicates how quickly inventory is moving</p>
          <p>• Higher turnover rates suggest better inventory management</p>
          <p>• Monitor slow-moving items to prevent overstocking</p>
        </div>
      </div>
    </div>
  );
}
