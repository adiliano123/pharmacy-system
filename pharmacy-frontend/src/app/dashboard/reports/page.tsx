"use client";

import { FileText, TrendingUp, Package, AlertTriangle } from "lucide-react";

export default function ReportsPage() {
  const reportTypes = [
    {
      icon: TrendingUp,
      title: "Sales Report",
      description: "View sales performance and trends",
      color: "bg-blue-500",
    },
    {
      icon: Package,
      title: "Inventory Report",
      description: "Stock levels and movement analysis",
      color: "bg-green-500",
    },
    {
      icon: AlertTriangle,
      title: "Expiry Report",
      description: "Products nearing expiration date",
      color: "bg-orange-500",
    },
    {
      icon: FileText,
      title: "Financial Report",
      description: "Profit, loss, and revenue analysis",
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`${report.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {report.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {report.description}
                  </p>
                  <button className="text-[#1C9AD6] hover:text-[#1576B0] font-medium text-sm">
                    Generate Report →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Sales Report - January 2026</span>
            <span className="text-gray-500 text-sm">Generated 2 days ago</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Inventory Report - Q4 2025</span>
            <span className="text-gray-500 text-sm">Generated 1 week ago</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Expiry Report - February 2026</span>
            <span className="text-gray-500 text-sm">Generated today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
