"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductModal from "@/components/inventory/AddProductModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

interface Product {
  id: number;
  name: string;
  category: string;
  totalStock: number;
  expirySoon: number;
}

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasPermission } = useAuth();

  const [products] = useState<Product[]>([
    { id: 1, name: "Paracetamol 500mg", category: "Pain Relief", totalStock: 120, expirySoon: 5 },
    { id: 2, name: "Amoxicillin 250mg", category: "Antibiotic", totalStock: 45, expirySoon: 2 },
    { id: 3, name: "Vitamin C 1000mg", category: "Supplement", totalStock: 300, expirySoon: 0 },
  ]);

  return (
    <div className="p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Inventory
        </h2>

        {hasPermission("canEditInventory") && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#1C9AD6] text-white px-4 py-2 rounded-lg hover:bg-[#1576B0] transition"
          >
            <Plus size={18} />
            Add Product
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expiring Soon
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 text-gray-800">
                  {product.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {product.category}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white font-semibold ${
                      product.totalStock > 50
                        ? "bg-green-500"
                        : product.totalStock > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {product.totalStock}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {product.expirySoon > 0
                    ? `${product.expirySoon} batches`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ProtectedRoute permission="canEditInventory">
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </ProtectedRoute>
    </div>
  );
}
