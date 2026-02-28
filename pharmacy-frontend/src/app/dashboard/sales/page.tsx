'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';

interface Customer {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

interface SaleItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
  };
}

interface Sale {
  id: number;
  customer_id: number;
  user_id: number;
  total_amount: number;
  payment_method: string;
  created_at: string;
  customer?: Customer;
  user?: User;
  items?: SaleItem[];
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales, searchTerm, paymentFilter, dateFrom, dateTo]);

  const fetchSales = async () => {
    try {
      const response = await axiosInstance.get('/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sales];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.id.toString().includes(searchTerm) ||
        sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Payment method filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(sale => sale.payment_method === paymentFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(sale => 
        new Date(sale.created_at) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(sale => 
        new Date(sale.created_at) <= endDate
      );
    }

    setFilteredSales(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPaymentFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const getTotalAmount = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0);
  };

  const exportToCSV = () => {
    const headers = ['Sale ID', 'Date', 'Customer', 'Cashier', 'Payment Method', 'Amount'];
    const rows = filteredSales.map(sale => [
      sale.id,
      new Date(sale.created_at).toLocaleString(),
      sale.customer?.name || 'Walk-in Customer',
      sale.user?.name || 'N/A',
      sale.payment_method,
      sale.total_amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const viewSaleDetails = async (saleId: number) => {
    try {
      const response = await axiosInstance.get(`/sales/${saleId}`);
      setSelectedSale(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching sale details:', error);
      alert('Failed to load sale details');
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'mobile':
        return '📱';
      default:
        return '💰';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading sales...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📊 Sales History</h1>
        <p className="text-gray-600 mt-2">View all transactions and sales records</p>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Sale ID</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date & Time</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Cashier</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Payment</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Amount</th>
                <th className="text-center py-3 px-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900">#{sale.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(sale.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {sale.customer?.name || 'Walk-in Customer'}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sale.user?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {sale.user?.role || ''}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {getPaymentMethodIcon(sale.payment_method)}
                      {sale.payment_method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    TZS {sale.total_amount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => viewSaleDetails(sale.id)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded font-medium text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No sales found</p>
            <p className="text-sm mt-2">Sales will appear here once transactions are made</p>
          </div>
        )}
      </div>

      {/* Sale Details Modal */}
      {showDetails && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sale Details #{selectedSale.id}</h2>
                  <p className="text-gray-600 mt-1">
                    {new Date(selectedSale.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Sale Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Customer</label>
                  <p className="text-gray-900 font-semibold">
                    {selectedSale.customer?.name || 'Walk-in Customer'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cashier</label>
                  <p className="text-gray-900 font-semibold">
                    {selectedSale.user?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {getPaymentMethodIcon(selectedSale.payment_method)}
                    {selectedSale.payment_method}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Total Amount</label>
                  <p className="text-2xl font-bold text-gray-900">
                    TZS {selectedSale.total_amount?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Items Sold</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Product</th>
                        <th className="text-right py-2 px-4 text-sm font-semibold text-gray-600">Price</th>
                        <th className="text-right py-2 px-4 text-sm font-semibold text-gray-600">Qty</th>
                        <th className="text-right py-2 px-4 text-sm font-semibold text-gray-600">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSale.items?.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-2 px-4">{item.product.name}</td>
                          <td className="py-2 px-4 text-right">TZS {item.price.toLocaleString()}</td>
                          <td className="py-2 px-4 text-right">{item.quantity}</td>
                          <td className="py-2 px-4 text-right font-semibold">
                            TZS {item.subtotal.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2">
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-right font-bold">Total:</td>
                        <td className="py-3 px-4 text-right font-bold text-lg">
                          TZS {selectedSale.total_amount?.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
