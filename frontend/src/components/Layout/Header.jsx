const Header = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '35px' }}>
      <div style={{ fontSize: '48px' }}>💊</div>
      <h1 style={{ 
        color: '#1a202c', 
        margin: 0, 
        fontSize: '2.5rem', 
        fontWeight: '700', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent' 
      }}>
        Pharmacy ERP System
      </h1>
    </div>
  );
};

export default Header;
