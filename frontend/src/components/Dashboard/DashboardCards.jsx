const DashboardCards = ({ totalRevenue, lowStockCount, outOfStockCount }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' }}>
      <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>💵</div>
        <h4 style={labelHeaderStyle}>Total Revenue</h4>
        <h2 style={{ margin: '10px 0 0 0', color: '#fff', fontSize: '2rem' }}>${totalRevenue.toFixed(2)}</h2>
      </div>
      <div style={{ ...cardStyle, background: lowStockCount > 0 ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
        <h4 style={labelHeaderStyle}>Low Stock Items</h4>
        <h2 style={{ margin: '10px 0 0 0', color: '#fff', fontSize: '2rem' }}>{lowStockCount}</h2>
      </div>
      <div style={{ ...cardStyle, background: outOfStockCount > 0 ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚫</div>
        <h4 style={labelHeaderStyle}>Out of Stock</h4>
        <h2 style={{ margin: '10px 0 0 0', color: '#fff', fontSize: '2rem' }}>{outOfStockCount}</h2>
      </div>
    </div>
  );
};

const cardStyle = { 
  flex: 1, 
  padding: '25px', 
  borderRadius: '16px', 
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  color: '#fff',
  textAlign: 'center',
  transition: 'transform 0.3s'
};

const labelHeaderStyle = { 
  margin: '0 0 5px 0', 
  color: 'rgba(255, 255, 255, 0.9)', 
  fontSize: '13px',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

export default DashboardCards;
