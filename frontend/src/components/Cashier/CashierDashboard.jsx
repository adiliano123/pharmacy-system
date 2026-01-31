import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import PointOfSale from './PointOfSale';
import SalesHistory from './SalesHistory';
import CustomerManagement from './CustomerManagement';
import PaymentProcessing from './PaymentProcessing';
import DailyReports from './DailyReports';

const CashierDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pos');
  const [dashboardStats, setDashboardStats] = useState({
    todaySales: 0,
    todayTransactions: 0,
    todayCustomers: 0,
    averageTransaction: 0,
    topSellingItem: '',
    cashInHand: 0,
    pendingPayments: 0,
    dailyTarget: 50000
  });

  const fetchCashierStats = useCallback(async () => {
    try {
      // Get session token from localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      
      if (!sessionToken) {
        console.warn('No session token found');
        return;
      }

      const response = await fetch('http://localhost/pharmacy-system/api/modules/get_cashier_stats.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDashboardStats(result.data);
        } else {
          throw new Error(result.message);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching cashier stats:', error);
      // Fallback to default values if API fails
      setDashboardStats({
        todaySales: 0,
        todayTransactions: 0,
        todayCustomers: 0,
        averageTransaction: 0,
        topSellingItem: 'No sales yet',
        cashInHand: 0,
        pendingPayments: 0,
        dailyTarget: 50000
      });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCashierStats();
  }, [fetchCashierStats]);

  const tabs = [
    { id: 'pos', label: 'Point of Sale', icon: '🛒', description: 'Process sales and transactions' },
    { id: 'history', label: 'Sales History', icon: '📋', description: 'View transaction history' },
    { id: 'customers', label: 'Customers', icon: '👥', description: 'Manage customer information' },
    { id: 'payments', label: 'Payments', icon: '💳', description: 'Handle payments and receipts' },
    { id: 'reports', label: 'Daily Reports', icon: '📊', description: 'View daily performance' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pos':
        return <PointOfSale onStatsUpdate={fetchCashierStats} />;
      case 'history':
        return <SalesHistory />;
      case 'customers':
        return <CustomerManagement />;
      case 'payments':
        return <PaymentProcessing />;
      case 'reports':
        return <DailyReports stats={dashboardStats} />;
      default:
        return <PointOfSale onStatsUpdate={fetchCashierStats} />;
    }
  };

  const getTargetProgress = () => {
    return Math.min((dashboardStats.todaySales / dashboardStats.dailyTarget) * 100, 100);
  };

  return (
    <div style={containerStyle}>
      {/* Cashier Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            💰 Cashier Dashboard
          </h1>
          <p style={subtitleStyle}>
            Welcome, {user?.full_name}! Ready to serve customers today.
          </p>
        </div>
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>💰</div>
            <div>
              <div style={statValueStyle}>TSh {dashboardStats.todaySales.toLocaleString()}</div>
              <div style={statLabelStyle}>Today's Sales</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>🛒</div>
            <div>
              <div style={statValueStyle}>{dashboardStats.todayTransactions}</div>
              <div style={statLabelStyle}>Transactions</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>👥</div>
            <div>
              <div style={statValueStyle}>{dashboardStats.todayCustomers}</div>
              <div style={statLabelStyle}>Customers Served</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>📈</div>
            <div>
              <div style={statValueStyle}>TSh {dashboardStats.averageTransaction.toLocaleString()}</div>
              <div style={statLabelStyle}>Avg Transaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Target Progress */}
      <div style={targetContainerStyle}>
        <div style={targetHeaderStyle}>
          <h3 style={targetTitleStyle}>📊 Daily Sales Target</h3>
          <div style={targetAmountStyle}>
            TSh {dashboardStats.todaySales.toLocaleString()} / TSh {dashboardStats.dailyTarget.toLocaleString()}
          </div>
        </div>
        <div style={progressBarContainerStyle}>
          <div 
            style={{
              ...progressBarStyle,
              width: `${getTargetProgress()}%`
            }}
          ></div>
        </div>
        <div style={progressTextStyle}>
          {getTargetProgress().toFixed(1)}% of daily target achieved
        </div>
      </div>

      {/* Quick Actions */}
      <div style={quickActionsStyle}>
        <button 
          onClick={() => setActiveTab('pos')}
          style={quickActionButtonStyle}
        >
          🛒 New Sale
        </button>
        <button 
          onClick={() => setActiveTab('customers')}
          style={quickActionButtonStyle}
        >
          👤 Add Customer
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          style={quickActionButtonStyle}
        >
          💳 Process Payment
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          style={quickActionButtonStyle}
        >
          📊 View Reports
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={tabsContainerStyle}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...tabCardStyle,
              ...(activeTab === tab.id ? activeTabCardStyle : {})
            }}
          >
            <div style={tabIconStyle}>{tab.icon}</div>
            <div>
              <div style={tabLabelStyle}>{tab.label}</div>
              <div style={tabDescriptionStyle}>{tab.description}</div>
            </div>
          </div>
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
  background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
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
  gridTemplateColumns: 'repeat(4, 1fr)',
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

const targetContainerStyle = {
  background: '#fff',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '30px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

const targetHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const targetTitleStyle = {
  margin: 0,
  color: '#2d3748',
  fontSize: '1.2rem'
};

const targetAmountStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#38a169'
};

const progressBarContainerStyle = {
  width: '100%',
  height: '12px',
  background: '#e2e8f0',
  borderRadius: '6px',
  overflow: 'hidden',
  marginBottom: '8px'
};

const progressBarStyle = {
  height: '100%',
  background: 'linear-gradient(90deg, #38a169, #2f855a)',
  borderRadius: '6px',
  transition: 'width 0.5s ease'
};

const progressTextStyle = {
  textAlign: 'center',
  fontSize: '14px',
  color: '#4a5568'
};

const quickActionsStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '30px',
  flexWrap: 'wrap'
};

const quickActionButtonStyle = {
  background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.3s',
  boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)'
};

const tabsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '16px',
  marginBottom: '30px'
};

const tabCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
  background: '#fff',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  border: '2px solid transparent',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
};

const activeTabCardStyle = {
  borderColor: '#38a169',
  boxShadow: '0 8px 25px rgba(56, 161, 105, 0.2)',
  transform: 'translateY(-2px)'
};

const tabIconStyle = {
  fontSize: '32px'
};

const tabLabelStyle = {
  fontWeight: '600',
  color: '#2d3748',
  fontSize: '16px',
  marginBottom: '4px'
};

const tabDescriptionStyle = {
  color: '#718096',
  fontSize: '14px'
};

const contentStyle = {
  background: '#fff',
  borderRadius: '16px',
  padding: '30px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  minHeight: '500px'
};

export default CashierDashboard;