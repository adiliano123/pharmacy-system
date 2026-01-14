const SearchPanel = ({ searchTerm, setSearchTerm, resultCount }) => {
  return (
    <div style={panelStyle}>
      <h3 style={{ marginTop: 0, color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🔍</span> Quick Search
      </h3>
      <input 
        type="text" 
        placeholder="Search medicines by name..." 
        style={{ ...inputStyle, width: '100%', fontSize: '16px' }} 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <div style={{ marginTop: '20px', padding: '15px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
        <p style={{ margin: 0, color: '#4a5568', fontSize: '14px' }}>
          <strong>{resultCount}</strong> items found
        </p>
      </div>
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

const panelStyle = { 
  background: '#fff', 
  padding: '25px', 
  borderRadius: '16px', 
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0'
};

export default SearchPanel;
