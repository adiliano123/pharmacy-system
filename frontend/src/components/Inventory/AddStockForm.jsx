const AddStockForm = ({ formData, setFormData, handleSubmit }) => {
  return (
    <div style={panelStyle}>
      <h3 style={{ marginTop: 0, color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>➕</span> Add New Batch
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="Medicine Name *" 
          style={inputStyle} 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Generic Name" 
          style={inputStyle} 
          value={formData.generic_name} 
          onChange={e => setFormData({...formData, generic_name: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Category (e.g., Antibiotic)" 
          style={inputStyle} 
          value={formData.category} 
          onChange={e => setFormData({...formData, category: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Batch Number *" 
          style={inputStyle} 
          value={formData.batch_number} 
          onChange={e => setFormData({...formData, batch_number: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Quantity *" 
          style={inputStyle} 
          value={formData.quantity} 
          onChange={e => setFormData({...formData, quantity: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Price Per Unit (TSh) *" 
          style={inputStyle} 
          value={formData.price} 
          onChange={e => setFormData({...formData, price: e.target.value})} 
          required 
        />
        <input 
          type="date" 
          placeholder="Expiry Date *"
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
  padding: '14px 18px', 
  borderRadius: '12px', 
  border: '2px solid #e2e8f0', 
  fontSize: '14px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  outline: 'none',
  fontFamily: 'inherit'
};

const buttonStyle = { 
  padding: '14px 28px', 
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '12px', 
  cursor: 'pointer', 
  fontWeight: '600',
  fontSize: '15px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
  position: 'relative',
  overflow: 'hidden'
};

const panelStyle = { 
  background: '#fff', 
  padding: '30px', 
  borderRadius: '20px', 
  boxShadow: '0 6px 30px rgba(0,0,0,0.1)',
  border: '1px solid #e2e8f0',
  animation: 'fadeInUp 0.5s ease'
};

export default AddStockForm;
