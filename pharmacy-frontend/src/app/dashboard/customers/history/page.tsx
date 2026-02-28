'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { History, Search, ShoppingCart, Calendar, DollarSign } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface PurchaseHistory {
  id: number;
  customer_id: number;
  customer_name: string;
  invoice_number: string;
  total_amount: number;
  payment_method: string;
  items_count: number;
  created_at: string;
  items: PurchaseItem[];
}

interface PurchaseItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export default function CustomerHistoryPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchPurchaseHistory(selectedCustomer);
    }
  }, [selectedCustomer]);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseHistory = async (customerId: number) => {
    try {
      const response = await axiosInstance.get(`/customers/${customerId}/purchases`);
      setPurchases(response.data);
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPurchases = purchases.filter(purchase => {
    if (dateFilter === 'all') return true;
    const purchaseDate = new Date(purchase.created_at);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return purchaseDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return purchaseDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return purchaseDate >= monthAgo;
      default:
        return true;
    }
  });

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);
  const totalSpent = filteredPurchases.reduce((sum, p) => sum + p.total_amount, 0);
  const totalPurchases = filteredPurchases.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
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
          <p>Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <History className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Purchase History</h1>
            <p className="text-gray-600 mt-1">View detailed purchase records by customer</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Customer</h3>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredCustomers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No customers found</p>
              ) : (
                filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCustomer === customer.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <p className="font-medium text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedCustomer ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Customer Selected</h3>
              <p className="text-gray-600">Select a customer from the list to view their purchase history</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedCustomerData?.name}</h3>
                    <p className="text-sm text-gray-600">{selectedCustomerData?.phone}</p>
                  </div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="text-blue-600" size={20} />
                      <span className="text-sm text-gray-600">Total Purchases</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{totalPurchases}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="text-green-600" size={20} />
                      <span className="text-sm text-gray-600">Total Spent</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchase History</h3>
                
                {filteredPurchases.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">No purchases found for this period</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPurchases.map((purchase) => (
                      <div key={purchase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-800">Invoice: {purchase.invoice_number}</p>
                            <p className="text-sm text-gray-600">{formatDate(purchase.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-800">${purchase.total_amount.toFixed(2)}</p>
                            <p className="text-sm text-gray-600 capitalize">{purchase.payment_method}</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Items ({purchase.items_count}):</p>
                          <div className="space-y-1">
                            {purchase.items?.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {item.product_name} × {item.quantity}
                                </span>
                                <span className="text-gray-600">${item.subtotal.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
