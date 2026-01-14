import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [view, setView] = useState('inventory'); // 'inventory' or 'sales'
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '', generic_name: '', category: '', batch_number: '', quantity: '', expiry_date: '', price: ''
  });

  // --- API CALLS ---
  const fetchInventory = () => {
    axios.get('http://localhost/pharmacy-system/api/modules/get_inventory.php')
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching data:", err));
  };

  const fetchSales = () => {
    axios.get('http://localhost/pharmacy-system/api/modules/get_sales.php')
      .then(res => setSalesData(res.data))
      .catch(err => console.error("Error fetching sales:", err));
  };

  useEffect(() => { 
    if (view === 'inventory') fetchInventory();
    if (view === 'sales') fetchSales();
  }, [view]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost/pharmacy-system/api/modules/add_medicine.php', formData)
      .then(() => {
        alert("Stock Added successfully!");
        fetchInventory();
        setFormData({ name: '', generic_name: '', category: '', batch_number: '', quantity: '', expiry_date: '', price: '' });
      })
      .catch(() => alert("Error adding stock."));
  };

  const handleDispense = (inventoryId, qty) => {
    if (!qty || qty <= 0) return alert("Enter a valid quantity.");
    axios.post('http://localhost/pharmacy-system/api/modules/dispense.php', {
        inventory_id: inventoryId,
        qty: parseInt(qty)
    })
    .then(() => {
        alert("Dispensed successfully!");
        fetchInventory();
        fetchSales(); // Refresh sales background data
    })
    .catch(err => alert(err.response?.data?.message || "Error dispensing"));
  };

  // --- BUSINESS LOGIC ---
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.generic_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = salesData.reduce((acc, curr) => acc + parseFloat(curr.total_revenue || 0), 0);
  const expiredCount = data.filter(item => item.days_left <= 0).length;
  const warningCount = data.filter(item => item.days_left > 0 && item.days_left <= 90).length;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>💊 Pharmacy ERP System</h1>

      {/* --- NAVIGATION TABS --- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        <button onClick={() => setView('inventory')} style={view === 'inventory' ? activeTabStyle : tabStyle}>📦 Inventory & Stock</button>
        <button onClick={() => setView('sales')} style={view === 'sales' ? activeTabStyle : tabStyle}>💰 Sales & Revenue</button>
      </div>

      {/* --- TOP SUMMARY CARDS --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ ...cardStyle, borderLeft: '10px solid #2ecc71' }}>
          <h4 style={{ margin: 0, color: '#7f8c8d' }}>Total Revenue</h4>
          <h2 style={{ margin: '10px 0', color: '#2ecc71' }}>${totalRevenue.toFixed(2)}</h2>
        </div>
        <div style={{ ...cardStyle, borderLeft: '10px solid #e74c3c' }}>
          <h4 style={{ margin: 0, color: '#7f8c8d' }}>Expired Items</h4>
          <h2 style={{ margin: '10px 0', color: '#e74c3c' }}>{expiredCount}</h2>
        </div>
        <div style={{ ...cardStyle, borderLeft: '10px solid #f39c12' }}>
          <h4 style={{ margin: 0, color: '#7f8c8d' }}>Expiring Soon</h4>
          <h2 style={{ margin: '10px 0', color: '#f39c12' }}>{warningCount}</h2>
        </div>
      </div>

      {view === 'inventory' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={panelStyle}>
              <h3>Add New Batch</h3>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="Medicine Name" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input type="text" placeholder="Batch Number" style={inputStyle} value={formData.batch_number} onChange={e => setFormData({...formData, batch_number: e.target.value})} required />
                <input type="number" placeholder="Quantity" style={inputStyle} value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                <input type="number" step="0.01" placeholder="Price Per Unit ($)" style={inputStyle} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                <input type="date" style={{...inputStyle, gridColumn: 'span 2'}} value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} required />
                <button type="submit" style={{...buttonStyle, gridColumn: 'span 2'}}>Add to Stock</button>
              </form>
            </div>
            <div style={panelStyle}>
              <h3>Quick Search</h3>
              <input type="text" placeholder="Search medicines..." style={{ ...inputStyle, width: '90%' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <p style={{marginTop: '20px', color: '#7f8c8d'}}>Tip: Check expiry status before dispensing.</p>
            </div>
          </div>

          <div style={tableContainerStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#2c3e50', color: '#fff', textAlign: 'left' }}>
                  <th style={tdStyle}>Medicine</th>
                  <th style={tdStyle}>Batch</th>
                  <th style={tdStyle}>Qty</th>
                  <th style={tdStyle}>Expiry</th>
                  <th style={tdStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}><strong>{item.name}</strong><br/><small>{item.generic_name}</small></td>
                    <td style={tdStyle}><code>{item.batch_number}</code></td>
                    <td style={tdStyle}>{item.quantity}</td>
                    <td style={tdStyle}>
                      <span style={badgeStyle(item.days_left <= 0 ? '#e74c3c' : item.days_left <= 90 ? '#f39c12' : '#2ecc71')}>
                        {item.days_left <= 0 ? 'EXPIRED' : `${item.days_left} days left`}
                      </span>
                    </td>
                    <td style={tdStyle}>
                       <input type="number" min="1" placeholder="Qty" style={{ width: '45px', marginRight: '5px' }} id={`qty-${i}`} />
                       <button onClick={() => handleDispense(item.inventory_id, document.getElementById(`qty-${i}`).value)} style={dispenseButtonStyle}>Dispense</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* --- SALES LOG VIEW --- */
        <div style={tableContainerStyle}>
          <h3 style={{ padding: '15px' }}>📜 Daily Revenue Log</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: '#fff', textAlign: 'left' }}>
                <th style={tdStyle}>Date & Time</th>
                <th style={tdStyle}>Medicine</th>
                <th style={tdStyle}>Qty Sold</th>
                <th style={tdStyle}>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesData.length > 0 ? salesData.map((sale, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{new Date(sale.sale_date).toLocaleString()}</td>
                  <td style={tdStyle}><strong>{sale.name}</strong><br/><small>Batch: {sale.batch_number}</small></td>
                  <td style={tdStyle}>{sale.quantity_sold}</td>
                  <td style={{...tdStyle, color: '#2ecc71', fontWeight: 'bold'}}>${parseFloat(sale.total_revenue).toFixed(2)}</td>
                </tr>
              )) : <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No sales recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #dde1e7' };
const buttonStyle = { padding: '10px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const dispenseButtonStyle = { backgroundColor: '#e67e22', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const tdStyle = { padding: '12px' };
const panelStyle = { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const cardStyle = { flex: 1, padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const tableContainerStyle = { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const badgeStyle = (color) => ({ backgroundColor: color, color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' });
const tabStyle = { padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: '8px', background: '#ddd' };
const activeTabStyle = { ...tabStyle, background: '#2c3e50', color: '#fff' };

export default App;