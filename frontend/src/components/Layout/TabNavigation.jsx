const TabNavigation = ({ view, setView }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
      <button onClick={() => setView('inventory')} style={view === 'inventory' ? activeTabStyle : tabStyle}>
        <span style={{ fontSize: '18px', marginRight: '8px' }}>📦</span> Inventory & Stock
      </button>
      <button onClick={() => setView('sales')} style={view === 'sales' ? activeTabStyle : tabStyle}>
        <span style={{ fontSize: '18px', marginRight: '8px' }}>💰</span> Sales & Revenue
      </button>
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
