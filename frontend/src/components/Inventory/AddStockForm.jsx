const AddStockForm = ({ formData, setFormData, handleSubmit }) => {
  return (
    <div style={panelStyle}>
      <h3 style={{ marginTop: 0, color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>➕</span> Add New Batch
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="Medicine Name" 
          style={inputStyle} 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Batch Number" 
          style={inputStyle} 
          value={formData.batch_number} 
          onChange={e => setFormData({...formData, batch_number: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          style={inputStyle} 
          value={formData.quantity} 
          onChange={e => setFormData({...formData, quantity: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Price Per Unit ($)" 
          style={inputStyle} 
          value={formData.price} 
          onChange={e => setFormData({...formData, price: e.target.value})} 
          required 
        />
        <input 
          type="date" 
          style={{...inputStyle, gridColumn: 'span 2'}} 
          value={formData.expiry_date} 
          onChange={e => setFormData({...formData, expiry_date: e.target.value})} 
          required 
        />
        <button type="submit" style={{...buttonStyle, gridColumn: 'span 2'}}>
          <span style={{ marginRight: '8px' }}>✓</span> Add to Stock
        </button>
      </form>
    </div>
  );
};

const inputStyle = { 
  padding: '12px 16px', 
  borderRadius: '8px', 
  border: '2px solid #e2e8f0', 
  fontSize: '14px',
  transition: 'all 0.2s',
  outline: 'none'
};

const buttonStyle = { 
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

const panelStyle = { 
  background: '#fff', 
  padding: '25px', 
  borderRadius: '16px', 
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0'
};

export default AddStockForm;
