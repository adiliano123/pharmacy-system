import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const HomePage = ({ totalRevenue, lowStockCount, outOfStockCount, totalSales, totalItems, totalStockValue, totalStockQuantity, inventoryCount }) => {
  const { user, justLoggedIn } = useAuth();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for real-time clock and greeting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time clock

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (justLoggedIn) {
      setShowWelcomeMessage(true);
      // Hide welcome message after 4 seconds
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [justLoggedIn]);

  const getDetailedGreeting = () => {
    // Use the currentTime state that updates every second
    const now = currentTime;
    const hour24 = now.getHours(); // 24-hour format (0-23)
    const hour12 = now.getHours() % 12 || 12; // 12-hour format (1-12)
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Debug: Log comprehensive time info
    console.log('=== TIME DEBUG ===');
    console.log('Full timestamp:', now.toString());
    console.log('Local time string:', now.toLocaleString());
    console.log('24-hour format:', hour24);
    console.log('12-hour format:', hour12, ampm);
    console.log('Time zone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    let greeting = '';
    let emoji = '';
    let message = '';
    
    // Use 24-hour format for logic (0-23)
    if (hour24 >= 5 && hour24 < 12) {
      greeting = 'Good Morning';
      emoji = '🌅';
      message = `Hope you have a productive ${day}!`;
      console.log('✅ Selected: Morning (5 AM - 11:59 AM)');
    } else if (hour24 >= 12 && hour24 < 17) {
      greeting = 'Good Afternoon';
      emoji = '☀️';
      message = `Hope your ${day} is going well!`;
      console.log('✅ Selected: Afternoon (12 PM - 4:59 PM)');
    } else if (hour24 >= 17 && hour24 < 21) {
      greeting = 'Good Evening';
      emoji = '🌆';
      message = `Winding down this ${day} evening!`;
      console.log('✅ Selected: Evening (5 PM - 8:59 PM)');
    } else {
      greeting = 'Good Evening';
      emoji = '🌙';
      message = `Working late this ${day}? Take care!`;
      console.log('✅ Selected: Late Evening (9 PM - 4:59 AM)');
    }
    
    console.log('Final result:', greeting, emoji);
    console.log('==================');
    
    return { greeting, emoji, message, currentHour: hour24, ampm };
  };

  const { greeting, emoji, message, currentHour, ampm } = getDetailedGreeting();

  return (
    <div>
      {/* Welcome Message for Just Logged In Users */}
      {showWelcomeMessage && (
        <div style={welcomeMessageStyle}>
          <div style={welcomeMessageContent}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
            <h2 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.5rem' }}>
              Welcome back, {user?.full_name || 'User'}!
            </h2>
            <p style={{ margin: 0, color: '#fff', opacity: 0.9 }}>
              Successfully logged in to your Pharmacy ERP System
            </p>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div style={welcomeSection}>
        <div>
          <h2 style={welcomeTitle}>
            {greeting}, {user?.full_name || 'User'}! {emoji}
          </h2>
          <p style={welcomeSubtitle}>
            {message}
          </p>
          <p style={{ ...welcomeSubtitle, fontSize: '14px', marginTop: '5px' }}>
            Welcome to your Pharmacy Management Dashboard
          </p>
          <p style={{ ...welcomeSubtitle, fontSize: '12px', marginTop: '5px', opacity: 0.7 }}>
            System Time: {currentTime.toLocaleString()} | Hour: {currentHour} ({ampm})
          </p>
          <button 
            onClick={() => setCurrentTime(new Date())} 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '10px',
              marginTop: '5px',
              marginRight: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Time
          </button>
          <button 
            onClick={() => {
              // Test all time periods
              console.log('=== TESTING ALL TIME PERIODS ===');
              for (let testHour = 0; testHour < 24; testHour++) {
                let testGreeting = '';
                if (testHour >= 5 && testHour < 12) testGreeting = 'Good Morning';
                else if (testHour >= 12 && testHour < 17) testGreeting = 'Good Afternoon';
                else if (testHour >= 17 && testHour < 21) testGreeting = 'Good Evening';
                else testGreeting = 'Good Evening (Late)';
                console.log(`Hour ${testHour}: ${testGreeting}`);
              }
              console.log('=== END TEST ===');
            }} 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '10px',
              marginTop: '5px',
              marginRight: '5px',
              cursor: 'pointer'
            }}
          >
            🧪 Test Logic
          </button>
          <button 
            onClick={() => {
              // Force current time to be evening for testing
              const testTime = new Date();
              testTime.setHours(18, 30, 0); // Set to 6:30 PM
              setCurrentTime(testTime);
              console.log('🧪 FORCED TIME TO 6:30 PM FOR TESTING');
            }} 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '10px',
              marginTop: '5px',
              cursor: 'pointer'
            }}
          >
            🌆 Force Evening
          </button>
        </div>
        <div style={dateBox}>
          <div style={{ fontSize: '14px', color: '#718096', marginBottom: '5px' }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d3748' }}>
            {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={statsGrid}>
        <div 
          style={{ ...statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
          }}
        >
          <div style={statIcon}>💰</div>
          <div style={statContent}>
            <div style={statLabel}>Total Revenue</div>
            <div style={statValue}>TSh {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div style={statSubtext}>All time earnings</div>
          </div>
        </div>

        <div 
          style={{ ...statCard, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(67, 233, 123, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
          }}
        >
          <div style={statIcon}>📦</div>
          <div style={statContent}>
            <div style={statLabel}>Stock Value</div>
            <div style={statValue}>TSh {totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div style={statSubtext}>{totalStockQuantity} units in {inventoryCount} batches</div>
          </div>
        </div>

        <div 
          style={{ ...statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(240, 147, 251, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
          }}
        >
          <div style={statIcon}>🛒</div>
          <div style={statContent}>
            <div style={statLabel}>Total Sales</div>
            <div style={statValue}>{totalSales}</div>
            <div style={statSubtext}>Transactions completed</div>
          </div>
        </div>

        <div 
          style={{ ...statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(79, 172, 254, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
          }}
        >
          <div style={statIcon}>💊</div>
          <div style={statContent}>
            <div style={statLabel}>Items Sold</div>
            <div style={statValue}>{totalItems}</div>
            <div style={statSubtext}>Total units dispensed</div>
          </div>
        </div>

        <div 
          style={{ ...statCard, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(250, 112, 154, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
          }}
        >
          <div style={statIcon}>⚠️</div>
          <div style={statContent}>
            <div style={statLabel}>Stock Alerts</div>
            <div style={statValue}>{lowStockCount + outOfStockCount}</div>
            <div style={statSubtext}>{lowStockCount} low, {outOfStockCount} empty</div>
          </div>
        </div>

        <div 
          style={{ ...statCard, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(168, 237, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
          }}
        >
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
          <div 
            style={actionCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'float 3s ease-in-out infinite' }}>📋</div>
            <h4 style={actionTitle}>View Inventory</h4>
            <p style={actionDescription}>Check stock levels and medicine details</p>
          </div>

          <div 
            style={actionCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
              e.currentTarget.style.borderColor = '#f093fb';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(240, 147, 251, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'float 3s ease-in-out infinite 0.5s' }}>💊</div>
            <h4 style={actionTitle}>Dispense Medicine</h4>
            <p style={actionDescription}>Process sales and update inventory</p>
          </div>

          <div 
            style={actionCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
              e.currentTarget.style.borderColor = '#43e97b';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(67, 233, 123, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'float 3s ease-in-out infinite 1s' }}>➕</div>
            <h4 style={actionTitle}>Add Stock</h4>
            <p style={actionDescription}>Register new medicine batches</p>
          </div>

          <div 
            style={actionCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
              e.currentTarget.style.borderColor = '#4facfe';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 172, 254, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'float 3s ease-in-out infinite 1.5s' }}>📊</div>
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
const welcomeMessageStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 1000,
  animation: 'slideInRight 0.5s ease, fadeOut 0.5s ease 3.5s forwards'
};

const welcomeMessageContent = {
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  padding: '20px 30px',
  borderRadius: '16px',
  textAlign: 'center',
  boxShadow: '0 10px 40px rgba(72, 187, 120, 0.4)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)'
};

const welcomeSection = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '40px',
  padding: '35px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  color: '#fff',
  boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
  position: 'relative',
  overflow: 'hidden',
  animation: 'fadeInUp 0.5s ease'
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
  gap: '25px',
  marginBottom: '40px'
};

const statCard = {
  padding: '28px',
  borderRadius: '20px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  animation: 'fadeInUp 0.6s ease'
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
  padding: '35px 25px',
  borderRadius: '20px',
  textAlign: 'center',
  boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
  border: '2px solid transparent',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  animation: 'scaleIn 0.5s ease'
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
