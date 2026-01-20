import { useState, useEffect } from 'react';

const EditStockModal = ({ item, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    category: '',
    batch_number: '',
    quantity: '',
    expiry_date: '',
    price: ''
  });

  useEffect(() => {
    if (item) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: item.name || '',
        generic_name: item.generic_name || '',
        category: item.category || '',
        batch_number: item.batch_number || '',
        quantity: item.quantity || '',
        expiry_date: item.expiry_date || '',
        price: item.price || ''
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(item.inventory_id, formData);
  };

  if (!item) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>✏️</span> Edit Stock Item
          </h3>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Medicine Name *</label>
              <input 
                type="text" 
                style={inputStyle} 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Generic Name</label>
              <input 
                type="text" 
                style={inputStyle} 
                value={formData.generic_name} 
                onChange={e => setFormData({...formData, generic_name: e.target.value})} 
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Category</label>
              <input 
                type="text" 
                style={inputStyle} 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                placeholder="e.g., Antibiotic"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Batch Number *</label>
              <input 
                type="text" 
                style={{...inputStyle, backgroundColor: '#f7fafc', cursor: 'not-allowed'}} 
                value={formData.batch_number} 
                disabled
                title="Batch number cannot be changed"
              />
              <small style={{ color: '#718096', fontSize: '12px' }}>Batch number cannot be changed</small>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Quantity *</label>
              <input 
                type="number" 
                style={inputStyle} 
                value={formData.quantity} 
                onChange={e => setFormData({...formData, quantity: e.target.value})} 
                required 
                min="0"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Price Per Unit (TSh) *</label>
              <input 
                type="number" 
                step="0.01" 
                style={inputStyle} 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                required 
                min="0"
              />
            </div>

            <div style={{...formGroupStyle, gridColumn: 'span 2'}}>
              <label style={labelStyle}>Expiry Date *</label>
              <input 
                type="date" 
                style={inputStyle} 
                value={formData.expiry_date} 
                onChange={e => setFormData({...formData, expiry_date: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" style={saveButtonStyle}>
              <span style={{ marginRight: '8px' }}>✓</span> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)'
};

const modalStyle = {
  background: '#fff',
  borderRadius: '16px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  animation: 'slideIn 0.3s ease-out'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '25px',
  borderBottom: '2px solid #e2e8f0'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#718096',
  padding: '5px 10px',
  borderRadius: '6px',
  transition: 'all 0.2s'
};

const formStyle = {
  padding: '25px'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '25px'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#2d3748'
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  border: '2px solid #e2e8f0',
  fontSize: '14px',
  transition: 'all 0.2s',
  outline: 'none'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end'
};

const cancelButtonStyle = {
  padding: '12px 24px',
  background: '#fff',
  color: '#718096',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.3s'
};

const saveButtonStyle = {
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.3s',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
};

export default EditStockModal;
