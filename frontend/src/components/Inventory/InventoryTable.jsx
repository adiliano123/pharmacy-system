const InventoryTable = ({ filteredData, handleDispense }) => {
  return (
    <div style={tableContainerStyle}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', textAlign: 'left' }}>
            <th style={thStyle}>Medicine</th>
            <th style={thStyle}>Batch</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Stock Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, i) => (
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
                <strong style={{ color: '#2d3748', fontSize: '15px' }}>{item.name}</strong>
                <br/>
                <small style={{ color: '#718096' }}>{item.generic_name}</small>
              </td>
              <td style={tdStyle}>
                <code style={{ background: '#edf2f7', padding: '4px 8px', borderRadius: '4px', color: '#4a5568' }}>
                  {item.batch_number}
                </code>
              </td>
              <td style={{ 
                  ...tdStyle, 
                  color: item.quantity <= 10 ? '#e53e3e' : '#2d3748', 
                  fontWeight: 'bold',
                  fontSize: '16px'
              }}>
                  {item.quantity}
              </td>
              <td style={tdStyle}>
                <span style={badgeStyle(
                  item.quantity <= 0 ? '#e53e3e' : 
                  item.quantity <= 10 ? '#ed8936' : 
                  '#48bb78'
                )}>
                  {item.quantity <= 0 ? '🚫 EMPTY' : item.quantity <= 10 ? '⚠️ LOW' : '✓ GOOD'}
                </span>
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    min="1" 
                    placeholder="Qty" 
                    style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e0' }} 
                    id={`qty-${i}`} 
                  />
                  <button 
                    onClick={() => handleDispense(item.inventory_id, document.getElementById(`qty-${i}`).value)} 
                    style={dispenseButtonStyle}
                  >
                    💊 Dispense
                  </button>
                </div>
              </td>
            </tr>
          ))}
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

const badgeStyle = (color) => ({ 
  backgroundColor: color, 
  color: '#fff', 
  padding: '6px 12px', 
  borderRadius: '20px', 
  fontSize: '11px', 
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'inline-block'
});

const dispenseButtonStyle = { 
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
  color: '#fff', 
  border: 'none', 
  padding: '8px 16px', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  fontSize: '13px',
  fontWeight: '600',
  transition: 'all 0.3s',
  boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)'
};

export default InventoryTable;
