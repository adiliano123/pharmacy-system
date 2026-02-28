'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { DollarSign, TrendingUp, TrendingDown, Download, BarChart3 } from 'lucide-react';

interface ProfitLossReport {
  period: {
    from: string;
    to: string;
  };
  revenue: {
    total_sales: number;
    total_transactions: number;
    average_transaction: number;
  };
  costs: {
    cost_of_goods_sold: number;
    operating_expenses: number;
    total_costs: number;
  };
  profit: {
    gross_profit: number;
    gross_margin_percentage: number;
    net_profit: number;
    net_margin_percentage: number;
  };
  breakdown: {
    daily: Array<{
      date: string;
      revenue: number;
      costs: number;
      profit: number;
    }>;
    by_category: Array<{
      category: string;
      revenue: number;
      cost: number;
      profit: number;
      margin: number;
    }>;
  };
}

export default function ProfitLossReportPage() {
  const [report, setReport] = useState<ProfitLossReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const fetchProfitLossReport = async () => {
    try {
      const response = await axiosInstance.get('/reports/profit-loss', {
        params: dateRange
      });
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch profit-loss report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitLossReport();
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
          <p>Generating profit & loss report...</p>
        </div>
      </div>
    );
  }

  const isProfit = (report?.profit.net_profit || 0) >= 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profit & Loss Report</h1>
            <p className="text-gray-600 mt-1">Financial performance analysis</p>
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
            <span className="text-gray-500 text-sm">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${(report?.revenue?.total_sales || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {report?.revenue?.total_transactions || 0} transactions
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="text-red-600" size={20} />
            <span className="text-gray-500 text-sm">Total Costs</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${(report?.costs?.total_costs || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            COGS + Operating
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-600" size={20} />
            <span className="text-gray-500 text-sm">Gross Profit</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${(report?.profit?.gross_profit || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {(report?.profit?.gross_margin_percentage || 0).toFixed(1)}% margin
          </p>
        </div>
        <div className={`bg-white p-4 rounded-2xl shadow-md border ${isProfit ? 'border-green-200' : 'border-red-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            {isProfit ? (
              <TrendingUp className="text-green-600" size={20} />
            ) : (
              <TrendingDown className="text-red-600" size={20} />
            )}
            <span className="text-gray-500 text-sm">Net Profit</span>
          </div>
          <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            ${(report?.profit?.net_profit || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {(report?.profit?.net_margin_percentage || 0).toFixed(1)}% margin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Total Sales</span>
              <span className="font-semibold text-green-600">
                ${(report?.revenue?.total_sales || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Average Transaction</span>
              <span className="font-semibold text-gray-800">
                ${(report?.revenue?.average_transaction || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Transactions</span>
              <span className="font-semibold text-gray-800">
                {report?.revenue.total_transactions || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">Cost of Goods Sold</span>
              <span className="font-semibold text-red-600">
                ${(report?.costs?.cost_of_goods_sold || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Operating Expenses</span>
              <span className="font-semibold text-gray-800">
                ${(report?.costs?.operating_expenses || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Costs</span>
              <span className="font-semibold text-gray-800">
                ${(report?.costs?.total_costs || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {report?.breakdown.by_category && report.breakdown.by_category.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit by Category</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Cost</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Profit</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.breakdown.by_category.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-800">${Number(item.revenue).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">${Number(item.cost).toFixed(2)}</td>
                    <td className={`px-4 py-3 text-sm text-right font-semibold ${
                      Number(item.profit) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Number(item.profit).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-800">{Number(item.margin).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Financial Summary</h4>
        <div className="text-blue-700 text-sm space-y-1">
          <p>• Gross Profit Margin: {report?.profit.gross_margin_percentage.toFixed(2)}%</p>
          <p>• Net Profit Margin: {report?.profit.net_margin_percentage.toFixed(2)}%</p>
          <p>• {isProfit ? 'Business is profitable' : 'Business is operating at a loss'}</p>
        </div>
      </div>
    </div>
  );
}
