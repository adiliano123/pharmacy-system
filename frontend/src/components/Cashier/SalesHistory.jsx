import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const SalesHistory = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [filters, setFilters] = useState({
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    customerName: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesHistory();
  }, []);  

  useEffect(() => {
    applyFilters();
  }, [sales, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSalesHistory = async () => {
    setLoading(true);
    try {
      // Get session token from localStorage (correct key)
      const sessionToken = localStorage.getItem('session_token');
      
      if (!sessionToken) {
        throw new Error('Please log in to view sales history');
      }

      const response = await fetch('http://localhost/pharmacy-system/api/modules/get_sales.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Transform the data to match our component structure
          const transformedSales = result.data.map(sale => ({
            id: sale.id,
            transaction_id: `TXN${sale.id.toString().padStart(3, '0')}`,
            customer_name: sale.customer_name || 'Walk-in Customer',
            items: [{
              name: sale.name,
              quantity: sale.quantity_sold,
              price: sale.total_revenue / sale.quantity_sold
            }],
            subtotal: sale.total_revenue,
            discount: 0, // Can be calculated if discount info is available
            total: sale.total_revenue,
            payment_method: sale.notes?.toLowerCase().includes('cash') ? 'cash' : 
                           sale.notes?.toLowerCase().includes('card') ? 'card' : 
                           sale.notes?.toLowerCase().includes('mobile') ? 'mobile' : 'cash',
            sale_date: sale.sale_date,
            cashier: sale.employee_name || 'Unknown'
          }));
          setSales(transformedSales);
        } else {
          throw new Error(result.message);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching sales history:', error);
      alert(`Failed to load sales history: ${error.message}`);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = sales.filter(sale => {
      const saleDate = new Date(sale.sale_date).toISOString().split('T')[0];
      const dateMatch = saleDate >= filters.dateFrom && saleDate <= filters.dateTo;
      const paymentMatch = !filters.paymentMethod || sale.payment_method === filters.paymentMethod;
      const customerMatch = !filters.customerName || 
        sale.customer_name.toLowerCase().includes(filters.customerName.toLowerCase());
      
      return dateMatch && paymentMatch && customerMatch;
    });

    setFilteredSales(filtered);
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

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'cash': return '#38a169';
      case 'card': return '#3182ce';
      case 'mobile': return '#d69e2e';
      case 'insurance': return '#805ad5';
      default: return '#718096';
    }
  };

  const getTotalSales = () => {
    return filteredSales.reduce((total, sale) => total + sale.total, 0);
  };

  const printReceipt = (sale) => {
    // Mock print functionality
    alert(`Printing receipt for transaction ${sale.transaction_id}...`);
  };

  const refundSale = (sale) => {
    if (window.confirm(`Are you sure you want to refund transaction ${sale.transaction_id}?`)) {
      alert(`Refund processed for transaction ${sale.transaction_id}`);
      // In real implementation, this would process the refund
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>📋 Sales History</h2>
        <div style={summaryStyle}>
          <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>Total Sales:</span>
            <span style={summaryValueStyle}>TSh {getTotalSales().toLocaleString()}</span>
          </div>
          <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>Transactions:</span>
            <span style={summaryValueStyle}>{filteredSales.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={filtersContainerStyle}>
        <h3 style={filtersTitleStyle}>🔍 Filter Sales</h3>
        <div style={filtersGridStyle}>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
              style={selectStyle}
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile">Mobile Money</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Customer Name</label>
            <input
              type="text"
              placeholder="Search customer..."
              value={filters.customerName}
              onChange={(e) => setFilters({...filters, customerName: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div style={salesContainerStyle}>
        {loading ? (
          <div style={loadingStyle}>Loading sales history...</div>
        ) : filteredSales.length === 0 ? (
          <div style={noDataStyle}>
            <div style={noDataIconStyle}>📋</div>
            <div>No sales found matching your criteria</div>
          </div>
        ) : (
          <div style={salesListStyle}>
            {filteredSales.map(sale => (
              <div key={sale.id} style={saleCardStyle}>
                <div style={saleHeaderStyle}>
                  <div style={saleInfoStyle}>
                    <div style={transactionIdStyle}>#{sale.transaction_id}</div>
                    <div style={customerNameStyle}>{sale.customer_name}</div>
                    <div style={saleDateStyle}>
                      {new Date(sale.sale_date).toLocaleString()}
                    </div>
                  </div>
                  <div style={saleAmountStyle}>
                    <div style={totalAmountStyle}>TSh {sale.total.toLocaleString()}</div>
                    <div
                      style={{
                        ...paymentBadgeStyle,
                        backgroundColor: getPaymentMethodColor(sale.payment_method)
                      }}
                    >
                      {getPaymentMethodIcon(sale.payment_method)} {sale.payment_method.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div style={saleItemsStyle}>
                  <h4 style={itemsHeaderStyle}>Items Purchased:</h4>
                  <div style={itemsListStyle}>
                    {sale.items.map((item, index) => (
                      <div key={index} style={itemRowStyle}>
                        <span style={itemNameStyle}>{item.name}</span>
                        <span style={itemQuantityStyle}>Qty: {item.quantity}</span>
                        <span style={itemPriceStyle}>TSh {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={saleSummaryStyle}>
                  <div style={summaryRowStyle}>
                    <span>Subtotal:</span>
                    <span>TSh {sale.subtotal.toLocaleString()}</span>
                  </div>
                  {sale.discount > 0 && (
                    <div style={summaryRowStyle}>
                      <span>Discount:</span>
                      <span style={discountAmountStyle}>-TSh {sale.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={finalTotalRowStyle}>
                    <span>Total:</span>
                    <span>TSh {sale.total.toLocaleString()}</span>
                  </div>
                </div>

                <div style={saleActionsStyle}>
                  <button
                    onClick={() => printReceipt(sale)}
                    style={printButtonStyle}
                  >
                    🖨️ Print Receipt
                  </button>
                  <button
                    onClick={() => refundSale(sale)}
                    style={refundButtonStyle}
                  >
                    🔄 Refund
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const summaryStyle = { display: 'flex', gap: '24px' };
const summaryItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const summaryLabelStyle = { fontSize: '12px', color: '#718096', marginBottom: '4px' };
const summaryValueStyle = { fontSize: '18px', fontWeight: '700', color: '#2d3748' };

const filtersContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px' };
const filtersTitleStyle = { margin: '0 0 16px 0', color: '#2d3748', fontSize: '1.1rem' };
const filtersGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' };
const filterGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const selectStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' };

const salesContainerStyle = { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const loadingStyle = { textAlign: 'center', padding: '40px', color: '#718096' };
const noDataStyle = { textAlign: 'center', padding: '60px 20px' };
const noDataIconStyle = { fontSize: '48px', marginBottom: '16px' };

const salesListStyle = { display: 'flex', flexDirection: 'column' };
const saleCardStyle = { padding: '24px', borderBottom: '1px solid #e2e8f0' };
const saleHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' };
const saleInfoStyle = { flex: 1 };
const transactionIdStyle = { fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' };
const customerNameStyle = { fontSize: '14px', color: '#4a5568', marginBottom: '4px' };
const saleDateStyle = { fontSize: '12px', color: '#718096' };
const saleAmountStyle = { display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '8px' };
const totalAmountStyle = { fontSize: '24px', fontWeight: '700', color: '#38a169' };
const paymentBadgeStyle = { color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' };

const saleItemsStyle = { marginBottom: '16px' };
const itemsHeaderStyle = { margin: '0 0 12px 0', fontSize: '14px', color: '#2d3748' };
const itemsListStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const itemRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f7fafc', borderRadius: '6px' };
const itemNameStyle = { flex: 1, fontSize: '14px', color: '#2d3748' };
const itemQuantityStyle = { fontSize: '12px', color: '#4a5568', minWidth: '60px' };
const itemPriceStyle = { fontSize: '14px', fontWeight: '600', color: '#38a169', minWidth: '80px', textAlign: 'right' };

const saleSummaryStyle = { marginBottom: '16px', padding: '12px', background: '#f7fafc', borderRadius: '8px' };
const summaryRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' };
const discountAmountStyle = { color: '#e53e3e' };
const finalTotalRowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: '#2d3748', borderTop: '1px solid #e2e8f0', paddingTop: '8px' };

const saleActionsStyle = { display: 'flex', gap: '12px' };
const printButtonStyle = { background: '#bee3f8', color: '#2b6cb0', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };
const refundButtonStyle = { background: '#fed7d7', color: '#c53030', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };

export default SalesHistory;