"use client";

import { Shield, FileCheck, AlertCircle, Clock } from "lucide-react";

export default function CompliancePage() {
  const complianceStats = [
    { label: "Controlled Drugs", value: "24", icon: Shield, color: "text-blue-600" },
    { label: "Pending Audits", value: "3", icon: FileCheck, color: "text-green-600" },
    { label: "Compliance Issues", value: "1", icon: AlertCircle, color: "text-red-600" },
    { label: "Last Inspection", value: "30 days ago", icon: Clock, color: "text-gray-600" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Compliance & Audit</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {complianceStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-md border">
              <div className="flex items-center gap-3 mb-2">
                <Icon className={stat.color} size={20} />
                <span className="text-gray-500 text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Controlled Drugs</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">Morphine 10mg</span>
              <span className="text-gray-600 text-sm">Stock: 50</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">Codeine 30mg</span>
              <span className="text-gray-600 text-sm">Stock: 120</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Diazepam 5mg</span>
              <span className="text-gray-600 text-sm">Stock: 80</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Audit Trail</h3>
          <div className="space-y-3">
            <div className="py-2 border-b">
              <p className="text-gray-700 text-sm">Stock adjustment - Paracetamol</p>
              <p className="text-gray-500 text-xs">By Admin • 2 hours ago</p>
            </div>
            <div className="py-2 border-b">
              <p className="text-gray-700 text-sm">Sale recorded - INV-002</p>
              <p className="text-gray-500 text-xs">By Cashier • 5 hours ago</p>
            </div>
            <div className="py-2">
              <p className="text-gray-700 text-sm">Product added - Amoxicillin</p>
              <p className="text-gray-500 text-xs">By Manager • Yesterday</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-yellow-800">Compliance Alert</h4>
            <p className="text-yellow-700 text-sm">
              Morphine 10mg requires documentation update. Please review before next inspection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
