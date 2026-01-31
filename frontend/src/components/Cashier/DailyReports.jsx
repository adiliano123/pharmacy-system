import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DailyReports = ({ stats }) => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState({
    salesSummary: {},
    paymentBreakdown: {},
    topProducts: [],
    hourlyBreakdown: [],
    customerStats: {}
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReportData();
  }, [selectedDate]);

  const fetchReportData = async () => {
    try {
      // Mock report data
      const mockReportData = {
        salesSummary: {
          totalSales: 25750,
          totalTransactions: 18,
          averageTransaction: 1430,
          totalItems: 45,
          totalCustomers: 15
        },
        paymentBreakdown: {
          cash: { amount: 15450, count: 12 },
          card: { amount: 6800, count: 4 },
          mobile: { amount: 2500, count: 1 },
          insurance: { amount: 1000, count: 1 }
        },
        topProducts: [
          { name: 'Paracetamol 500mg', quantity: 8, revenue: 4000 },
          { name: 'Amoxicillin 250mg', quantity: 5, revenue: 5000 },
          { name: 'Vitamin C 1000mg', quantity: 12, revenue: 3600 },
          { name: 'Ibuprofen 400mg', quantity: 6, revenue: 3600 },
          { name: 'Omeprazole 20mg', quantity: 3, revenue: 3600 }
        ],
        hourlyBreakdown: [
          { hour: '08:00', sales: 1200, transactions: 2 },
          { hour: '09:00', sales: 2100, transactions: 3 },
          { hour: '10:00', sales: 3200, transactions: 4 },
          { hour: '11:00', sales: 2800, transactions: 2 },
          { hour: '12:00', sales: 4100, transactions: 3 },
          { hour: '13:00', sales: 3600, transactions: 2 },
          { hour: '14:00', sales: 2950, transactions: 1 },
          { hour: '15:00', sales: 3200, transactions: 1 },
          { hour: '16:00', sales: 2500, transactions: 0 }
        ],
        customerStats: {
          newCustomers: 3,
          returningCustomers: 12,
          walkInCustomers: 8
        }
      };

      setReportData(mockReportData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const exportReport = (format) => {
    alert(`Exporting daily report as ${format.toUpperCase()}...`);
    // In real implementation, this would generate and download the report
  };

  const printReport = () => {
    window.print();
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'mobile': return '📱';
      case 'insurance': return '🏥';
      default: return '💰';
    }
  };

  const getMaxHourlySales = () => {
    return Math.max(...reportData.hourlyBreakdown.map(h => h.sales));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>📊 Daily Reports</h2>
          <p style={subtitleStyle}>Performance summary for {user?.full_name}</p>
        </div>
        <div style={headerActionsStyle}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={dateInputStyle}
          />
          <button onClick={() => exportReport('pdf')} style={exportButtonStyle}>
            📄 Export PDF
          </button>
          <button onClick={() => exportReport('excel')} style={exportButtonStyle}>
            📊 Export Excel
          </button>
          <button onClick={printReport} style={printButtonStyle}>
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={metricsContainerStyle}>
        <h3 style={sectionTitleStyle}>📈 Key Performance Metrics</h3>
        <div style={metricsGridStyle}>
          <div style={metricCardStyle}>
            <div style={metricIconStyle}>💰</div>
            <div>
              <div style={metricValueStyle}>TSh {reportData.salesSummary.totalSales?.toLocaleString()}</div>
              <div style={metricLabelStyle}>Total Sales</div>
            </div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricIconStyle}>🛒</div>
            <div>
              <div style={metricValueStyle}>{reportData.salesSummary.totalTransactions}</div>
              <div style={metricLabelStyle}>Transactions</div>
            </div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricIconStyle}>👥</div>
            <div>
              <div style={metricValueStyle}>{reportData.salesSummary.totalCustomers}</div>
              <div style={metricLabelStyle}>Customers Served</div>
            </div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricIconStyle}>📦</div>
            <div>
              <div style={metricValueStyle}>{reportData.salesSummary.totalItems}</div>
              <div style={metricLabelStyle}>Items Sold</div>
            </div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricIconStyle}>📊</div>
            <div>
              <div style={metricValueStyle}>TSh {reportData.salesSummary.averageTransaction?.toLocaleString()}</div>
              <div style={metricLabelStyle}>Avg Transaction</div>
            </div>
          </div>
        </div>
      </div>

      <div style={reportsGridStyle}>
        {/* Payment Methods Breakdown */}
        <div style={reportCardStyle}>
          <h3 style={cardTitleStyle}>💳 Payment Methods</h3>
          <div style={paymentBreakdownStyle}>
            {Object.entries(reportData.paymentBreakdown).map(([method, data]) => (
              <div key={method} style={paymentMethodRowStyle}>
                <div style={paymentMethodInfoStyle}>
                  <span style={paymentMethodIconStyle}>{getPaymentMethodIcon(method)}</span>
                  <span style={paymentMethodNameStyle}>{method.toUpperCase()}</span>
                </div>
                <div style={paymentMethodStatsStyle}>
                  <div style={paymentAmountStyle}>TSh {data.amount?.toLocaleString()}</div>
                  <div style={paymentCountStyle}>{data.count} transactions</div>
                </div>
                <div style={paymentPercentageStyle}>
                  {((data.amount / reportData.salesSummary.totalSales) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div style={reportCardStyle}>
          <h3 style={cardTitleStyle}>🏆 Top Selling Products</h3>
          <div style={topProductsStyle}>
            {reportData.topProducts.map((product, index) => (
              <div key={index} style={productRowStyle}>
                <div style={productRankStyle}>{index + 1}</div>
                <div style={productInfoStyle}>
                  <div style={productNameStyle}>{product.name}</div>
                  <div style={productStatsStyle}>
                    {product.quantity} units • TSh {product.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Statistics */}
        <div style={reportCardStyle}>
          <h3 style={cardTitleStyle}>👥 Customer Statistics</h3>
          <div style={customerStatsStyle}>
            <div style={customerStatRowStyle}>
              <span style={customerStatLabelStyle}>New Customers:</span>
              <span style={customerStatValueStyle}>{reportData.customerStats.newCustomers}</span>
            </div>
            <div style={customerStatRowStyle}>
              <span style={customerStatLabelStyle}>Returning Customers:</span>
              <span style={customerStatValueStyle}>{reportData.customerStats.returningCustomers}</span>
            </div>
            <div style={customerStatRowStyle}>
              <span style={customerStatLabelStyle}>Walk-in Customers:</span>
              <span style={customerStatValueStyle}>{reportData.customerStats.walkInCustomers}</span>
            </div>
          </div>
        </div>

        {/* Hourly Sales Breakdown */}
        <div style={reportCardStyle}>
          <h3 style={cardTitleStyle}>⏰ Hourly Sales Breakdown</h3>
          <div style={hourlyChartStyle}>
            {reportData.hourlyBreakdown.map((hour, index) => (
              <div key={index} style={hourlyBarContainerStyle}>
                <div
                  style={{
                    ...hourlyBarStyle,
                    height: `${(hour.sales / getMaxHourlySales()) * 100}%`
                  }}
                ></div>
                <div style={hourlyLabelStyle}>{hour.hour}</div>
                <div style={hourlySalesStyle}>TSh {hour.sales.toLocaleString()}</div>
                <div style={hourlyTransactionsStyle}>{hour.transactions} txn</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div style={summaryContainerStyle}>
        <h3 style={sectionTitleStyle}>📋 Performance Summary</h3>
        <div style={summaryContentStyle}>
          <div style={summaryItemStyle}>
            <strong>Sales Target Achievement:</strong>
            <span style={achievementStyle}>
              {((reportData.salesSummary.totalSales / (stats?.dailyTarget || 50000)) * 100).toFixed(1)}%
            </span>
          </div>
          <div style={summaryItemStyle}>
            <strong>Most Popular Payment Method:</strong>
            <span>
              {Object.entries(reportData.paymentBreakdown)
                .sort(([,a], [,b]) => b.amount - a.amount)[0]?.[0]?.toUpperCase() || 'N/A'}
            </span>
          </div>
          <div style={summaryItemStyle}>
            <strong>Peak Sales Hour:</strong>
            <span>
              {reportData.hourlyBreakdown
                .sort((a, b) => b.sales - a.sales)[0]?.hour || 'N/A'}
            </span>
          </div>
          <div style={summaryItemStyle}>
            <strong>Customer Retention Rate:</strong>
            <span>
              {((reportData.customerStats.returningCustomers / reportData.salesSummary.totalCustomers) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const subtitleStyle = { margin: '4px 0 0 0', color: '#718096', fontSize: '14px' };
const headerActionsStyle = { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' };
const dateInputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const exportButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };
const printButtonStyle = { background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };

const metricsContainerStyle = { marginBottom: '30px' };
const sectionTitleStyle = { margin: '0 0 16px 0', color: '#2d3748', fontSize: '1.2rem' };
const metricsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' };
const metricCardStyle = { background: '#fff', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const metricIconStyle = { fontSize: '32px' };
const metricValueStyle = { fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' };
const metricLabelStyle = { fontSize: '12px', color: '#718096' };

const reportsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '30px' };
const reportCardStyle = { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const cardTitleStyle = { margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem' };

const paymentBreakdownStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const paymentMethodRowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' };
const paymentMethodInfoStyle = { display: 'flex', alignItems: 'center', gap: '8px' };
const paymentMethodIconStyle = { fontSize: '20px' };
const paymentMethodNameStyle = { fontWeight: '600', color: '#2d3748' };
const paymentMethodStatsStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const paymentAmountStyle = { fontWeight: '700', color: '#38a169', fontSize: '16px' };
const paymentCountStyle = { fontSize: '12px', color: '#718096' };
const paymentPercentageStyle = { fontWeight: '600', color: '#4a5568', fontSize: '14px' };

const topProductsStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const productRowStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' };
const productRankStyle = { width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' };
const productInfoStyle = { flex: 1 };
const productNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '4px' };
const productStatsStyle = { fontSize: '12px', color: '#718096' };

const customerStatsStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const customerStatRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f7fafc', borderRadius: '8px' };
const customerStatLabelStyle = { fontWeight: '500', color: '#4a5568' };
const customerStatValueStyle = { fontWeight: '700', color: '#38a169', fontSize: '18px' };

const hourlyChartStyle = { display: 'flex', alignItems: 'end', gap: '8px', height: '200px', padding: '20px 0' };
const hourlyBarContainerStyle = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' };
const hourlyBarStyle = { width: '100%', background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', borderRadius: '4px 4px 0 0', minHeight: '10px' };
const hourlyLabelStyle = { fontSize: '10px', color: '#718096', fontWeight: '600' };
const hourlySalesStyle = { fontSize: '8px', color: '#4a5568', textAlign: 'center' };
const hourlyTransactionsStyle = { fontSize: '8px', color: '#718096' };

const summaryContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '24px' };
const summaryContentStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' };
const summaryItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fff', borderRadius: '8px' };
const achievementStyle = { fontWeight: '700', color: '#38a169', fontSize: '16px' };

export default DailyReports;