import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PrescriptionVerification from './PrescriptionVerification';
import DrugInteractionChecker from './DrugInteractionChecker';
import PatientCounseling from './PatientCounseling';
import ExpiryMonitoring from './ExpiryMonitoring';
import SupplyOrderManagement from './SupplyOrderManagement';

const PharmacistDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [dashboardStats, setDashboardStats] = useState({
    pendingPrescriptions: 0,
    expiringMedicines: 0,
    pendingOrders: 0,
    counselingToday: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch various stats for pharmacist dashboard
      const [prescriptions, expiring, orders] = await Promise.all([
        fetch('/api/modules/prescriptions.php?action=pending'),
        fetch('/api/modules/expiry_monitoring.php?action=expiring'),
        fetch('/api/modules/supply_orders.php?action=pending')
      ]);

      const prescriptionData = await prescriptions.json();
      const expiringData = await expiring.json();
      const ordersData = await orders.json();

      setDashboardStats({
        pendingPrescriptions: prescriptionData.data?.length || 0,
        expiringMedicines: (expiringData.data?.expired?.length || 0) + (expiringData.data?.['30_days']?.length || 0),
        pendingOrders: ordersData.data?.length || 0,
        counselingToday: 0 // This would need a separate API call
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const tabs = [
    { id: 'prescriptions', label: 'Prescriptions', icon: '📋', count: dashboardStats.pendingPrescriptions },
    { id: 'interactions', label: 'Drug Interactions', icon: '⚠️', count: null },
    { id: 'counseling', label: 'Patient Counseling', icon: '👥', count: null },
    { id: 'expiry', label: 'Expiry Monitoring', icon: '📅', count: dashboardStats.expiringMedicines },
    { id: 'orders', label: 'Supply Orders', icon: '📦', count: dashboardStats.pendingOrders }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'prescriptions':
        return <PrescriptionVerification onStatsUpdate={fetchDashboardStats} />;
      case 'interactions':
        return <DrugInteractionChecker />;
      case 'counseling':
        return <PatientCounseling />;
      case 'expiry':
        return <ExpiryMonitoring onStatsUpdate={fetchDashboardStats} />;
      case 'orders':
        return <SupplyOrderManagement onStatsUpdate={fetchDashboardStats} />;
      default:
        return <PrescriptionVerification onStatsUpdate={fetchDashboardStats} />;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            💊 Pharmacist Dashboard
          </h1>
          <p style={subtitleStyle}>
            Welcome, {user?.full_name}! Manage clinical duties and patient care.
          </p>
        </div>
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>📋</div>
            <div>
              <div style={statValueStyle}>{dashboardStats.pendingPrescriptions}</div>
              <div style={statLabelStyle}>Pending Prescriptions</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>📅</div>
            <div>
              <div style={statValueStyle}>{dashboardStats.expiringMedicines}</div>
              <div style={statLabelStyle}>Expiring Soon</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>📦</div>
            <div>
              <div style={statValueStyle}>{dashboardStats.pendingOrders}</div>
              <div style={statLabelStyle}>Pending Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={tabsContainerStyle}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...tabStyle,
              ...(activeTab === tab.id ? activeTabStyle : {})
            }}
          >
            <span style={{ fontSize: '20px', marginRight: '8px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== null && tab.count > 0 && (
              <span style={badgeStyle}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={contentStyle}>
        {renderTabContent()}
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '20px',
  maxWidth: '1400px',
  margin: '0 auto'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  padding: '30px',
  background: 'linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%)',
  borderRadius: '16px',
  color: '#fff'
};

const titleStyle = {
  margin: 0,
  fontSize: '2rem',
  fontWeight: '700',
  marginBottom: '8px'
};

const subtitleStyle = {
  margin: 0,
  fontSize: '1rem',
  opacity: 0.9
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px'
};

const statCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  background: 'rgba(255, 255, 255, 0.2)',
  padding: '20px',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)'
};

const statIconStyle = {
  fontSize: '32px'
};

const statValueStyle = {
  fontSize: '24px',
  fontWeight: '700',
  marginBottom: '4px'
};

const statLabelStyle = {
  fontSize: '12px',
  opacity: 0.9
};

const tabsContainerStyle = {
  display: 'flex',
  gap: '4px',
  marginBottom: '30px',
  background: '#f7fafc',
  padding: '8px',
  borderRadius: '12px'
};

const tabStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 20px',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: '#4a5568',
  transition: 'all 0.2s',
  position: 'relative'
};

const activeTabStyle = {
  background: '#fff',
  color: '#3182ce',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const badgeStyle = {
  background: '#e53e3e',
  color: '#fff',
  fontSize: '10px',
  fontWeight: '600',
  padding: '2px 6px',
  borderRadius: '10px',
  marginLeft: '8px',
  minWidth: '18px',
  textAlign: 'center'
};

const contentStyle = {
  background: '#fff',
  borderRadius: '16px',
  padding: '30px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

export default PharmacistDashboard;