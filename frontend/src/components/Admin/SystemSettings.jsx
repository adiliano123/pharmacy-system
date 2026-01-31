import { useState, useEffect } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      pharmacyName: 'MediCare Pharmacy',
      address: '123 Health Street, Dar es Salaam',
      phone: '+255 123 456 789',
      email: 'info@medicare.co.tz',
      currency: 'TSh',
      timezone: 'Africa/Dar_es_Salaam',
      language: 'English'
    },
    inventory: {
      lowStockThreshold: 10,
      autoReorderEnabled: false,
      expiryAlertDays: 30,
      batchTrackingEnabled: true,
      stockValuationMethod: 'FIFO'
    },
    sales: {
      taxRate: 18,
      discountEnabled: true,
      maxDiscountPercent: 20,
      receiptFooter: 'Thank you for choosing MediCare Pharmacy!',
      autoBackupEnabled: true,
      backupFrequency: 'daily'
    },
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireSpecialChars: true,
      maxLoginAttempts: 3,
      twoFactorEnabled: false,
      auditLoggingEnabled: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      lowStockAlerts: true,
      expiryAlerts: true,
      salesReports: true,
      systemAlerts: true
    }
  });

  const [activeSection, setActiveSection] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In real implementation, this would fetch from API
      // const response = await fetch('/api/modules/system_settings.php');
      // const data = await response.json();
      // setSettings(data);
      console.log('Settings loaded');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In real implementation, this would save to API
      // await fetch('/api/modules/system_settings.php', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      setTimeout(() => {
        alert('Settings saved successfully!');
        setHasChanges(false);
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      // Reset to default values
      loadSettings();
      setHasChanges(false);
      alert('Settings reset to defaults');
    }
  };

  const sections = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'inventory', label: 'Inventory Settings', icon: '📦' },
    { id: 'sales', label: 'Sales Settings', icon: '💰' },
    { id: 'security', label: 'Security Settings', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  const renderGeneralSettings = () => (
    <div style={sectionContentStyle}>
      <h3 style={sectionTitleStyle}>🏢 Pharmacy Information</h3>
      <div style={settingsGridStyle}>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Pharmacy Name</label>
          <input
            type="text"
            value={settings.general.pharmacyName}
            onChange={(e) => updateSetting('general', 'pharmacyName', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Address</label>
          <textarea
            value={settings.general.address}
            onChange={(e) => updateSetting('general', 'address', e.target.value)}
            style={textareaStyle}
            rows="3"
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            value={settings.general.phone}
            onChange={(e) => updateSetting('general', 'phone', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={settings.general.email}
            onChange={(e) => updateSetting('general', 'email', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => updateSetting('general', 'currency', e.target.value)}
            style={selectStyle}
          >
            <option value="TSh">Tanzanian Shilling (TSh)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
            style={selectStyle}
          >
            <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam</option>
            <option value="Africa/Nairobi">Africa/Nairobi</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderInventorySettings = () => (
    <div style={sectionContentStyle}>
      <h3 style={sectionTitleStyle}>📦 Inventory Management</h3>
      <div style={settingsGridStyle}>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Low Stock Threshold</label>
          <input
            type="number"
            value={settings.inventory.lowStockThreshold}
            onChange={(e) => updateSetting('inventory', 'lowStockThreshold', parseInt(e.target.value))}
            style={inputStyle}
            min="1"
          />
          <div style={helpTextStyle}>Alert when stock falls below this number</div>
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Expiry Alert Days</label>
          <input
            type="number"
            value={settings.inventory.expiryAlertDays}
            onChange={(e) => updateSetting('inventory', 'expiryAlertDays', parseInt(e.target.value))}
            style={inputStyle}
            min="1"
          />
          <div style={helpTextStyle}>Alert X days before expiry</div>
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Stock Valuation Method</label>
          <select
            value={settings.inventory.stockValuationMethod}
            onChange={(e) => updateSetting('inventory', 'stockValuationMethod', e.target.value)}
            style={selectStyle}
          >
            <option value="FIFO">FIFO (First In, First Out)</option>
            <option value="LIFO">LIFO (Last In, First Out)</option>
            <option value="Average">Weighted Average</option>
          </select>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.inventory.autoReorderEnabled}
              onChange={(e) => updateSetting('inventory', 'autoReorderEnabled', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Enable Auto-Reorder</span>
          </label>
          <div style={helpTextStyle}>Automatically create purchase orders for low stock items</div>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.inventory.batchTrackingEnabled}
              onChange={(e) => updateSetting('inventory', 'batchTrackingEnabled', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Enable Batch Tracking</span>
          </label>
          <div style={helpTextStyle}>Track medicines by batch numbers and expiry dates</div>
        </div>
      </div>
    </div>
  );

  const renderSalesSettings = () => (
    <div style={sectionContentStyle}>
      <h3 style={sectionTitleStyle}>💰 Sales Configuration</h3>
      <div style={settingsGridStyle}>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Tax Rate (%)</label>
          <input
            type="number"
            value={settings.sales.taxRate}
            onChange={(e) => updateSetting('sales', 'taxRate', parseFloat(e.target.value))}
            style={inputStyle}
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Maximum Discount (%)</label>
          <input
            type="number"
            value={settings.sales.maxDiscountPercent}
            onChange={(e) => updateSetting('sales', 'maxDiscountPercent', parseFloat(e.target.value))}
            style={inputStyle}
            min="0"
            max="100"
            disabled={!settings.sales.discountEnabled}
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Receipt Footer Message</label>
          <textarea
            value={settings.sales.receiptFooter}
            onChange={(e) => updateSetting('sales', 'receiptFooter', e.target.value)}
            style={textareaStyle}
            rows="2"
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Backup Frequency</label>
          <select
            value={settings.sales.backupFrequency}
            onChange={(e) => updateSetting('sales', 'backupFrequency', e.target.value)}
            style={selectStyle}
            disabled={!settings.sales.autoBackupEnabled}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.sales.discountEnabled}
              onChange={(e) => updateSetting('sales', 'discountEnabled', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Enable Discounts</span>
          </label>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.sales.autoBackupEnabled}
              onChange={(e) => updateSetting('sales', 'autoBackupEnabled', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Enable Auto Backup</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div style={sectionContentStyle}>
      <h3 style={sectionTitleStyle}>🔒 Security Configuration</h3>
      <div style={settingsGridStyle}>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            style={inputStyle}
            min="5"
            max="480"
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Minimum Password Length</label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
            style={inputStyle}
            min="6"
            max="20"
          />
        </div>
        <div style={settingGroupStyle}>
          <label style={labelStyle}>Max Login Attempts</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
            style={inputStyle}
            min="1"
            max="10"
          />
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.security.requireSpecialChars}
              onChange={(e) => updateSetting('security', 'requireSpecialChars', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Require Special Characters in Passwords</span>
          </label>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.security.twoFactorEnabled}
              onChange={(e) => updateSetting('security', 'twoFactorEnabled', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Enable Two-Factor Authentication</span>
          </label>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.security.auditLoggingEnabled}
              onChange={(e) => updateSetting('security', 'auditLoggingEnabled', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Enable Audit Logging</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div style={sectionContentStyle}>
      <h3 style={sectionTitleStyle}>🔔 Notification Preferences</h3>
      <div style={settingsGridStyle}>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Email Notifications</span>
          </label>
          <div style={helpTextStyle}>Receive notifications via email</div>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
              style={checkboxStyle}
            />
            <span>SMS Notifications</span>
          </label>
          <div style={helpTextStyle}>Receive notifications via SMS</div>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.notifications.lowStockAlerts}
              onChange={(e) => updateSetting('notifications', 'lowStockAlerts', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Low Stock Alerts</span>
          </label>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.notifications.expiryAlerts}
              onChange={(e) => updateSetting('notifications', 'expiryAlerts', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Expiry Alerts</span>
          </label>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.notifications.salesReports}
              onChange={(e) => updateSetting('notifications', 'salesReports', e.target.checked)}
              style={checkboxStyle}
            />
            <span>Daily Sales Reports</span>
          </label>
        </div>
        <div style={checkboxGroupStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
              style={checkboxStyle}
            />
            <span>System Alerts</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>⚙️ System Settings</h2>
        <div style={headerActionsStyle}>
          {hasChanges && (
            <div style={changesIndicatorStyle}>
              ⚠️ Unsaved changes
            </div>
          )}
          <button onClick={resetToDefaults} style={resetButtonStyle}>
            🔄 Reset to Defaults
          </button>
          <button 
            onClick={saveSettings} 
            style={saveButtonStyle}
            disabled={!hasChanges || saving}
          >
            {saving ? '💾 Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      <div style={contentStyle}>
        <div style={sidebarStyle}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                ...sidebarButtonStyle,
                ...(activeSection === section.id ? activeSidebarButtonStyle : {})
              }}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>

        <div style={mainContentStyle}>
          {activeSection === 'general' && renderGeneralSettings()}
          {activeSection === 'inventory' && renderInventorySettings()}
          {activeSection === 'sales' && renderSalesSettings()}
          {activeSection === 'security' && renderSecuritySettings()}
          {activeSection === 'notifications' && renderNotificationSettings()}
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const headerActionsStyle = { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' };
const changesIndicatorStyle = { color: '#d69e2e', fontSize: '14px', fontWeight: '500' };
const resetButtonStyle = { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };
const saveButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };

const contentStyle = { display: 'flex', gap: '24px', height: 'calc(100% - 80px)' };
const sidebarStyle = { width: '250px', display: 'flex', flexDirection: 'column', gap: '8px' };
const sidebarButtonStyle = { background: '#f7fafc', color: '#4a5568', border: 'none', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: 'all 0.3s' };
const activeSidebarButtonStyle = { background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)', color: '#fff' };

const mainContentStyle = { flex: 1, background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'auto' };
const sectionContentStyle = { display: 'flex', flexDirection: 'column', gap: '24px' };
const sectionTitleStyle = { margin: '0 0 16px 0', color: '#2d3748', fontSize: '1.2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' };

const settingsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' };
const settingGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const checkboxGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };

const labelStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const selectStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' };
const textareaStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', resize: 'vertical' };

const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', color: '#2d3748' };
const checkboxStyle = { margin: 0 };
const helpTextStyle = { fontSize: '12px', color: '#718096', fontStyle: 'italic' };

export default SystemSettings;