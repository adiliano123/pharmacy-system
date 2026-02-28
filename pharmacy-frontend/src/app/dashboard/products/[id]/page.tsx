'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { axiosInstance } from '@/lib/api';

interface StockBatch {
  id: number;
  quantity: number;
  expiry_date: string;
  batch_number: string;
  supplier: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock_batches: StockBatch[];
  created_at: string;
  updated_at: string;
}

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.get(`/products/${params.id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      router.push('/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const totalQuantity = product?.stock_batches.reduce((sum, batch) => sum + batch.quantity, 0) || 0;

  if (loading) {
    return <div className="text-center py-12">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Product Details</h1>
          <p className="text-gray-600 mt-2">View product information and stock batches</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Product
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Back
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
            <p className="text-lg font-semibold text-gray-900">{product.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Selling Price</label>
            <p className="text-lg font-semibold text-gray-900">TZS {product.price?.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Total Stock</label>
            <p className={`text-lg font-semibold ${
              totalQuantity === 0 ? 'text-red-600' :
              totalQuantity < 20 ? 'text-orange-600' :
              'text-green-600'
            }`}>
              {totalQuantity} units
            </p>
          </div>
          {product.description && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <p className="text-gray-900">{product.description}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
            <p className="text-gray-900">{new Date(product.created_at).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
            <p className="text-gray-900">{new Date(product.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stock Batches */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Stock Batches</h2>
          <button
            onClick={() => router.push(`/dashboard/products/${product.id}/add-batch`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
          >
            + Add Batch
          </button>
        </div>

        {product.stock_batches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No stock batches available</p>
            <p className="text-sm">Add a batch to start tracking inventory for this product</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Batch Number</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Supplier</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-semibold">Quantity</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-semibold">Expiry Date</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {product.stock_batches.map((batch) => {
                  const expiryDate = new Date(batch.expiry_date);
                  const today = new Date();
                  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const isExpired = daysUntilExpiry < 0;
                  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;

                  return (
                    <tr key={batch.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{batch.batch_number}</td>
                      <td className="py-3 px-4">{batch.supplier || 'N/A'}</td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {batch.quantity}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {expiryDate.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isExpired ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            Expired
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                            Expiring in {daysUntilExpiry} days
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            Good
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
