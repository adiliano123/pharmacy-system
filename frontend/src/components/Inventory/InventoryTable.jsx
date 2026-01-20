import { useState } from 'react';
import EditStockModal from './EditStockModal';

const InventoryTable = ({ filteredData, handleDispense, handleUpdate }) => {
  const [editingItem, setEditingItem] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getExpiryStatus = (daysUntilExpiry) => {
    if (daysUntilExpiry < 0) return { color: '#e53e3e', text: '🚫 EXPIRED', bg: '#fed7d7' };
    if (daysUntilExpiry <= 30) return { color: '#ed8936', text: '⚠️ EXPIRING SOON', bg: '#feebc8' };
    return { color: '#48bb78', text: '✓ VALID', bg: '#c6f6d5' };
  };

  const handleUpdateStock = (inventoryId, formData) => {
    handleUpdate(inventoryId, formData);
    setEditingItem(null);
  };

  return (
    <>
      <div style={tableContainerStyle}>
        <div style={{ padding: '20px', borderBottom: '2px solid #e2e8f0', background: '#f7fafc' }}>
          <h3 style={{ margin: 0, color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>📦</span> 
            Current Stock ({filteredData.length} items)
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', textAlign: 'left' }}>
                <th style={thStyle}>Medicine</th>
                <th style={thStyle}>Batch</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Expiry Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#718096' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>No items in inventory</div>
                    <div style={{ fontSize: '14px', marginTop: '5px' }}>Add your first batch using the form above</div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, i) => {
                  const expiryStatus = getExpiryStatus(item.days_until_expiry);
                  return (
                    <tr 
                      key={item.inventory_id || i} 
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
                        <small style={{ color: '#718096' }}>
                          {item.generic_name || 'No generic name'}
                          {item.category && <span> • {item.category}</span>}
                        </small>
                      </td>
                      <td style={tdStyle}>
                        <code style={{ background: '#edf2f7', padding: '4px 8px', borderRadius: '4px', color: '#4a5568', fontSize: '12px' }}>
                          {item.batch_number}
                        </code>
                      </td>
                      <td style={{ 
                          ...tdStyle, 
                          color: item.quantity <= 10 ? '#e53e3e' : '#2d3748', 
                          fontWeight: 'bold',
                          fontSize: '18px'
                      }}>
                          {item.quantity}
                          <br/>
                          <small style={{ 
                            fontSize: '11px', 
                            fontWeight: 'normal',
                            color: item.quantity <= 0 ? '#e53e3e' : item.quantity <= 10 ? '#ed8936' : '#718096'
                          }}>
                            {item.quantity <= 0 ? 'OUT OF STOCK' : item.quantity <= 10 ? 'LOW STOCK' : 'In Stock'}
                          </small>
                      </td>
                      <td style={tdStyle}>
                        <strong style={{ color: '#2d3748', fontSize: '15px' }}>TSh {parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                        <br/>
                        <small style={{ color: '#718096' }}>per unit</small>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontSize: '14px', color: '#2d3748', fontWeight: '500' }}>
                          {formatDate(item.expiry_date)}
                        </div>
                        <small style={{ color: expiryStatus.color, fontSize: '11px', fontWeight: '600' }}>
                          {item.days_until_expiry < 0 
                            ? `Expired ${Math.abs(item.days_until_expiry)} days ago`
                            : `${item.days_until_expiry} days left`
                          }
                        </small>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          ...badgeStyle(expiryStatus.color),
                          background: expiryStatus.bg,
                          color: expiryStatus.color
                        }}>
                          {expiryStatus.text}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => setEditingItem(item)}
                            style={editButtonStyle}
                            title="Edit stock details"
                          >
                            ✏️ Edit
                          </button>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="number" 
                              min="1" 
                              max={item.quantity}
                              placeholder="Qty" 
                              style={{ 
                                width: '60px', 
                                padding: '6px', 
                                borderRadius: '6px', 
                                border: '1px solid #cbd5e0',
                                fontSize: '13px'
                              }} 
                              id={`qty-${item.inventory_id}`}
                              disabled={item.quantity <= 0}
                            />
                            <button 
                              onClick={() => handleDispense(item.inventory_id, document.getElementById(`qty-${item.inventory_id}`).value)} 
                              style={{
                                ...dispenseButtonStyle,
                                opacity: item.quantity <= 0 ? 0.5 : 1,
                                cursor: item.quantity <= 0 ? 'not-allowed' : 'pointer'
                              }}
                              disabled={item.quantity <= 0}
                            >
                              💊 Dispense
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingItem && (
        <EditStockModal 
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleUpdateStock}
        />
      )}
    </>
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
  padding: '8px 12px', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  fontSize: '13px',
  fontWeight: '600',
  transition: 'all 0.3s',
  boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)'
};

const editButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  transition: 'all 0.3s',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  whiteSpace: 'nowrap'
};

export default InventoryTable;
