import { useState, useEffect } from 'react';

const ReportsAnalytics = () => {
  const [reportData, setReportData] = useState({
    salesReport: {
      dailySales: [],
      monthlySales: [],
      topProducts: [],
      salesTrends: {}
    },
    inventoryReport: {
      stockLevels: [],
      expiryAlerts: [],
      stockMovement: [],
      lowStockItems: []
    },
    userActivity: {
      loginStats: [],
      activityLog: [],
      performanceMetrics: {}
    }
  });
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReportData();
  }, [selectedReport, dateRange]);

  const fetchReportData = async () => {
    try {
      // Mock data for demonstration
      const mockSalesData = {
        dailySales: [
          { date: '2024-01-25', revenue: 45000, transactions: 23 },
          { date: '2024-01-26', revenue: 52000, transactions: 28 },
          { date: '2024-01-27', revenue: 38000, transactions: 19 },
          { date: '2024-01-28', revenue: 61000, transactions: 31 },
          { date: '2024-01-29', revenue: 47000, transactions: 25 },
          { date: '2024-01-30', revenue: 55000, transactions: 29 },
          { date: '2024-01-31', revenue: 49000, transactions: 26 }
        ],
        topProducts: [
          { name: 'Paracetamol 500mg', sales: 150, revenue: 75000 },
          { name: 'Amoxicillin 250mg', sales: 89, revenue: 89000 },
          { name: 'Ibuprofen 400mg', sales: 76, revenue: 45600 },
          { name: 'Omeprazole 20mg', sales: 65, revenue: 65000 },
          { name: 'Metformin 500mg', sales: 58, revenue: 34800 }
        ]
      };

      const mockInventoryData = {
        stockLevels: [
          { category: 'Antibiotics', totalItems: 45, totalValue: 125000 },
          { category: 'Pain Relief', totalItems: 67, totalValue: 89000 },
          { category: 'Diabetes Care', totalItems: 23, totalValue: 156000 },
          { category: 'Heart Medication', totalItems: 34, totalValue: 234000 },
          { category: 'Vitamins', totalItems: 89, totalValue: 67000 }
        ],
        expiryAlerts: [
          { medicine: 'Aspirin 100mg', expiryDate: '2024-03-15', quantity: 50, daysLeft: 44 },
          { medicine: 'Cough Syrup', expiryDate: '2024-02-28', daysLeft: 28, quantity: 25 },
          { medicine: 'Vitamin C', expiryDate: '2024-04-10', daysLeft: 70, quantity: 100 }
        ],
        lowStockItems: [
          { medicine: 'Insulin Pen', currentStock: 5, minStock: 20, status: 'Critical' },
          { medicine: 'Blood Pressure Monitor', currentStock: 8, minStock: 15, status: 'Low' },
          { medicine: 'Thermometer', currentStock: 12, minStock: 25, status: 'Low' }
        ]
      };

      setReportData({
        salesReport: mockSalesData,
        inventoryReport: mockInventoryData,
        userActivity: {
          loginStats: [
            { user: 'John Pharmacist', logins: 28, lastLogin: '2024-01-31 09:15' },
            { user: 'Jane Cashier', logins: 25, lastLogin: '2024-01-31 08:30' },
            { user: 'Admin User', logins: 15, lastLogin: '2024-01-30 17:45' }
          ]
        }
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const exportReport = (format) => {
    alert(`Exporting ${selectedReport} report as ${format.toUpperCase()}...`);
    // In real implementation, this would generate and download the report
  };

  const renderSalesReport = () => (
    <div style={reportContentStyle}>
      <div style={metricsGridStyle}>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>💰</div>
          <div>
            <div style={metricValueStyle}>
              TSh {reportData.salesReport.dailySales.reduce((acc, day) => acc + day.revenue, 0).toLocaleString()}
            </div>
            <div style={metricLabelStyle}>Total Revenue (7 days)</div>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>🛒</div>
          <div>
            <div style={metricValueStyle}>
              {reportData.salesReport.dailySales.reduce((acc, day) => acc + day.transactions, 0)}
            </div>
            <div style={metricLabelStyle}>Total Transactions</div>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>📈</div>
          <div>
            <div style={metricValueStyle}>
              TSh {Math.round(reportData.salesReport.dailySales.reduce((acc, day) => acc + day.revenue, 0) / reportData.salesReport.dailySales.length).toLocaleString()}
            </div>
            <div style={metricLabelStyle}>Average Daily Revenue</div>
          </div>
        </div>
      </div>

      <div style={chartsGridStyle}>
        <div style={chartCardStyle}>
          <h4 style={chartTitleStyle}>📊 Daily Sales Trend</h4>
          <div style={chartPlaceholderStyle}>
            {reportData.salesReport.dailySales.map((day, index) => (
              <div key={index} style={barStyle}>
                <div 
                  style={{
                    ...barFillStyle,
                    height: `${(day.revenue / 70000) * 100}%`
                  }}
                ></div>
                <div style={barLabelStyle}>{day.date.split('-')[2]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={chartCardStyle}>
          <h4 style={chartTitleStyle}>🏆 Top Selling Products</h4>
          <div style={topProductsStyle}>
            {reportData.salesReport.topProducts.map((product, index) => (
              <div key={index} style={productRowStyle}>
                <div style={productRankStyle}>{index + 1}</div>
                <div style={productInfoStyle}>
                  <div style={productNameStyle}>{product.name}</div>
                  <div style={productStatsStyle}>
                    {product.sales} units • TSh {product.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <div style={reportContentStyle}>
      <div style={metricsGridStyle}>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>📦</div>
          <div>
            <div style={metricValueStyle}>
              {reportData.inventoryReport.stockLevels.reduce((acc, cat) => acc + cat.totalItems, 0)}
            </div>
            <div style={metricLabelStyle}>Total Items in Stock</div>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>💎</div>
          <div>
            <div style={metricValueStyle}>
              TSh {reportData.inventoryReport.stockLevels.reduce((acc, cat) => acc + cat.totalValue, 0).toLocaleString()}
            </div>
            <div style={metricLabelStyle}>Total Inventory Value</div>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>⚠️</div>
          <div>
            <div style={metricValueStyle}>{reportData.inventoryReport.lowStockItems.length}</div>
            <div style={metricLabelStyle}>Low Stock Alerts</div>
          </div>
        </div>
      </div>

      <div style={chartsGridStyle}>
        <div style={chartCardStyle}>
          <h4 style={chartTitleStyle}>📋 Stock by Category</h4>
          <div style={categoryListStyle}>
            {reportData.inventoryReport.stockLevels.map((category, index) => (
              <div key={index} style={categoryRowStyle}>
                <div style={categoryNameStyle}>{category.category}</div>
                <div style={categoryStatsStyle}>
                  <span>{category.totalItems} items</span>
                  <span>TSh {category.totalValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={chartCardStyle}>
          <h4 style={chartTitleStyle}>⏰ Expiry Alerts</h4>
          <div style={expiryListStyle}>
            {reportData.inventoryReport.expiryAlerts.map((item, index) => (
              <div key={index} style={expiryRowStyle}>
                <div style={expiryInfoStyle}>
                  <div style={expiryNameStyle}>{item.medicine}</div>
                  <div style={expiryDateStyle}>Expires: {item.expiryDate}</div>
                </div>
                <div style={expiryBadgeStyle}>
                  {item.daysLeft} days
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserActivityReport = () => (
    <div style={reportContentStyle}>
      <div style={metricsGridStyle}>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>👥</div>
          <div>
            <div style={metricValueStyle}>{reportData.userActivity.loginStats.length}</div>
            <div style={metricLabelStyle}>Active Users</div>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>🔐</div>
          <div>
            <div style={metricValueStyle}>
              {reportData.userActivity.loginStats.reduce((acc, user) => acc + user.logins, 0)}
            </div>
            <div style={metricLabelStyle}>Total Logins (30 days)</div>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>📱</div>
          <div>
            <div style={metricValueStyle}>
              {Math.round(reportData.userActivity.loginStats.reduce((acc, user) => acc + user.logins, 0) / reportData.userActivity.loginStats.length)}
            </div>
            <div style={metricLabelStyle}>Avg Logins per User</div>
          </div>
        </div>
      </div>

      <div style={chartCardStyle}>
        <h4 style={chartTitleStyle}>👤 User Login Statistics</h4>
        <div style={userStatsStyle}>
          {reportData.userActivity.loginStats.map((user, index) => (
            <div key={index} style={userStatRowStyle}>
              <div style={userStatInfoStyle}>
                <div style={userStatNameStyle}>{user.user}</div>
                <div style={userStatDetailStyle}>Last login: {user.lastLogin}</div>
              </div>
              <div style={userStatBadgeStyle}>{user.logins} logins</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>📊 Reports & Analytics</h2>
        <div style={controlsStyle}>
          <div style={dateRangeStyle}>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              style={dateInputStyle}
            />
            <span style={dateToStyle}>to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              style={dateInputStyle}
            />
          </div>
          <div style={exportButtonsStyle}>
            <button onClick={() => exportReport('pdf')} style={exportButtonStyle}>
              📄 Export PDF
            </button>
            <button onClick={() => exportReport('excel')} style={exportButtonStyle}>
              📊 Export Excel
            </button>
          </div>
        </div>
      </div>

      <div style={tabsStyle}>
        {[
          { id: 'sales', label: 'Sales Report', icon: '💰' },
          { id: 'inventory', label: 'Inventory Report', icon: '📦' },
          { id: 'users', label: 'User Activity', icon: '👥' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedReport(tab.id)}
            style={{
              ...tabButtonStyle,
              ...(selectedReport === tab.id ? activeTabButtonStyle : {})
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {selectedReport === 'sales' && renderSalesReport()}
      {selectedReport === 'inventory' && renderInventoryReport()}
      {selectedReport === 'users' && renderUserActivityReport()}
    </div>
  );
};

// Styles
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const controlsStyle = { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' };
const dateRangeStyle = { display: 'flex', alignItems: 'center', gap: '8px' };
const dateInputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const dateToStyle = { color: '#718096', fontSize: '14px' };
const exportButtonsStyle = { display: 'flex', gap: '8px' };
const exportButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };

const tabsStyle = { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' };
const tabButtonStyle = { background: '#f7fafc', color: '#4a5568', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s' };
const activeTabButtonStyle = { background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)', color: '#fff' };

const reportContentStyle = { display: 'flex', flexDirection: 'column', gap: '24px' };
const metricsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' };
const metricCardStyle = { background: '#fff', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const metricIconStyle = { fontSize: '32px' };
const metricValueStyle = { fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' };
const metricLabelStyle = { fontSize: '12px', color: '#718096' };

const chartsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' };
const chartCardStyle = { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const chartTitleStyle = { margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem' };

const chartPlaceholderStyle = { display: 'flex', alignItems: 'end', gap: '8px', height: '200px', padding: '20px 0' };
const barStyle = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' };
const barFillStyle = { width: '100%', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', borderRadius: '4px 4px 0 0', minHeight: '10px' };
const barLabelStyle = { fontSize: '12px', color: '#718096' };

const topProductsStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const productRowStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' };
const productRankStyle = { width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' };
const productInfoStyle = { flex: 1 };
const productNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '4px' };
const productStatsStyle = { fontSize: '12px', color: '#718096' };

const categoryListStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const categoryRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f7fafc', borderRadius: '8px' };
const categoryNameStyle = { fontWeight: '600', color: '#2d3748' };
const categoryStatsStyle = { display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '4px', fontSize: '12px', color: '#718096' };

const expiryListStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const expiryRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f7fafc', borderRadius: '8px' };
const expiryInfoStyle = { flex: 1 };
const expiryNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '4px' };
const expiryDateStyle = { fontSize: '12px', color: '#718096' };
const expiryBadgeStyle = { background: '#fed7d7', color: '#c53030', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' };

const userStatsStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const userStatRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f7fafc', borderRadius: '8px' };
const userStatInfoStyle = { flex: 1 };
const userStatNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '4px' };
const userStatDetailStyle = { fontSize: '12px', color: '#718096' };
const userStatBadgeStyle = { background: '#bee3f8', color: '#2b6cb0', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' };

export default ReportsAnalytics;