'use client';

import { useState, useEffect } from 'react';

const BackupRestore = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily',
    retentionDays: 30,
    includeUserData: true,
    includeSystemLogs: true,
    compressionEnabled: true
  });

  useEffect(() => {
    fetchBackups();
    loadBackupSettings();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      // Mock backup data
      const mockBackups = [
        {
          id: 1,
          filename: 'pharmacy_backup_20240131_143025.sql',
          created_at: '2024-01-31 14:30:25',
          size: '45.2 MB',
          type: 'Full Backup',
          status: 'Completed',
          created_by: 'admin',
          description: 'Scheduled daily backup'
        },
        {
          id: 2,
          filename: 'pharmacy_backup_20240130_143015.sql',
          created_at: '2024-01-30 14:30:15',
          size: '44.8 MB',
          type: 'Full Backup',
          status: 'Completed',
          created_by: 'System',
          description: 'Scheduled daily backup'
        },
        {
          id: 3,
          filename: 'pharmacy_backup_20240129_143010.sql',
          created_at: '2024-01-29 14:30:10',
          size: '44.1 MB',
          type: 'Full Backup',
          status: 'Completed',
          created_by: 'System',
          description: 'Scheduled daily backup'
        },
        {
          id: 4,
          filename: 'pharmacy_backup_manual_20240128_100000.sql',
          created_at: '2024-01-28 10:00:00',
          size: '43.9 MB',
          type: 'Manual Backup',
          status: 'Completed',
          created_by: 'admin',
          description: 'Manual backup before system update'
        },
        {
          id: 5,
          filename: 'pharmacy_backup_20240127_143005.sql',
          created_at: '2024-01-27 14:30:05',
          size: '43.5 MB',
          type: 'Full Backup',
          status: 'Completed',
          created_by: 'System',
          description: 'Scheduled daily backup'
        }
      ];

      setBackups(mockBackups);
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBackupSettings = async () => {
    try {
      // In real implementation, load from API
      console.log('Loading backup settings...');
    } catch (error) {
      console.error('Error loading backup settings:', error);
    }
  };

  const createBackup = async (description = '') => {
    setBackupInProgress(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newBackup = {
        id: Date.now(),
        filename: `pharmacy_backup_manual_${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}.sql`,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        size: '45.5 MB',
        type: 'Manual Backup',
        status: 'Completed',
        created_by: 'admin',
        description: description || 'Manual backup'
      };

      setBackups(prev => [newBackup, ...prev]);
      alert('Backup created successfully!');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Error creating backup');
    } finally {
      setBackupInProgress(false);
    }
  };

  const restoreBackup = async (backup) => {
    if (!window.confirm(`Are you sure you want to restore from "${backup.filename}"? This will overwrite all current data and cannot be undone.`)) {
      return;
    }

    setRestoreInProgress(true);
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      alert('Database restored successfully! Please refresh the application.');
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Error restoring backup');
    } finally {
      setRestoreInProgress(false);
    }
  };

  const downloadBackup = (backup) => {
    // Simulate download
    alert(`Downloading ${backup.filename}...`);
    // In real implementation, this would trigger file download
  };

  const deleteBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }

    try {
      setBackups(prev => prev.filter(b => b.id !== backupId));
      alert('Backup deleted successfully!');
    } catch (error) {
      console.error('Error deleting backup:', error);
      alert('Error deleting backup');
    }
  };

  const saveBackupSettings = async () => {
    try {
      // In real implementation, save to API
      alert('Backup settings saved successfully!');
    } catch (error) {
      console.error('Error saving backup settings:', error);
      alert('Error saving backup settings');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#48bb78';
      case 'In Progress': return '#3182ce';
      case 'Failed': return '#e53e3e';
      default: return '#718096';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Full Backup': return '💾';
      case 'Manual Backup': return '🔧';
      case 'Incremental Backup': return '📈';
      default: return '💿';
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>💾 Backup & Restore</h2>
        <div style={headerActionsStyle}>
          <button
            onClick={() => {
              const description = prompt('Enter backup description (optional):');
              if (description !== null) createBackup(description);
            }}
            style={createBackupButtonStyle}
            disabled={backupInProgress}
          >
            {backupInProgress ? '⏳ Creating...' : '💾 Create Backup'}
          </button>
        </div>
      </div>

      {/* Backup Settings */}
      <div style={settingsContainerStyle}>
        <h3 style={sectionTitleStyle}>⚙️ Backup Settings</h3>
        <div style={settingsGridStyle}>
          <div style={settingGroupStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={backupSettings.autoBackup}
                onChange={(e) => setBackupSettings({...backupSettings, autoBackup: e.target.checked})}
                style={checkboxStyle}
              />
              <span>Enable Automatic Backups</span>
            </label>
          </div>
          <div style={settingGroupStyle}>
            <label style={labelStyle}>Backup Frequency</label>
            <select
              value={backupSettings.frequency}
              onChange={(e) => setBackupSettings({...backupSettings, frequency: e.target.value})}
              style={selectStyle}
              disabled={!backupSettings.autoBackup}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div style={settingGroupStyle}>
            <label style={labelStyle}>Retention Period (days)</label>
            <input
              type="number"
              value={backupSettings.retentionDays}
              onChange={(e) => setBackupSettings({...backupSettings, retentionDays: parseInt(e.target.value)})}
              style={inputStyle}
              min="1"
              max="365"
            />
          </div>
          <div style={settingGroupStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={backupSettings.includeUserData}
                onChange={(e) => setBackupSettings({...backupSettings, includeUserData: e.target.checked})}
                style={checkboxStyle}
              />
              <span>Include User Data</span>
            </label>
          </div>
          <div style={settingGroupStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={backupSettings.includeSystemLogs}
                onChange={(e) => setBackupSettings({...backupSettings, includeSystemLogs: e.target.checked})}
                style={checkboxStyle}
              />
              <span>Include System Logs</span>
            </label>
          </div>
          <div style={settingGroupStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={backupSettings.compressionEnabled}
                onChange={(e) => setBackupSettings({...backupSettings, compressionEnabled: e.target.checked})}
                style={checkboxStyle}
              />
              <span>Enable Compression</span>
            </label>
          </div>
        </div>
        <div style={settingsActionsStyle}>
          <button onClick={saveBackupSettings} style={saveSettingsButtonStyle}>
            💾 Save Settings
          </button>
        </div>
      </div>

      {/* System Status */}
      <div style={statusContainerStyle}>
        <h3 style={sectionTitleStyle}>📊 System Status</h3>
        <div style={statusGridStyle}>
          <div style={statusCardStyle}>
            <div style={statusIconStyle}>💾</div>
            <div>
              <div style={statusValueStyle}>{backups.length}</div>
              <div style={statusLabelStyle}>Total Backups</div>
            </div>
          </div>
          <div style={statusCardStyle}>
            <div style={statusIconStyle}>📅</div>
            <div>
              <div style={statusValueStyle}>
                {backups.length > 0 ? new Date(backups[0].created_at).toLocaleDateString() : 'Never'}
              </div>
              <div style={statusLabelStyle}>Last Backup</div>
            </div>
          </div>
          <div style={statusCardStyle}>
            <div style={statusIconStyle}>💿</div>
            <div>
              <div style={statusValueStyle}>
                {backups.reduce((total, backup) => total + parseFloat(backup.size), 0).toFixed(1)} MB
              </div>
              <div style={statusLabelStyle}>Total Size</div>
            </div>
          </div>
          <div style={statusCardStyle}>
            <div style={statusIconStyle}>🔄</div>
            <div>
              <div style={statusValueStyle}>
                {backupSettings.autoBackup ? 'Enabled' : 'Disabled'}
              </div>
              <div style={statusLabelStyle}>Auto Backup</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div style={backupsContainerStyle}>
        <h3 style={sectionTitleStyle}>📋 Available Backups</h3>
        
        {loading ? (
          <div style={loadingStyle}>Loading backups...</div>
        ) : backups.length === 0 ? (
          <div style={noDataStyle}>
            <div style={noDataIconStyle}>💾</div>
            <div style={noDataTextStyle}>No backups available</div>
            <div style={noDataSubtextStyle}>Create your first backup to get started</div>
          </div>
        ) : (
          <div style={backupsListStyle}>
            {backups.map(backup => (
              <div key={backup.id} style={backupCardStyle}>
                <div style={backupHeaderStyle}>
                  <div style={backupIconStyle}>{getTypeIcon(backup.type)}</div>
                  <div style={backupInfoStyle}>
                    <div style={backupFilenameStyle}>{backup.filename}</div>
                    <div style={backupDescriptionStyle}>{backup.description}</div>
                    <div style={backupMetaStyle}>
                      <span>Created: {new Date(backup.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span>Size: {backup.size}</span>
                      <span>•</span>
                      <span>By: {backup.created_by}</span>
                    </div>
                  </div>
                  <div style={backupStatusStyle}>
                    <div
                      style={{
                        ...statusBadgeStyle,
                        backgroundColor: getStatusColor(backup.status)
                      }}
                    >
                      {backup.status}
                    </div>
                    <div style={backupTypeStyle}>{backup.type}</div>
                  </div>
                </div>

                <div style={backupActionsStyle}>
                  <button
                    onClick={() => downloadBackup(backup)}
                    style={actionButtonStyle}
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => restoreBackup(backup)}
                    style={restoreButtonStyle}
                    disabled={restoreInProgress}
                  >
                    {restoreInProgress ? '⏳ Restoring...' : '🔄 Restore'}
                  </button>
                  <button
                    onClick={() => deleteBackup(backup.id)}
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

      {/* Restore Progress */}
      {restoreInProgress && (
        <div style={progressOverlayStyle}>
          <div style={progressModalStyle}>
            <div style={progressIconStyle}>🔄</div>
            <div style={progressTextStyle}>Restoring Database...</div>
            <div style={progressSubtextStyle}>Please do not close this window</div>
            <div style={progressBarContainerStyle}>
              <div style={progressBarStyle}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const headerActionsStyle = { display: 'flex', gap: '8px' };
const createBackupButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

const settingsContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px' };
const sectionTitleStyle = { margin: '0 0 16px 0', color: '#2d3748', fontSize: '1.1rem' };
const settingsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' };
const settingGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const selectStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', color: '#2d3748' };
const checkboxStyle = { margin: 0 };
const settingsActionsStyle = { display: 'flex', justifyContent: 'flex-end' };
const saveSettingsButtonStyle = { background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };

const statusContainerStyle = { background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const statusGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' };
const statusCardStyle = { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#f7fafc', borderRadius: '8px' };
const statusIconStyle = { fontSize: '24px' };
const statusValueStyle = { fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' };
const statusLabelStyle = { fontSize: '12px', color: '#718096' };

const backupsContainerStyle = { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const loadingStyle = { textAlign: 'center', padding: '40px', color: '#718096' };
const noDataStyle = { textAlign: 'center', padding: '60px 20px' };
const noDataIconStyle = { fontSize: '48px', marginBottom: '16px' };
const noDataTextStyle = { fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' };
const noDataSubtextStyle = { fontSize: '14px', color: '#718096' };

const backupsListStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const backupCardStyle = { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' };
const backupHeaderStyle = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' };
const backupIconStyle = { fontSize: '24px', width: '40px', textAlign: 'center' };
const backupInfoStyle = { flex: 1 };
const backupFilenameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '16px', marginBottom: '4px' };
const backupDescriptionStyle = { color: '#4a5568', fontSize: '14px', marginBottom: '8px' };
const backupMetaStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#718096' };
const backupStatusStyle = { display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '8px' };
const statusBadgeStyle = { color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' };
const backupTypeStyle = { fontSize: '12px', color: '#718096' };

const backupActionsStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap' };
const actionButtonStyle = { background: '#bee3f8', color: '#2b6cb0', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };
const restoreButtonStyle = { background: '#fbb6ce', color: '#b83280', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };
const deleteButtonStyle = { background: '#fed7d7', color: '#c53030', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };

const progressOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const progressModalStyle = { background: '#fff', borderRadius: '12px', padding: '40px', textAlign: 'center', minWidth: '300px' };
const progressIconStyle = { fontSize: '48px', marginBottom: '16px' };
const progressTextStyle = { fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' };
const progressSubtextStyle = { fontSize: '14px', color: '#718096', marginBottom: '24px' };
const progressBarContainerStyle = { width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' };
const progressBarStyle = { width: '100%', height: '100%', background: 'linear-gradient(90deg, #48bb78, #38a169)', animation: 'progress 2s ease-in-out infinite' };

export default BackupRestore;
