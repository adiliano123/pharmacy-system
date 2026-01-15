import { useAuth } from '../../context/AuthContext';

const HomePage = ({ totalRevenue, lowStockCount, outOfStockCount, totalSales, totalItems, totalStockValue, totalStockQuantity, inventoryCount }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div>
      {/* Welcome Section */}
      <div style={welcomeSection}>
        <div>
          <h2 style={welcomeTitle}>
            {getGreeting()}, {user?.full_name || 'User'}! 👋
          </h2>
          <p style={welcomeSubtitle}>
            Welcome to your Pharmacy Management Dashboard
          </p>
        </div>
        <div style={dateBox}>
          <div style={{ fontSize: '14px', color: '#718096', marginBottom: '5px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d3748' }}>
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={statsGrid}>
        <div style={{ ...statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div style={statIcon}>💰</div>
          <div style={statContent}>
            <div style={statLabel}>Total Revenue</div>
            <div style={statValue}>${totalRevenue.toFixed(2)}</div>
            <div style={statSubtext}>All time earnings</div>
          </div>
        </div>

        <div style={{ ...statCard, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <div style={statIcon}>📦</div>
          <div style={statContent}>
            <div style={statLabel}>Stock Value</div>
            <div style={statValue}>${totalStockValue.toFixed(2)}</div>
            <div style={statSubtext}>{totalStockQuantity} units in {inventoryCount} batches</div>
          </div>
        </div>

        <div style={{ ...statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <div style={statIcon}>🛒</div>
          <div style={statContent}>
            <div style={statLabel}>Total Sales</div>
            <div style={statValue}>{totalSales}</div>
            <div style={statSubtext}>Transactions completed</div>
          </div>
        </div>

        <div style={{ ...statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <div style={statIcon}>💊</div>
          <div style={statContent}>
            <div style={statLabel}>Items Sold</div>
            <div style={statValue}>{totalItems}</div>
            <div style={statSubtext}>Total units dispensed</div>
          </div>
        </div>

        <div style={{ ...statCard, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
          <div style={statIcon}>⚠️</div>
          <div style={statContent}>
            <div style={statLabel}>Stock Alerts</div>
            <div style={statValue}>{lowStockCount + outOfStockCount}</div>
            <div style={statSubtext}>{lowStockCount} low, {outOfStockCount} empty</div>
          </div>
        </div>

        <div style={{ ...statCard, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
          <div style={statIcon}>📋</div>
          <div style={statContent}>
            <div style={statLabel}>Inventory Items</div>
            <div style={statValue}>{inventoryCount}</div>
            <div style={statSubtext}>Unique batches in stock</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={quickActionsSection}>
        <h3 style={sectionTitle}>Quick Actions</h3>
        <div style={actionsGrid}>
          <div style={actionCard}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📋</div>
            <h4 style={actionTitle}>View Inventory</h4>
            <p style={actionDescription}>Check stock levels and medicine details</p>
          </div>

          <div style={actionCard}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>💊</div>
            <h4 style={actionTitle}>Dispense Medicine</h4>
            <p style={actionDescription}>Process sales and update inventory</p>
          </div>

          <div style={actionCard}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>➕</div>
            <h4 style={actionTitle}>Add Stock</h4>
            <p style={actionDescription}>Register new medicine batches</p>
          </div>

          <div style={actionCard}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📊</div>
            <h4 style={actionTitle}>View Reports</h4>
            <p style={actionDescription}>Analyze sales and performance</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div style={statusSection}>
        <h3 style={sectionTitle}>System Status</h3>
        <div style={statusGrid}>
          <div style={statusItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ ...statusIndicator, background: '#48bb78' }}></div>
              <div>
                <div style={statusLabel}>Database</div>
                <div style={statusValue}>Connected</div>
              </div>
            </div>
          </div>

          <div style={statusItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ ...statusIndicator, background: lowStockCount > 0 ? '#ed8936' : '#48bb78' }}></div>
              <div>
                <div style={statusLabel}>Low Stock Items</div>
                <div style={statusValue}>{lowStockCount} items</div>
              </div>
            </div>
          </div>

          <div style={statusItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ ...statusIndicator, background: outOfStockCount > 0 ? '#e53e3e' : '#48bb78' }}></div>
              <div>
                <div style={statusLabel}>Out of Stock</div>
                <div style={statusValue}>{outOfStockCount} items</div>
              </div>
            </div>
          </div>

          <div style={statusItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ ...statusIndicator, background: '#48bb78' }}></div>
              <div>
                <div style={statusLabel}>System</div>
                <div style={statusValue}>Operational</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div style={tipsSection}>
        <h3 style={sectionTitle}>💡 Quick Tips</h3>
        <div style={tipsGrid}>
          <div style={tipCard}>
            <div style={tipIcon}>🔍</div>
            <div style={tipText}>Use the search feature to quickly find medicines in inventory</div>
          </div>
          <div style={tipCard}>
            <div style={tipIcon}>📱</div>
            <div style={tipText}>All sales are automatically tracked with your employee ID</div>
          </div>
          <div style={tipCard}>
            <div style={tipIcon}>🖨️</div>
            <div style={tipText}>Generate PDF receipts for any transaction from the Sales tab</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const welcomeSection = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '40px',
  padding: '30px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  color: '#fff',
  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)'
};

const welcomeTitle = {
  margin: 0,
  fontSize: '2rem',
  fontWeight: '700',
  marginBottom: '8px'
};

const welcomeSubtitle = {
  margin: 0,
  fontSize: '1rem',
  opacity: 0.9
};

const dateBox = {
  background: 'rgba(255, 255, 255, 0.2)',
  padding: '15px 25px',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  textAlign: 'right'
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '40px'
};

const statCard = {
  padding: '25px',
  borderRadius: '16px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  transition: 'transform 0.3s'
};

const statIcon = {
  fontSize: '48px',
  opacity: 0.9
};

const statContent = {
  flex: 1
};

const statLabel = {
  fontSize: '13px',
  opacity: 0.9,
  marginBottom: '5px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const statValue = {
  fontSize: '2rem',
  fontWeight: '700',
  marginBottom: '5px'
};

const statSubtext = {
  fontSize: '12px',
  opacity: 0.8
};

const quickActionsSection = {
  marginBottom: '40px'
};

const sectionTitle = {
  color: '#2d3748',
  fontSize: '1.5rem',
  fontWeight: '600',
  marginBottom: '20px'
};

const actionsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px'
};

const actionCard = {
  background: '#fff',
  padding: '30px 20px',
  borderRadius: '16px',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '2px solid transparent',
  transition: 'all 0.3s',
  cursor: 'pointer'
};

const actionTitle = {
  margin: '0 0 10px 0',
  color: '#2d3748',
  fontSize: '1.1rem'
};

const actionDescription = {
  margin: 0,
  color: '#718096',
  fontSize: '0.9rem'
};

const statusSection = {
  marginBottom: '40px'
};

const statusGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px'
};

const statusItem = {
  background: '#fff',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

const statusIndicator = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  animation: 'pulse 2s infinite'
};

const statusLabel = {
  fontSize: '12px',
  color: '#718096',
  marginBottom: '5px'
};

const statusValue = {
  fontSize: '16px',
  color: '#2d3748',
  fontWeight: '600'
};

const tipsSection = {
  background: '#f7fafc',
  padding: '30px',
  borderRadius: '16px',
  border: '2px solid #e2e8f0'
};

const tipsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px'
};

const tipCard = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '15px'
};

const tipIcon = {
  fontSize: '24px',
  flexShrink: 0
};

const tipText = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '1.6'
};

export default HomePage;
