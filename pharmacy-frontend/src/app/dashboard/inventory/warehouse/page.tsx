'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { Warehouse, MapPin, Package, TrendingUp, Plus, Edit } from 'lucide-react';

interface WarehouseLocation {
  id: number;
  name: string;
  code: string;
  address: string;
  capacity: number;
  current_stock: number;
  product_count: number;
  manager: string;
  status: 'active' | 'inactive' | 'maintenance';
}

interface WarehouseStock {
  id: number;
  warehouse_id: number;
  warehouse_name: string;
  product_id: number;
  product_name: string;
  quantity: number;
  location_code: string;
  last_updated: string;
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([]);
  const [stocks, setStocks] = useState<WarehouseStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchWarehouseStock(selectedWarehouse);
    }
  }, [selectedWarehouse]);

  const fetchWarehouses = async () => {
    try {
      const response = await axiosInstance.get('/inventory/warehouses');
      setWarehouses(response.data);
      if (response.data.length > 0) {
        setSelectedWarehouse(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouseStock = async (warehouseId: number) => {
    try {
      const response = await axiosInstance.get(`/inventory/warehouses/${warehouseId}/stock`);
      setStocks(response.data);
    } catch (error) {
      console.error('Failed to fetch warehouse stock:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const selectedWarehouseData = warehouses.find(w => w.id === selectedWarehouse);
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalStock = warehouses.reduce((sum, w) => sum + w.current_stock, 0);
  const activeWarehouses = warehouses.filter(w => w.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading warehouse data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Warehouse className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
            <p className="text-gray-600 mt-1">Manage multiple warehouse locations and stock distribution</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <Warehouse className="text-blue-600" size={20} />
            <span className="text-gray-500 text-sm">Active Warehouses</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{activeWarehouses}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-green-600" size={20} />
            <span className="text-gray-500 text-sm">Total Stock Units</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalStock.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-purple-600" size={20} />
            <span className="text-gray-500 text-sm">Total Capacity</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalCapacity.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Warehouse Locations</h3>
            <div className="space-y-3">
              {warehouses.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No warehouses found</p>
              ) : (
                warehouses.map((warehouse) => {
                  const capacityPercentage = (warehouse.current_stock / warehouse.capacity) * 100;
                  return (
                    <button
                      key={warehouse.id}
                      onClick={() => setSelectedWarehouse(warehouse.id)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedWarehouse === warehouse.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{warehouse.name}</p>
                          <p className="text-xs text-gray-600">{warehouse.code}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(warehouse.status)}`}>
                          {warehouse.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <MapPin size={14} />
                        <span className="truncate">{warehouse.address}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Capacity</span>
                          <span className={`font-semibold ${getCapacityColor(warehouse.current_stock, warehouse.capacity)}`}>
                            {capacityPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              capacityPercentage >= 90 ? 'bg-red-500' :
                              capacityPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {warehouse.current_stock.toLocaleString()} / {warehouse.capacity.toLocaleString()} units
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedWarehouse ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Warehouse className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Warehouse Selected</h3>
              <p className="text-gray-600">Select a warehouse to view its inventory details</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedWarehouseData?.name}</h3>
                    <p className="text-sm text-gray-600">{selectedWarehouseData?.address}</p>
                  </div>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Manager</p>
                    <p className="font-semibold text-gray-800">{selectedWarehouseData?.manager}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Products</p>
                    <p className="font-semibold text-gray-800">{selectedWarehouseData?.product_count}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Inventory</h3>
                {stocks.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">No stock items in this warehouse</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Location Code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Last Updated
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stocks.map((stock) => (
                          <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              {stock.product_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {stock.location_code}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {stock.quantity.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {new Date(stock.last_updated).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add New Warehouse</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-8">
                Warehouse creation form would go here
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
