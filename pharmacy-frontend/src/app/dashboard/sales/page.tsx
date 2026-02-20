"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

interface Sale {
  id: number;
  invoiceNo: string;
  customer: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

export default function SalesPage() {
  const [sales] = useState<Sale[]>([
    { id: 1, invoiceNo: "INV-001", customer: "Pharmacy ABC", date: "2026-02-15", amount: 450000, status: "paid" },
    { id: 2, invoiceNo: "INV-002", customer: "Health Center XYZ", date: "2026-02-14", amount: 320000, status: "pending" },
    { id: 3, invoiceNo: "INV-003", customer: "Clinic 123", date: "2026-02-10", amount: 180000, status: "overdue" },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales</h2>
        
        <button className="flex items-center gap-2 bg-[#1C9AD6] text-white px-4 py-2 rounded-lg hover:bg-[#1576B0] transition">
          <Plus size={18} />
          New Sale
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sales..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800 font-medium">{sale.invoiceNo}</td>
                <td className="px-6 py-4 text-gray-800">{sale.customer}</td>
                <td className="px-6 py-4 text-gray-600">{sale.date}</td>
                <td className="px-6 py-4 text-gray-800">TZS {sale.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sale.status === "paid" ? "bg-green-100 text-green-800" :
                    sale.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {sale.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
