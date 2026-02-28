'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/lib/api';

interface StockBatch {
  id: number;
  quantity: number;
  expiry_date: string;
  batch_number: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  total_quantity: number;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
  has_expiring_batches: boolean;
  stock_batches: StockBatch[];
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('page', page.toString());

      const response = await axiosInstance.get(`/products?${params.toString()}`);
      setProducts(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (loading && products.length === 0) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💊 Products</h1>
          <p className="text-gray-600 mt-2">Manage your pharmacy inventory</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/products/add')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, or description..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 text-gray-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
            >
              <option value="">All Categories</option>
              <option value="Analgesics">Analgesics</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Antihistamines">Antihistamines</option>
              <option value="Vitamins">Vitamins</option>
              <option value="Supplements">Supplements</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Price</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Stock</th>
                <th className="text-center py-3 px-4 text-gray-600 font-semibold">Status</th>
                <th className="text-center py-3 px-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    TZS {product.price?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-semibold ${
                      product.is_out_of_stock ? 'text-red-600' :
                      product.is_low_stock ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {product.total_quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      {product.is_out_of_stock && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                          Out of Stock
                        </span>
                      )}
                      {product.is_low_stock && !product.is_out_of_stock && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-semibold">
                          Low Stock
                        </span>
                      )}
                      {product.has_expiring_batches && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                          Expiring Soon
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/products/${product.id}`)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded font-medium text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                        className="px-3 py-1 text-green-600 hover:bg-green-50 rounded font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {products.length} of {pagination.total} products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchProducts(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => fetchProducts(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
