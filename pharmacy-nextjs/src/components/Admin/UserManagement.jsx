'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const UserManagement = ({ onStatsUpdate }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role: 'pharmacist',
    is_active: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pharmacy-system/api';
        const response = await fetch(`${API_URL}/modules/admin_users.php?action=list`);
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            if (data.success) {
              setUsers(data.users);
              return;
            }
          } catch (jsonError) {
            console.warn('JSON parse error:', jsonError, 'Response:', text.substring(0, 200));
          }
        }
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
      }
      
      // Fallback to mock data if API fails
      const mockUsers = [
        {
          user_id: 1,
          username: 'admin',
          full_name: 'System Administrator',
          email: 'admin@pharmacy.com',
          role: 'admin',
          is_active: true,
          created_at: '2024-01-01',
          last_login: '2024-01-31'
        },
        {
          user_id: 2,
          username: 'pharmacist1',
          full_name: 'John Pharmacist',
          email: 'john@pharmacy.com',
          role: 'pharmacist',
          is_active: true,
          created_at: '2024-01-02',
          last_login: '2024-01-30'
        },
        {
          user_id: 3,
          username: 'cashier1',
          full_name: 'Jane Cashier',
          email: 'jane@pharmacy.com',
          role: 'cashier',
          is_active: true,
          created_at: '2024-01-03',
          last_login: '2024-01-29'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Try API first
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pharmacy-system/api';
        const url = editingUser ? `${API_URL}/modules/admin_users.php?action=update` : `${API_URL}/modules/admin_users.php?action=create`;
        const payload = editingUser ? { ...formData, user_id: editingUser.user_id } : formData;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            alert(editingUser ? 'User updated successfully!' : 'User created successfully!');
            resetForm();
            fetchUsers();
            onStatsUpdate?.();
            return;
          }
        }
      } catch (apiError) {
        console.warn('API not available, using mock operation:', apiError);
      }
      
      // Fallback to mock operation
      const newUser = {
        user_id: Date.now(),
        ...formData,
        created_at: new Date().toISOString().split('T')[0],
        last_login: null
      };

      if (editingUser) {
        setUsers(users.map(u => u.user_id === editingUser.user_id ? { ...u, ...formData } : u));
        alert('User updated successfully! (Mock Mode)');
      } else {
        setUsers([...users, newUser]);
        alert('User created successfully! (Mock Mode)');
      }

      resetForm();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user: ' + error.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // Try API first
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pharmacy-system/api';
        const response = await fetch(`${API_URL}/modules/admin_users.php?action=delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId })
        });
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            alert('User deleted successfully!');
            fetchUsers();
            onStatsUpdate?.();
            return;
          }
        }
      } catch (apiError) {
        console.warn('API not available, using mock operation:', apiError);
      }
      
      // Fallback to mock operation
      setUsers(users.filter(u => u.user_id !== userId));
      alert('User deleted successfully! (Mock Mode)');
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + error.message);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      // Try API first
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pharmacy-system/api';
        const response = await fetch(`${API_URL}/modules/admin_users.php?action=toggle_status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId })
        });
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            alert('User status updated successfully!');
            fetchUsers();
            onStatsUpdate?.();
            return;
          }
        }
      } catch (apiError) {
        console.warn('API not available, using mock operation:', apiError);
      }
      
      // Fallback to mock operation
      setUsers(users.map(u => 
        u.user_id === userId ? { ...u, is_active: !u.is_active } : u
      ));
      alert('User status updated successfully! (Mock Mode)');
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      full_name: '',
      email: '',
      role: 'pharmacist',
      is_active: true
    });
    setShowAddUserForm(false);
    setEditingUser(null);
  };

  const startEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({
      username: userToEdit.username,
      password: '', // Don't populate password for security
      full_name: userToEdit.full_name,
      email: userToEdit.email || '',
      role: userToEdit.role,
      is_active: userToEdit.is_active
    });
    setShowAddUserForm(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e53e3e';
      case 'pharmacist': return '#3182ce';
      case 'cashier': return '#38a169';
      default: return '#718096';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👑';
      case 'pharmacist': return '💊';
      case 'cashier': return '💰';
      default: return '👤';
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>👥 User Management</h2>
        <button
          onClick={() => setShowAddUserForm(true)}
          style={addButtonStyle}
        >
          ➕ Add New User
        </button>
      </div>

      {/* Add/Edit User Form */}
      {showAddUserForm && (
        <div style={formContainerStyle}>
          <div style={formHeaderStyle}>
            <h3 style={formTitleStyle}>
              {editingUser ? '✏️ Edit User' : '➕ Add New User'}
            </h3>
            <button onClick={resetForm} style={closeButtonStyle}>❌</button>
          </div>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGridStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  style={inputStyle}
                  required
                  disabled={editingUser} // Don't allow username changes
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={inputStyle}
                  required={!editingUser}
                  minLength="6"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={selectStyle}
                  required
                >
                  <option value="pharmacist">Pharmacist</option>
                  <option value="cashier">Cashier</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    style={checkboxStyle}
                  />
                  <span>Active User</span>
                </label>
              </div>
            </div>

            <div style={formActionsStyle}>
              <button type="button" onClick={resetForm} style={cancelButtonStyle}>
                Cancel
              </button>
              <button type="submit" style={submitButtonStyle}>
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div style={usersContainerStyle}>
        <h3 style={sectionTitleStyle}>System Users ({users.length})</h3>
        
        {loading ? (
          <div style={loadingStyle}>Loading users...</div>
        ) : (
          <div style={usersGridStyle}>
            {users.map(userItem => (
              <div key={userItem.user_id} style={userCardStyle}>
                <div style={userHeaderStyle}>
                  <div style={userAvatarStyle}>
                    {getRoleIcon(userItem.role)}
                  </div>
                  <div style={userInfoStyle}>
                    <div style={userNameStyle}>{userItem.full_name}</div>
                    <div style={usernameStyle}>@{userItem.username}</div>
                    <div
                      style={{
                        ...roleBadgeStyle,
                        backgroundColor: getRoleColor(userItem.role)
                      }}
                    >
                      {userItem.role.toUpperCase()}
                    </div>
                  </div>
                  <div style={statusIndicatorStyle}>
                    <div
                      style={{
                        ...statusDotStyle,
                        backgroundColor: userItem.is_active ? '#48bb78' : '#e53e3e'
                      }}
                    ></div>
                    <span style={statusTextStyle}>
                      {userItem.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div style={userDetailsStyle}>
                  {userItem.email && (
                    <div style={detailItemStyle}>
                      <span style={detailLabelStyle}>Email:</span>
                      <span>{userItem.email}</span>
                    </div>
                  )}
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Created:</span>
                    <span>{new Date(userItem.created_at).toLocaleDateString()}</span>
                  </div>
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Last Login:</span>
                    <span>
                      {userItem.last_login ? 
                        new Date(userItem.last_login).toLocaleDateString() : 
                        'Never'
                      }
                    </span>
                  </div>
                </div>

                <div style={userActionsStyle}>
                  <button
                    onClick={() => startEdit(userItem)}
                    style={editButtonStyle}
                    disabled={userItem.user_id === user.user_id} // Can't edit self
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => toggleUserStatus(userItem.user_id)}
                    style={userItem.is_active ? deactivateButtonStyle : activateButtonStyle}
                    disabled={userItem.user_id === user.user_id} // Can't deactivate self
                  >
                    {userItem.is_active ? '🚫 Deactivate' : '✅ Activate'}
                  </button>
                  <button
                    onClick={() => deleteUser(userItem.user_id)}
                    style={deleteButtonStyle}
                    disabled={userItem.user_id === user.user_id} // Can't delete self
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Statistics */}
      <div style={statsContainerStyle}>
        <h3 style={sectionTitleStyle}>User Statistics</h3>
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>👥</div>
            <div>
              <div style={statValueStyle}>{users.length}</div>
              <div style={statLabelStyle}>Total Users</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>✅</div>
            <div>
              <div style={statValueStyle}>{users.filter(u => u.is_active).length}</div>
              <div style={statLabelStyle}>Active Users</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>👑</div>
            <div>
              <div style={statValueStyle}>{users.filter(u => u.role === 'admin').length}</div>
              <div style={statLabelStyle}>Administrators</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>💊</div>
            <div>
              <div style={statValueStyle}>{users.filter(u => u.role === 'pharmacist').length}</div>
              <div style={statLabelStyle}>Pharmacists</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const addButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

const formContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '24px', marginBottom: '24px' };
const formHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const formTitleStyle = { margin: 0, color: '#2d3748', fontSize: '1.2rem' };
const closeButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const selectStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' };

const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
const checkboxStyle = { margin: 0 };

const formActionsStyle = { display: 'flex', gap: '12px', justifyContent: 'flex-end' };
const cancelButtonStyle = { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };
const submitButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };

const usersContainerStyle = { marginBottom: '24px' };
const sectionTitleStyle = { margin: '0 0 16px 0', color: '#2d3748', fontSize: '1.1rem' };
const usersGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' };

const userCardStyle = { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const userHeaderStyle = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' };
const userAvatarStyle = { fontSize: '32px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc', borderRadius: '50%' };
const userInfoStyle = { flex: 1 };
const userNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '16px', marginBottom: '4px' };
const usernameStyle = { color: '#718096', fontSize: '14px', marginBottom: '8px' };
const roleBadgeStyle = { color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', display: 'inline-block' };

const statusIndicatorStyle = { display: 'flex', alignItems: 'center', gap: '6px' };
const statusDotStyle = { width: '8px', height: '8px', borderRadius: '50%' };
const statusTextStyle = { fontSize: '12px', color: '#4a5568' };

const userDetailsStyle = { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' };
const detailItemStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '14px' };
const detailLabelStyle = { color: '#718096', fontWeight: '500' };

const userActionsStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap' };
const editButtonStyle = { background: '#bee3f8', color: '#2b6cb0', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };
const activateButtonStyle = { background: '#c6f6d5', color: '#276749', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };
const deactivateButtonStyle = { background: '#fed7d7', color: '#c53030', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };
const deleteButtonStyle = { background: '#fed7d7', color: '#c53030', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };

const statsContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '20px' };
const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' };
const statCardStyle = { background: '#fff', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' };
const statIconStyle = { fontSize: '24px' };
const statValueStyle = { fontSize: '20px', fontWeight: '700', color: '#2d3748' };
const statLabelStyle = { fontSize: '12px', color: '#718096' };

const loadingStyle = { textAlign: 'center', padding: '40px', color: '#718096' };

export default UserManagement;
