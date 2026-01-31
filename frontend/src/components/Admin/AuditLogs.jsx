import { useState, useEffect } from 'react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    user: '',
    action: '',
    module: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(20);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // Mock audit log data
      const mockLogs = [
        {
          id: 1,
          timestamp: '2024-01-31 14:30:25',
          user: 'admin',
          user_role: 'admin',
          action: 'LOGIN',
          module: 'Authentication',
          description: 'User logged into the system',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: { session_id: 'sess_123456' }
        },
        {
          id: 2,
          timestamp: '2024-01-31 14:25:15',
          user: 'pharmacist1',
          user_role: 'pharmacist',
          action: 'ADD_MEDICINE',
          module: 'Inventory',
          description: 'Added new medicine: Paracetamol 500mg',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: { medicine_id: 45, quantity: 100, price: 500 }
        },
        {
          id: 3,
          timestamp: '2024-01-31 14:20:10',
          user: 'cashier1',
          user_role: 'cashier',
          action: 'DISPENSE_MEDICINE',
          module: 'Sales',
          description: 'Dispensed medicine: Amoxicillin 250mg',
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: { medicine_id: 23, quantity: 2, total_amount: 2000 }
        },
        {
          id: 4,
          timestamp: '2024-01-31 14:15:05',
          user: 'pharmacist1',
          user_role: 'pharmacist',
          action: 'UPDATE_MEDICINE',
          module: 'Inventory',
          description: 'Updated medicine price: Ibuprofen 400mg',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: { medicine_id: 12, old_price: 800, new_price: 900 }
        },
        {
          id: 5,
          timestamp: '2024-01-31 14:10:30',
          user: 'admin',
          user_role: 'admin',
          action: 'CREATE_USER',
          module: 'User Management',
          description: 'Created new user account: newuser',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: { new_user_id: 5, role: 'cashier' }
        },
        {
          id: 6,
          timestamp: '2024-01-31 14:05:20',
          user: 'unknown',
          user_role: null,
          action: 'LOGIN_FAILED',
          module: 'Authentication',
          description: 'Failed login attempt for username: wronguser',
          ip_address: '192.168.1.200',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'FAILED',
          details: { reason: 'Invalid credentials', attempts: 3 }
        },
        {
          id: 7,
          timestamp: '2024-01-31 13:55:45',
          user: 'pharmacist1',
          user_role: 'pharmacist',
          action: 'VERIFY_PRESCRIPTION',
          module: 'Clinical',
          description: 'Verified prescription for patient: John Doe',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: { prescription_id: 'RX001', patient_id: 'P123' }
        },
        {
          id: 8,
          timestamp: '2024-01-31 13:50:15',
          user: 'admin',
          user_role: 'admin',
          action: 'BACKUP_DATABASE',
          module: 'System',
          description: 'Initiated database backup',
          ip_address: '192.168.1.100',
          user_agent: 'System Process',
          status: 'SUCCESS',
          details: { backup_size: '45.2MB', backup_file: 'backup_20240131_135015.sql' }
        }
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs.filter(log => {
      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      const dateMatch = logDate >= filters.dateFrom && logDate <= filters.dateTo;
      const userMatch = !filters.user || log.user.toLowerCase().includes(filters.user.toLowerCase());
      const actionMatch = !filters.action || log.action.toLowerCase().includes(filters.action.toLowerCase());
      const moduleMatch = !filters.module || log.module.toLowerCase().includes(filters.module.toLowerCase());
      
      return dateMatch && userMatch && actionMatch && moduleMatch;
    });

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const exportLogs = (format) => {
    alert(`Exporting audit logs as ${format.toUpperCase()}...`);
    // In real implementation, this would generate and download the logs
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      setLogs([]);
      alert('Audit logs cleared successfully');
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN': return '🔐';
      case 'LOGOUT': return '🚪';
      case 'LOGIN_FAILED': return '❌';
      case 'ADD_MEDICINE': return '➕';
      case 'UPDATE_MEDICINE': return '✏️';
      case 'DELETE_MEDICINE': return '🗑️';
      case 'DISPENSE_MEDICINE': return '💊';
      case 'CREATE_USER': return '👤';
      case 'UPDATE_USER': return '👥';
      case 'DELETE_USER': return '🚫';
      case 'VERIFY_PRESCRIPTION': return '📋';
      case 'BACKUP_DATABASE': return '💾';
      default: return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return '#48bb78';
      case 'FAILED': return '#e53e3e';
      case 'WARNING': return '#d69e2e';
      default: return '#718096';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e53e3e';
      case 'pharmacist': return '#3182ce';
      case 'cashier': return '#38a169';
      default: return '#718096';
    }
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>📋 Audit Logs</h2>
        <div style={headerActionsStyle}>
          <button onClick={() => exportLogs('csv')} style={exportButtonStyle}>
            📊 Export CSV
          </button>
          <button onClick={() => exportLogs('pdf')} style={exportButtonStyle}>
            📄 Export PDF
          </button>
          <button onClick={clearLogs} style={clearButtonStyle}>
            🗑️ Clear Logs
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={filtersContainerStyle}>
        <h3 style={filtersTitleStyle}>🔍 Filter Logs</h3>
        <div style={filtersGridStyle}>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>User</label>
            <input
              type="text"
              placeholder="Search by username..."
              value={filters.user}
              onChange={(e) => setFilters({...filters, user: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Action</label>
            <input
              type="text"
              placeholder="Search by action..."
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Module</label>
            <select
              value={filters.module}
              onChange={(e) => setFilters({...filters, module: e.target.value})}
              style={selectStyle}
            >
              <option value="">All Modules</option>
              <option value="Authentication">Authentication</option>
              <option value="Inventory">Inventory</option>
              <option value="Sales">Sales</option>
              <option value="Clinical">Clinical</option>
              <option value="User Management">User Management</option>
              <option value="System">System</option>
            </select>
          </div>
          <div style={filterGroupStyle}>
            <button 
              onClick={() => setFilters({
                dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                dateTo: new Date().toISOString().split('T')[0],
                user: '',
                action: '',
                module: ''
              })}
              style={resetFiltersButtonStyle}
            >
              🔄 Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div style={summaryStyle}>
        <span>Showing {currentLogs.length} of {filteredLogs.length} logs</span>
        {filteredLogs.length !== logs.length && (
          <span style={filteredIndicatorStyle}>(filtered from {logs.length} total)</span>
        )}
      </div>

      {/* Logs Table */}
      <div style={tableContainerStyle}>
        {loading ? (
          <div style={loadingStyle}>Loading audit logs...</div>
        ) : currentLogs.length === 0 ? (
          <div style={noDataStyle}>No audit logs found matching your criteria</div>
        ) : (
          <div style={logsListStyle}>
            {currentLogs.map(log => (
              <div key={log.id} style={logCardStyle}>
                <div style={logHeaderStyle}>
                  <div style={logIconStyle}>{getActionIcon(log.action)}</div>
                  <div style={logMainInfoStyle}>
                    <div style={logActionStyle}>{log.action.replace(/_/g, ' ')}</div>
                    <div style={logDescriptionStyle}>{log.description}</div>
                  </div>
                  <div style={logMetaStyle}>
                    <div
                      style={{
                        ...statusBadgeStyle,
                        backgroundColor: getStatusColor(log.status)
                      }}
                    >
                      {log.status}
                    </div>
                    <div style={timestampStyle}>{log.timestamp}</div>
                  </div>
                </div>

                <div style={logDetailsStyle}>
                  <div style={logDetailItemStyle}>
                    <span style={detailLabelStyle}>User:</span>
                    <span style={detailValueStyle}>
                      {log.user}
                      {log.user_role && (
                        <span
                          style={{
                            ...roleBadgeStyle,
                            backgroundColor: getRoleColor(log.user_role)
                          }}
                        >
                          {log.user_role}
                        </span>
                      )}
                    </span>
                  </div>
                  <div style={logDetailItemStyle}>
                    <span style={detailLabelStyle}>Module:</span>
                    <span style={detailValueStyle}>{log.module}</span>
                  </div>
                  <div style={logDetailItemStyle}>
                    <span style={detailLabelStyle}>IP Address:</span>
                    <span style={detailValueStyle}>{log.ip_address}</span>
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div style={logDetailItemStyle}>
                      <span style={detailLabelStyle}>Details:</span>
                      <span style={detailValueStyle}>
                        {JSON.stringify(log.details, null, 2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={paginationButtonStyle}
          >
            ← Previous
          </button>
          <span style={paginationInfoStyle}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={paginationButtonStyle}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const headerActionsStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap' };
const exportButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };
const clearButtonStyle = { background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };

const filtersContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px' };
const filtersTitleStyle = { margin: '0 0 16px 0', color: '#2d3748', fontSize: '1.1rem' };
const filtersGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' };
const filterGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const selectStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' };
const resetFiltersButtonStyle = { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', height: 'fit-content' };

const summaryStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '14px', color: '#4a5568' };
const filteredIndicatorStyle = { color: '#718096', fontStyle: 'italic' };

const tableContainerStyle = { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' };
const loadingStyle = { textAlign: 'center', padding: '40px', color: '#718096' };
const noDataStyle = { textAlign: 'center', padding: '40px', color: '#718096' };

const logsListStyle = { display: 'flex', flexDirection: 'column' };
const logCardStyle = { padding: '20px', borderBottom: '1px solid #e2e8f0' };
const logHeaderStyle = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' };
const logIconStyle = { fontSize: '24px', width: '40px', textAlign: 'center' };
const logMainInfoStyle = { flex: 1 };
const logActionStyle = { fontWeight: '600', color: '#2d3748', fontSize: '16px', marginBottom: '4px', textTransform: 'capitalize' };
const logDescriptionStyle = { color: '#4a5568', fontSize: '14px' };
const logMetaStyle = { display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '8px' };
const statusBadgeStyle = { color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' };
const timestampStyle = { fontSize: '12px', color: '#718096' };

const logDetailsStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginLeft: '56px' };
const logDetailItemStyle = { display: 'flex', gap: '8px', fontSize: '14px' };
const detailLabelStyle = { fontWeight: '600', color: '#4a5568', minWidth: '80px' };
const detailValueStyle = { color: '#2d3748', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' };
const roleBadgeStyle = { color: '#fff', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: '600' };

const paginationStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '20px' };
const paginationButtonStyle = { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };
const paginationInfoStyle = { fontSize: '14px', color: '#4a5568' };

export default AuditLogs;