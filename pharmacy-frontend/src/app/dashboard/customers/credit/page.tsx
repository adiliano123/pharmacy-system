'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { CreditCard, Search, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  credit_limit: number;
  credit_used: number;
  credit_available: number;
}

interface CreditTransaction {
  id: number;
  customer_id: number;
  customer_name: string;
  amount: number;
  type: 'charge' | 'payment';
  description: string;
  created_at: string;
}

export default function CustomerCreditPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    fetchCreditData();
  }, []);

  const fetchCreditData = async () => {
    try {
      const [customersRes, transactionsRes] = await Promise.all([
        axiosInstance.get('/customers/credit'),
        axiosInstance.get('/customers/credit/transactions')
      ]);
      setCustomers(customersRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Failed to fetch credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedCustomer || !paymentAmount) return;

    try {
      await axiosInstance.post('/customers/credit/payment', {
        customer_id: selectedCustomer,
        amount: parseFloat(paymentAmount)
      });
      alert('Payment recorded successfully!');
      setShowPaymentModal(false);
      setPaymentAmount('');
      setSelectedCustomer(null);
      fetchCreditData();
    } catch (error) {
      console.error('Failed to record payment:', error);
      alert('Failed to record payment');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const totalCreditUsed = customers.reduce((sum, c) => sum + c.credit_used, 0);
  const totalCreditLimit = customers.reduce((sum, c) => sum + c.credit_limit, 0);
  const customersWithCredit = customers.filter(c => c.credit_used > 0).length;

  const getCreditStatus = (customer: Customer) => {
    const usagePercent = (customer.credit_used / customer.credit_limit) * 100;
    if (usagePercent >= 90) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' };
    if (usagePercent >= 70) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Warning' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'Good' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading credit information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Credit Management</h1>
            <p className="text-gray-600 mt-1">Track and manage customer credit accounts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-blue-600" size={20} />
            <span className="text-gray-500 text-sm">Total Credit Used</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">${totalCreditUsed.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-gray-500 text-sm">Total Credit Limit</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">${totalCreditLimit.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-orange-600" size={20} />
            <span className="text-gray-500 text-sm">Active Credit Accounts</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{customersWithCredit}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <CreditCard className="mx-auto mb-2 text-gray-400" size={48} />
                    <p>No customers found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const status = getCreditStatus(customer);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ${customer.credit_limit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ${customer.credit_used.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ${customer.credit_available.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer.id);
                            setShowPaymentModal(true);
                          }}
                          disabled={customer.credit_used === 0}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded font-medium text-sm disabled:text-gray-400 disabled:hover:bg-transparent"
                        >
                          Record Payment
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Credit Transactions</h3>
        <div className="space-y-3">
          {transactions.slice(0, 10).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{transaction.customer_name}</p>
                <p className="text-xs text-gray-600">{transaction.description}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'payment' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentAmount('');
                    setSelectedCustomer(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePayment}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Record Payment
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentAmount('');
                    setSelectedCustomer(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
