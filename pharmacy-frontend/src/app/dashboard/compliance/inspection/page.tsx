'use client';

import { useState } from 'react';
import { ClipboardCheck, Download, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface InspectionItem {
  id: number;
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'warning';
  notes?: string;
}

interface InspectionReport {
  id: number;
  date: string;
  inspector: string;
  overall_status: 'pass' | 'fail' | 'pending';
  items: InspectionItem[];
}

export default function InspectionPage() {
  const [currentReport] = useState<InspectionReport>({
    id: 1,
    date: new Date().toISOString(),
    inspector: 'Regulatory Inspector',
    overall_status: 'pending',
    items: [
      {
        id: 1,
        category: 'Storage & Facilities',
        item: 'Temperature-controlled storage maintained',
        status: 'pass',
        notes: 'All refrigeration units within acceptable range'
      },
      {
        id: 2,
        category: 'Storage & Facilities',
        item: 'Controlled substances properly secured',
        status: 'pass'
      },
      {
        id: 3,
        category: 'Storage & Facilities',
        item: 'Clean and organized workspace',
        status: 'pass'
      },
      {
        id: 4,
        category: 'Documentation',
        item: 'Prescription records up to date',
        status: 'warning',
        notes: 'Some records need digital backup'
      },
      {
        id: 5,
        category: 'Documentation',
        item: 'Controlled drug register maintained',
        status: 'pass'
      },
      {
        id: 6,
        category: 'Documentation',
        item: 'Staff training records current',
        status: 'pass'
      },
      {
        id: 7,
        category: 'Safety & Compliance',
        item: 'Fire safety equipment functional',
        status: 'pass'
      },
      {
        id: 8,
        category: 'Safety & Compliance',
        item: 'Emergency procedures posted',
        status: 'pass'
      },
      {
        id: 9,
        category: 'Safety & Compliance',
        item: 'Expired medications properly disposed',
        status: 'warning',
        notes: 'Schedule disposal for 3 expired items'
      },
      {
        id: 10,
        category: 'Inventory Management',
        item: 'Stock rotation system in place',
        status: 'pass'
      },
      {
        id: 11,
        category: 'Inventory Management',
        item: 'Inventory counts accurate',
        status: 'pass'
      },
      {
        id: 12,
        category: 'Staff & Operations',
        item: 'Licensed pharmacist on duty',
        status: 'pass'
      },
      {
        id: 13,
        category: 'Staff & Operations',
        item: 'Staff wearing proper identification',
        status: 'pass'
      }
    ]
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'fail':
        return <XCircle className="text-red-600" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-600" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedItems = currentReport.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InspectionItem[]>);

  const stats = {
    pass: currentReport.items.filter(i => i.status === 'pass').length,
    warning: currentReport.items.filter(i => i.status === 'warning').length,
    fail: currentReport.items.filter(i => i.status === 'fail').length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inspection Report</h2>
          <p className="text-gray-600 text-sm">Regulatory compliance inspection checklist</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={18} />
            Schedule Inspection
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-gray-500 text-sm">Passed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.pass}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-yellow-600" size={20} />
            <span className="text-gray-500 text-sm">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.warning}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="text-red-600" size={20} />
            <span className="text-gray-500 text-sm">Failed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.fail}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Current Inspection</h3>
            <p className="text-sm text-gray-600">
              Date: {new Date(currentReport.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Inspector</p>
            <p className="font-medium text-gray-800">{currentReport.inspector}</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ClipboardCheck size={18} className="text-blue-600" />
                {category}
              </h4>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="mt-0.5">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.item}</p>
                      {item.notes && (
                        <p className="text-xs text-gray-600 mt-1">{item.notes}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {stats.warning > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-yellow-800">Action Required</h4>
              <p className="text-yellow-700 text-sm">
                {stats.warning} item(s) require attention. Please address these warnings before the next inspection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
