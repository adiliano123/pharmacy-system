'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api';
import { Shield, AlertTriangle, Search, Plus, FileText } from 'lucide-react';

interface ControlledDrug {
  id: number;
  name: string;
  schedule: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  last_dispensed?: string;
  requires_documentation: boolean;
}

interface DispenseRecord {
  id: number;
  drug_name: string;
  quantity: number;
  patient_name: string;
  prescription_number: string;
  dispensed_by: string;
  dispensed_at: string;
}

export default function ControlledDrugsPage() {
  const [drugs, setDrugs] = useState<ControlledDrug[]>([]);
  const [records, setRecords] = useState<DispenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'records'>('inventory');

  useEffect(() => {
    fetchControlledDrugs();
    fetchDispenseRecords();
  }, []);

  const fetchControlledDrugs = async () => {
    try {
      const response = await axiosInstance.get('/compliance/controlled-drugs');
      setDrugs(response.data);
    } catch (error) {
      console.error('Failed to fetch controlled drugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDispenseRecords = async () => {
    try {
      const response = await axiosInstance.get('/compliance/controlled-drugs/dispense-records');
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch dispense records:', error);
    }
  };

  const filteredDrugs = drugs.filter(drug =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.schedule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScheduleColor = (schedule: string) => {
    const colors: Record<string, string> = {
      'Schedule II': 'bg-red-100 text-red-800',
      'Schedule III': 'bg-orange-100 text-orange-800',
      'Schedule IV': 'bg-yellow-100 text-yellow-800',
      'Schedule V': 'bg-green-100 text-green-800',
    };
    return colors[schedule] || 'bg-gray-100 text-gray-800';
  };

  const isLowStock = (drug: ControlledDrug) => {
    return drug.current_stock <= drug.minimum_stock;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading controlled drugs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Controlled Drugs Management</h2>
          <p className="text-gray-600 text-sm">Track and manage controlled substances</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Record Dispense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-blue-600" size={20} />
            <span className="text-gray-500 text-sm">Total Controlled Drugs</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{drugs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-red-600" size={20} />
            <span className="text-gray-500 text-sm">Low Stock Items</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {drugs.filter(isLowStock).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-green-600" size={20} />
            <span className="text-gray-500 text-sm">Dispense Records</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{records.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'inventory'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'records'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dispense Records
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'inventory' && (
            <>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search controlled drugs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Drug Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDrugs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          <Shield className="mx-auto mb-2 text-gray-400" size={48} />
                          <p>No controlled drugs found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredDrugs.map((drug) => (
                        <tr key={drug.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            {drug.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getScheduleColor(drug.schedule)}`}>
                              {drug.schedule}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {drug.current_stock} {drug.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {drug.minimum_stock} {drug.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isLowStock(drug) ? (
                              <span className="flex items-center gap-1 text-red-600 text-sm">
                                <AlertTriangle size={16} />
                                Low Stock
                              </span>
                            ) : (
                              <span className="text-green-600 text-sm">✓ Normal</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'records' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Drug Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prescription #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dispensed By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        <FileText className="mx-auto mb-2 text-gray-400" size={48} />
                        <p>No dispense records found</p>
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(record.dispensed_at)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {record.drug_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {record.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {record.patient_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {record.prescription_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {record.dispensed_by}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-600 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-yellow-800">Compliance Reminder</h4>
            <p className="text-yellow-700 text-sm">
              All controlled substance transactions must be documented and maintained for regulatory inspection.
              Ensure proper storage and handling procedures are followed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
