"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  creditLimit: number;
  balance: number;
}

export default function CustomersPage() {
  const [customers] = useState<Customer[]>([
    { id: 1, name: "Pharmacy ABC", phone: "+255 712 345 678", email: "abc@pharmacy.co.tz", creditLimit: 5000000, balance: 450000 },
    { id: 2, name: "Health Center XYZ", phone: "+255 713 456 789", email: "xyz@health.co.tz", creditLimit: 3000000, balance: 320000 },
    { id: 3, name: "Clinic 123", phone: "+255 714 567 890", email: "clinic123@mail.co.tz", creditLimit: 2000000, balance: 1800000 },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
        
        <button className="flex items-center gap-2 bg-[#1C9AD6] text-white px-4 py-2 rounded-lg hover:bg-[#1576B0] transition">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Limit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800 font-medium">{customer.name}</td>
                <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                <td className="px-6 py-4 text-gray-800">TZS {customer.creditLimit.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${
                    customer.balance > customer.creditLimit * 0.8 ? "text-red-600" : "text-gray-800"
                  }`}>
                    TZS {customer.balance.toLocaleString()}
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
