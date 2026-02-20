"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: Props) {
  const [] = useState({
    name: "",
    category: "",
    reorderLevel: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Add New Product
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Category
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
              placeholder="Enter category"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Reorder Level
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
              placeholder="Enter reorder level"
            />
          </div>

          <button
            type="button"
            className="w-full bg-[#1D234F] text-white py-2 rounded-lg hover:bg-[#151A3A] transition"
          >
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
}
