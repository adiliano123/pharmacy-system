'use client';

const TabNavigation = ({ view, setView, userRole }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'admin', label: 'Administration', icon: '👑', roles: ['admin'] },
    { id: 'pharmacist', label: 'Clinical Duties', icon: '💊', roles: ['pharmacist'] },
    { id: 'cashier', label: 'Cashier Operations', icon: '💰', roles: ['cashier'] },
    { id: 'inventory', label: 'Inventory & Stock', icon: '📦', roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'sales', label: 'Sales & Revenue', icon: '💰', roles: ['admin', 'pharmacist', 'cashier'] }
  ];

  const visibleTabs = tabs.filter(tab => tab.roles.includes(userRole));

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
      {visibleTabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => setView(tab.id)} 
          style={view === tab.id ? activeTabStyle : tabStyle}
        >
          <span style={{ fontSize: '18px', marginRight: '8px' }}>{tab.icon}</span> 
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const tabStyle = { 
  padding: '12px 28px', 
  cursor: 'pointer', 
  border: 'none', 
  borderRadius: '10px', 
  background: '#e2e8f0',
  color: '#4a5568',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.3s',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const activeTabStyle = { 
  ...tabStyle, 
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
  color: '#fff',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
};

export default TabNavigation;
