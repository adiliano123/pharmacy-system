const SalesTable = ({ salesData, generateReceipt }) => {
  return (
    <div style={tableContainerStyle}>
      <div style={{ padding: '20px', borderBottom: '2px solid #e2e8f0' }}>
        <h3 style={{ margin: 0, color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📜</span> Daily Revenue Log
        </h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', textAlign: 'left' }}>
            <th style={thStyle}>Date & Time</th>
            <th style={thStyle}>Medicine</th>
            <th style={thStyle}>Qty Sold</th>
            <th style={thStyle}>Revenue</th>
            <th style={thStyle}>Sold By</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {salesData.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tdStyle, textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>📭</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d3748', marginBottom: '10px' }}>
                  No Sales Yet
                </div>
                <div style={{ fontSize: '14px', color: '#718096', marginBottom: '20px' }}>
                  Dispense medicine from the Inventory tab to see sales here
                </div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}>
                  💡 Tip: Go to Inventory → Dispense Medicine → Come back here to see the 🖨️ Receipt button
                </div>
              </td>
            </tr>
          ) : (
            salesData.map((sale, i) => (
            <tr 
              key={i} 
              style={{ 
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: i % 2 === 0 ? '#fff' : '#f7fafc',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#fff' : '#f7fafc'}
            >
              <td style={tdStyle}>
                <span style={{ color: '#4a5568', fontSize: '13px' }}>
                  {new Date(sale.sale_date).toLocaleString()}
                </span>
              </td>
              <td style={tdStyle}>
                <strong style={{ color: '#2d3748' }}>{sale.name}</strong>
                {sale.customer_name && (
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>
                    Customer: {sale.customer_name}
                  </div>
                )}
              </td>
              <td style={tdStyle}>
                <span style={{ color: '#4a5568', fontWeight: '600' }}>{sale.quantity_sold}</span>
              </td>
              <td style={{...tdStyle, color: '#48bb78', fontWeight: 'bold', fontSize: '16px'}}>
                TSh {parseFloat(sale.total_revenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>
                    {sale.employee_role === 'admin' ? '👑' : 
                     sale.employee_role === 'pharmacist' ? '💊' : '💰'}
                  </span>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#2d3748' }}>
                      {sale.employee_name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#718096' }}>
                      @{sale.employee_username || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td style={tdStyle}>
                <button 
                  onClick={() => generateReceipt(sale)} 
                  style={receiptButtonStyle}
                >
                  🖨️ Receipt
                </button>
              </td>
            </tr>
          ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const tdStyle = { 
  padding: '16px', 
  color: '#2d3748' 
};

const thStyle = {
  padding: '16px',
  fontWeight: '600',
  fontSize: '14px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tableContainerStyle = { 
  background: '#fff', 
  borderRadius: '16px', 
  overflow: 'hidden', 
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0'
};

const receiptButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  transition: 'all 0.3s',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
};

export default SalesTable;
