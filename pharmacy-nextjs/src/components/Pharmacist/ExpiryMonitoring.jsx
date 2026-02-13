'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const ExpiryMonitoring = ({ onStatsUpdate }) => {
  const { user } = useAuth();
  const [expiringMedicines, setExpiringMedicines] = useState({
    expired: [],
    '30_days': [],
    '90_days': [],
    safe: []
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('expired');

  useEffect(() => {
    fetchExpiringMedicines();
    fetchAlerts();
  }, []);

  const fetchExpiringMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/modules/expiry_monitoring.php?action=expiring');
      const data = await response.json();
      if (data.success) {
        setExpiringMedicines(data.data);
      }
    } catch (error) {
      console.error('Error fetching expiring medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/modules/expiry_monitoring.php?action=alerts');
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const acknowledgeAlert = async (alertId, actionTaken) => {
    try {
      const response = await fetch('/api/modules/expiry_monitoring.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'acknowledge',
          alert_id: alertId,
          acknowledged_by: user.user_id,
          action_taken: actionTaken
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchAlerts();
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const generateAlerts = async () => {
    try {
      const response = await fetch('/api/modules/expiry_monitoring.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_alerts'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchAlerts();
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error generating alerts:', error);
    }
  };

  const getAlertColor = (alertLevel) => {
    switch (alertLevel) {
      case 'expired': return '#e53e3e';
      case '30_days': return '#ed8936';
      case '90_days': return '#ecc94b';
      default: return '#48bb78';
    }
  };

  const getAlertIcon = (alertLevel) => {
    switch (alertLevel) {
      case 'expired': return '🚨';
      case '30_days': return '⚠️';
      case '90_days': return '⏰';
      default: return '✅';
    }
  };

  const formatDaysToExpiry = (days) => {
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    return `${days} days to expiry`;
  };

  const tabs = [
    { id: 'expired', label: 'Expired', count: expiringMedicines.expired.length, color: '#e53e3e' },
    { id: '30_days', label: '30 Days', count: expiringMedicines['30_days'].length, color: '#ed8936' },
    { id: '90_days', label: '90 Days', count: expiringMedicines['90_days'].length, color: '#ecc94b' },
    { id: 'safe', label: 'Safe', count: expiringMedicines.safe.length, color: '#48bb78' }
  ];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>📅 Expiry Monitoring</h2>
        <button onClick={generateAlerts} style={generateAlertsButtonStyle}>
          🔄 Generate Alerts
        </button>
      </div>

      <div style={contentGridStyle}>
        {/* Expiring Medicines */}
        <div style={medicinesContainerStyle}>
          <div style={tabsContainerStyle}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...tabButtonStyle,
                  ...(activeTab === tab.id ? { ...activeTabButtonStyle, borderColor: tab.color } : {}),
                  color: tab.color
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span style={{ ...badgeStyle, backgroundColor: tab.color }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={medicinesListStyle}>
            {loading ? (
              <div style={loadingStyle}>Loading medicines...</div>
            ) : expiringMedicines[activeTab].length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {getAlertIcon(activeTab)}
                </div>
                <p>No medicines in this category</p>
              </div>
            ) : (
              expiringMedicines[activeTab].map((medicine, index) => (
                <div key={index} style={medicineCardStyle}>
                  <div style={medicineHeaderStyle}>
                    <div>
                      <div style={medicineNameStyle}>{medicine.name}</div>
                      {medicine.generic_name && (
                        <div style={genericNameStyle}>({medicine.generic_name})</div>
                      )}
                    </div>
                    <div style={quantityBadgeStyle}>
                      Qty: {medicine.quantity}
                    </div>
                  </div>

                  <div style={medicineDetailsStyle}>
                    <div><strong>Batch:</strong> {medicine.batch_number}</div>
                    <div><strong>Expiry Date:</strong> {new Date(medicine.expiry_date).toLocaleDateString()}</div>
                    <div style={{ color: getAlertColor(medicine.alert_level) }}>
                      <strong>{formatDaysToExpiry(medicine.days_to_expiry)}</strong>
                    </div>
                  </div>

                  {medicine.alert_level === 'expired' && (
                    <div style={expiredWarningStyle}>
                      🚨 This medicine has expired and should be removed from inventory
                    </div>
                  )}

                  {medicine.alert_level === '30_days' && (
                    <div style={urgentWarningStyle}>
                      ⚠️ Urgent: Expires within 30 days - consider discounting or returning
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts Panel */}
        <div style={alertsContainerStyle}>
          <h3 style={sectionTitleStyle}>🔔 Active Alerts ({alerts.length})</h3>
          
          {alerts.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p>No active alerts</p>
              <p style={{ fontSize: '14px', color: '#718096' }}>
                All expiry alerts have been acknowledged
              </p>
            </div>
          ) : (
            <div style={alertsListStyle}>
              {alerts.map((alert, index) => (
                <div key={index} style={alertCardStyle}>
                  <div style={alertHeaderStyle}>
                    <div style={alertIconStyle}>
                      {getAlertIcon(alert.alert_type)}
                    </div>
                    <div style={alertInfoStyle}>
                      <div style={alertMedicineNameStyle}>{alert.name}</div>
                      <div style={alertDetailsStyle}>
                        Batch: {alert.batch_number} | Qty: {alert.quantity}
                      </div>
                      <div style={alertDateStyle}>
                        Expiry: {new Date(alert.expiry_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={alertActionsStyle}>
                    <button
                      onClick={() => {
                        const action = prompt('What action was taken for this alert?', 'Reviewed and noted');
                        if (action) {
                          acknowledgeAlert(alert.alert_id, action);
                        }
                      }}
                      style={acknowledgeButtonStyle}
                    >
                      ✅ Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div style={summaryStyle}>
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>🚨</div>
          <div>
            <div style={summaryValueStyle}>{expiringMedicines.expired.length}</div>
            <div style={summaryLabelStyle}>Expired</div>
          </div>
        </div>
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>⚠️</div>
          <div>
            <div style={summaryValueStyle}>{expiringMedicines['30_days'].length}</div>
            <div style={summaryLabelStyle}>Expiring Soon</div>
          </div>
        </div>
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>⏰</div>
          <div>
            <div style={summaryValueStyle}>{expiringMedicines['90_days'].length}</div>
            <div style={summaryLabelStyle}>Watch List</div>
          </div>
        </div>
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>🔔</div>
          <div>
            <div style={summaryValueStyle}>{alerts.length}</div>
            <div style={summaryLabelStyle}>Active Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  height: '100%'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
};

const titleStyle = {
  margin: 0,
  color: '#2d3748',
  fontSize: '1.5rem'
};

const generateAlertsButtonStyle = {
  background: 'linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%)',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600'
};

const contentGridStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '24px',
  marginBottom: '24px'
};

const medicinesContainerStyle = {
  background: '#f7fafc',
  borderRadius: '12px',
  padding: '20px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const alertsContainerStyle = {
  background: '#f7fafc',
  borderRadius: '12px',
  padding: '20px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const tabsContainerStyle = {
  display: 'flex',
  gap: '8px',
  marginBottom: '20px'
};

const tabButtonStyle = {
  background: '#fff',
  border: '2px solid transparent',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s'
};

const activeTabButtonStyle = {
  background: '#fff',
  borderWidth: '2px',
  borderStyle: 'solid'
};

const badgeStyle = {
  color: '#fff',
  padding: '2px 6px',
  borderRadius: '10px',
  fontSize: '10px',
  fontWeight: '600',
  minWidth: '18px',
  textAlign: 'center'
};

const medicinesListStyle = {
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const medicineCardStyle = {
  background: '#fff',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #e2e8f0'
};

const medicineHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px'
};

const medicineNameStyle = {
  fontWeight: '600',
  color: '#2d3748',
  fontSize: '16px'
};

const genericNameStyle = {
  color: '#718096',
  fontSize: '14px',
  fontStyle: 'italic'
};

const quantityBadgeStyle = {
  background: '#bee3f8',
  color: '#2b6cb0',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600'
};

const medicineDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontSize: '14px',
  color: '#4a5568',
  marginBottom: '12px'
};

const expiredWarningStyle = {
  background: '#fed7d7',
  color: '#c53030',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500'
};

const urgentWarningStyle = {
  background: '#feebc8',
  color: '#c05621',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500'
};

const sectionTitleStyle = {
  margin: '0 0 16px 0',
  color: '#2d3748',
  fontSize: '1.1rem'
};

const alertsListStyle = {
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const alertCardStyle = {
  background: '#fff',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #e2e8f0'
};

const alertHeaderStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '12px'
};

const alertIconStyle = {
  fontSize: '24px'
};

const alertInfoStyle = {
  flex: 1
};

const alertMedicineNameStyle = {
  fontWeight: '600',
  color: '#2d3748',
  fontSize: '14px',
  marginBottom: '4px'
};

const alertDetailsStyle = {
  color: '#718096',
  fontSize: '12px',
  marginBottom: '4px'
};

const alertDateStyle = {
  color: '#4a5568',
  fontSize: '12px'
};

const alertActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end'
};

const acknowledgeButtonStyle = {
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600'
};

const summaryStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px'
};

const summaryCardStyle = {
  background: '#fff',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const summaryIconStyle = {
  fontSize: '24px'
};

const summaryValueStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#2d3748'
};

const summaryLabelStyle = {
  fontSize: '12px',
  color: '#718096'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#718096'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#718096'
};

export default ExpiryMonitoring;
