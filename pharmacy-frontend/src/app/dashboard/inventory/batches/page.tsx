'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { Package, Search, Filter, Edit, Trash2 } from 'lucide-react';

interface Batch {
  id: number;
  product_id: number;
  product_name: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  supplier: string;
  cost_price: number;
  selling_price: number;
  created_at: string;
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axiosInstance.get('/inventory/batches');
      setBatches(response.data);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;

    try {
      await axiosInstance.delete(`/inventory/batches/${id}`);
      alert('Batch deleted successfully!');
      fetchBatches();
    } catch (error) {
      console.error('Failed to delete batch:', error);
      alert('Failed to delete batch');
    }
  };

  const getBatchStatus = (batch: Batch) => {
    const expiryDate = new Date(batch.expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpiry <= 30) return { label: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' };
    if (batch.quantity === 0) return { label: 'Out of Stock', color: 'bg-gray-100 text-gray-800' };
    if (batch.quantity < 10) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    const status = getBatchStatus(batch);
    return status.label.toLowerCase().replace(' ', '-') === filterStatus;
  });

  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => getBatchStatus(b).label === 'Active').length;
  const expiringBatches = batches.filter(b => getBatchStatus(b).label === 'Expiring Soon').length;
  const expiredBatches = batches.filter(b => getBatchStatus(b).label === 'Expired').length;

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
          <p>Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Batch Management</h1>
            <p className="text-gray-600 mt-1">Track and manage inventory batches</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-blue-600" size={20} />
            <span className="text-gray-500 text-sm">Total Batches</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalBatches}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 rounded-full bg-green-500"></div>
            <span className="text-gray-500 text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{activeBatches}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
            <span className="text-gray-500 text-sm">Expiring Soon</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{expiringBatches}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 rounded-full bg-red-500"></div>
            <span className="text-gray-500 text-sm">Expired</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{expiredBatches}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by product, batch number, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Batches</option>
              <option value="active">Active</option>
              <option value="expiring-soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
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
                  Cost Price
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
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <Package className="mx-auto mb-2 text-gray-400" size={48} />
                    <p>No batches found</p>
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => {
                  const status = getBatchStatus(batch);
                  return (
                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {batch.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {batch.batch_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {batch.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {batch.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(batch.expiry_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ${batch.cost_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit batch"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(batch.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete batch"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredBatches.length} of {batches.length} batches
      </div>
    </div>
  );
}
