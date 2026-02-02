import { useState, useEffect } from 'react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    allergies: '',
    medicalConditions: '',
    insuranceProvider: '',
    insuranceNumber: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Get session token from localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      
      if (!sessionToken) {
        throw new Error('Please log in to view customers');
      }

      const response = await fetch('http://localhost/pharmacy-system/api/modules/get_customers.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Transform data to match component structure
          const transformedCustomers = result.data.map(customer => ({
            id: customer.id,
            name: customer.name,
            phone: customer.phone || 'Not provided',
            email: customer.email || 'Not provided',
            address: 'Not provided', // Can be added to database later
            dateOfBirth: 'Not provided',
            allergies: 'Not provided',
            medicalConditions: 'Not provided',
            insuranceProvider: 'Not provided',
            insuranceNumber: 'Not provided',
            totalPurchases: customer.total_purchases,
            totalSpent: customer.total_spent,
            lastVisit: customer.last_purchase,
            createdAt: customer.first_purchase
          }));
          setCustomers(transformedCustomers);
        } else {
          throw new Error(result.message);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert(`Failed to load customers: ${error.message}`);
      setCustomers([]);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const customerData = {
        ...formData,
        id: editingCustomer ? editingCustomer.id : Date.now(),
        totalPurchases: editingCustomer ? editingCustomer.totalPurchases : 0,
        totalSpent: editingCustomer ? editingCustomer.totalSpent : 0,
        lastVisit: editingCustomer ? editingCustomer.lastVisit : null,
        createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString().split('T')[0]
      };

      if (editingCustomer) {
        setCustomers(customers.map(c => c.id === editingCustomer.id ? customerData : c));
        alert('Customer updated successfully!');
      } else {
        setCustomers([...customers, customerData]);
        alert('Customer added successfully!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer');
    }
  };

  const deleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      setCustomers(customers.filter(c => c.id !== customerId));
      alert('Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      dateOfBirth: '',
      allergies: '',
      medicalConditions: '',
      insuranceProvider: '',
      insuranceNumber: ''
    });
    setShowAddForm(false);
    setEditingCustomer(null);
  };

  const startEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      dateOfBirth: customer.dateOfBirth || '',
      allergies: customer.allergies || '',
      medicalConditions: customer.medicalConditions || '',
      insuranceProvider: customer.insuranceProvider || '',
      insuranceNumber: customer.insuranceNumber || ''
    });
    setShowAddForm(true);
  };

  const getCustomerAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>👥 Customer Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          style={addButtonStyle}
        >
          ➕ Add New Customer
        </button>
      </div>

      {/* Search */}
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Search customers by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Add/Edit Customer Form */}
      {showAddForm && (
        <div style={formContainerStyle}>
          <div style={formHeaderStyle}>
            <h3 style={formTitleStyle}>
              {editingCustomer ? '✏️ Edit Customer' : '➕ Add New Customer'}
            </h3>
            <button onClick={resetForm} style={closeButtonStyle}>❌</button>
          </div>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGridStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={textareaStyle}
                  rows="2"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Known Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  style={inputStyle}
                  placeholder="e.g., Penicillin, Aspirin"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Medical Conditions</label>
                <input
                  type="text"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                  style={inputStyle}
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Insurance Provider</label>
                <select
                  value={formData.insuranceProvider}
                  onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                  style={selectStyle}
                >
                  <option value="">Select Insurance</option>
                  <option value="NHIF">NHIF</option>
                  <option value="AAR">AAR Insurance</option>
                  <option value="Jubilee">Jubilee Insurance</option>
                  <option value="Britam">Britam Insurance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Insurance Number</label>
                <input
                  type="text"
                  value={formData.insuranceNumber}
                  onChange={(e) => setFormData({...formData, insuranceNumber: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={formActionsStyle}>
              <button type="button" onClick={resetForm} style={cancelButtonStyle}>
                Cancel
              </button>
              <button type="submit" style={submitButtonStyle}>
                {editingCustomer ? 'Update Customer' : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customers List */}
      <div style={customersContainerStyle}>
        <h3 style={sectionTitleStyle}>Registered Customers ({filteredCustomers.length})</h3>
        
        {filteredCustomers.length === 0 ? (
          <div style={noDataStyle}>
            <div style={noDataIconStyle}>👥</div>
            <div>No customers found</div>
          </div>
        ) : (
          <div style={customersGridStyle}>
            {filteredCustomers.map(customer => (
              <div key={customer.id} style={customerCardStyle}>
                <div style={customerHeaderStyle}>
                  <div style={customerAvatarStyle}>
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={customerInfoStyle}>
                    <div style={customerNameStyle}>{customer.name}</div>
                    <div style={customerContactStyle}>{customer.phone}</div>
                    {customer.email && (
                      <div style={customerEmailStyle}>{customer.email}</div>
                    )}
                  </div>
                  <div style={customerStatsStyle}>
                    <div style={statItemStyle}>
                      <div style={statValueStyle}>{customer.totalPurchases}</div>
                      <div style={statLabelStyle}>Purchases</div>
                    </div>
                    <div style={statItemStyle}>
                      <div style={statValueStyle}>TSh {customer.totalSpent.toLocaleString()}</div>
                      <div style={statLabelStyle}>Total Spent</div>
                    </div>
                  </div>
                </div>

                <div style={customerDetailsStyle}>
                  {customer.dateOfBirth && (
                    <div style={detailItemStyle}>
                      <span style={detailLabelStyle}>Age:</span>
                      <span>{getCustomerAge(customer.dateOfBirth)} years</span>
                    </div>
                  )}
                  {customer.allergies && (
                    <div style={detailItemStyle}>
                      <span style={detailLabelStyle}>Allergies:</span>
                      <span style={allergyTextStyle}>{customer.allergies}</span>
                    </div>
                  )}
                  {customer.medicalConditions && (
                    <div style={detailItemStyle}>
                      <span style={detailLabelStyle}>Conditions:</span>
                      <span>{customer.medicalConditions}</span>
                    </div>
                  )}
                  {customer.insuranceProvider && (
                    <div style={detailItemStyle}>
                      <span style={detailLabelStyle}>Insurance:</span>
                      <span>{customer.insuranceProvider} - {customer.insuranceNumber}</span>
                    </div>
                  )}
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Last Visit:</span>
                    <span>
                      {customer.lastVisit ? 
                        new Date(customer.lastVisit).toLocaleDateString() : 
                        'Never'
                      }
                    </span>
                  </div>
                </div>

                <div style={customerActionsStyle}>
                  <button
                    onClick={() => startEdit(customer)}
                    style={editButtonStyle}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    style={deleteButtonStyle}
                  >
                    🗑️ Delete
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
const addButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

const searchContainerStyle = { marginBottom: '24px' };
const searchInputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' };

const formContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '24px', marginBottom: '24px' };
const formHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const formTitleStyle = { margin: 0, color: '#2d3748', fontSize: '1.2rem' };
const closeButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const textareaStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', resize: 'vertical' };
const selectStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' };

const formActionsStyle = { display: 'flex', gap: '12px', justifyContent: 'flex-end' };
const cancelButtonStyle = { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };
const submitButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };

const customersContainerStyle = { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const sectionTitleStyle = { margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem' };
const noDataStyle = { textAlign: 'center', padding: '60px 20px' };
const noDataIconStyle = { fontSize: '48px', marginBottom: '16px' };

const customersGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' };
const customerCardStyle = { border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' };
const customerHeaderStyle = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' };
const customerAvatarStyle = { width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700' };
const customerInfoStyle = { flex: 1 };
const customerNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '16px', marginBottom: '4px' };
const customerContactStyle = { color: '#4a5568', fontSize: '14px', marginBottom: '2px' };
const customerEmailStyle = { color: '#718096', fontSize: '12px' };
const customerStatsStyle = { display: 'flex', gap: '16px' };
const statItemStyle = { textAlign: 'center' };
const statValueStyle = { fontSize: '16px', fontWeight: '700', color: '#38a169', marginBottom: '2px' };
const statLabelStyle = { fontSize: '10px', color: '#718096' };

const customerDetailsStyle = { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' };
const detailItemStyle = { display: 'flex', gap: '8px', fontSize: '14px' };
const detailLabelStyle = { fontWeight: '600', color: '#4a5568', minWidth: '80px' };
const allergyTextStyle = { color: '#e53e3e', fontWeight: '500' };

const customerActionsStyle = { display: 'flex', gap: '8px' };
const editButtonStyle = { background: '#bee3f8', color: '#2b6cb0', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };
const deleteButtonStyle = { background: '#fed7d7', color: '#c53030', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };

export default CustomerManagement;