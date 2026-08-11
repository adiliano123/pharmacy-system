"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api";
import { Shield, FileCheck, AlertCircle, Clock } from "lucide-react";

interface ComplianceStats {
  controlledDrugs: number;
  pendingAudits: number;
  complianceIssues: number;
  lastInspection: string;
}

interface ControlledDrug {
  id: number;
  name: string;
  total_quantity: number;
}

interface AuditEntry {
  id: number;
  description: string;
  user?: { name: string };
  created_at: string;
}

export default function CompliancePage() {
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [drugs, setDrugs] = useState<ControlledDrug[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [drugsRes, auditRes] = await Promise.all([
        axiosInstance.get('/compliance/controlled-drugs?per_page=3'),
        axiosInstance.get('/compliance/audit-trail?per_page=3'),
      ]);

      const drugsData = drugsRes.data?.data || drugsRes.data || [];
      const auditData = auditRes.data?.data || auditRes.data || [];

      setDrugs(drugsData.slice(0, 3));
      setAuditTrail(auditData.slice(0, 3));

      // Derive stats from real data
      setStats({
        controlledDrugs: drugsData.length,
        pendingAudits: 0,
        complianceIssues: drugsData.filter((d: ControlledDrug) => d.total_quantity < 10).length,
        lastInspection: 'N/A',
      });
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${mins} min${mins !== 1 ? 's' : ''} ago`;
  };

  const statCards = stats ? [
    { label: "Controlled Drugs", value: String(stats.controlledDrugs), icon: Shield, color: "text-blue-600" },
    { label: "Pending Audits", value: String(stats.pendingAudits), icon: FileCheck, color: "text-green-600" },
    { label: "Compliance Issues", value: String(stats.complianceIssues), icon: AlertCircle, color: "text-red-600" },
    { label: "Last Inspection", value: stats.lastInspection, icon: Clock, color: "text-gray-600" },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Compliance & Audit</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
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
        {/* Controlled Drugs */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Controlled Drugs</h3>
          {drugs.length > 0 ? (
            <div className="space-y-3">
              {drugs.map((drug, i) => (
                <div key={drug.id} className={`flex justify-between items-center py-2 ${i < drugs.length - 1 ? 'border-b' : ''}`}>
                  <span className="text-gray-700">{drug.name}</span>
                  <span className={`text-sm font-medium ${drug.total_quantity < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                    Stock: {drug.total_quantity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">No controlled drugs recorded</p>
          )}
        </div>

        {/* Audit Trail */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Audit Trail</h3>
          {auditTrail.length > 0 ? (
            <div className="space-y-3">
              {auditTrail.map((entry, i) => (
                <div key={entry.id} className={`py-2 ${i < auditTrail.length - 1 ? 'border-b' : ''}`}>
                  <p className="text-gray-700 text-sm">{entry.description}</p>
                  <p className="text-gray-500 text-xs">
                    {entry.user?.name ?? 'System'} • {timeAgo(entry.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">No recent activity</p>
          )}
        </div>
      </div>

      {/* Alert — only show if there are real compliance issues */}
      {stats && stats.complianceIssues > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-yellow-800">Compliance Alert</h4>
              <p className="text-yellow-700 text-sm">
                {stats.complianceIssues} controlled drug{stats.complianceIssues > 1 ? 's have' : ' has'} low stock. Please review before the next inspection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
