# Administrator Role Complete Guide

## Overview
The Administrator role in the Pharmacy Management System provides comprehensive system management capabilities, including user management, system configuration, reporting, audit logging, and data backup/restore operations.

## Features Implemented

### 1. User Management 👥
**Location**: Administration → User Management

**Capabilities**:
- **Create New Users**: Add pharmacists, cashiers, and administrators
- **Edit User Details**: Update names, emails, roles, and passwords
- **User Status Control**: Activate/deactivate user accounts
- **Delete Users**: Remove users from the system (with confirmation)
- **Role Management**: Assign and change user roles (admin, pharmacist, cashier)
- **User Statistics**: View user counts by role and status

**Key Features**:
- Real-time user statistics dashboard
- Role-based access control
- Password security validation
- User activity tracking
- Bulk user operations

### 2. Reports & Analytics 📊
**Location**: Administration → Reports & Analytics

**Available Reports**:

#### Sales Reports
- Daily sales trends with visual charts
- Top-selling products analysis
- Revenue metrics and KPIs
- Transaction volume tracking
- Sales performance indicators

#### Inventory Reports
- Stock levels by category
- Inventory value calculations
- Expiry alerts and monitoring
- Low stock notifications
- Stock movement analysis

#### User Activity Reports
- Login statistics per user
- User performance metrics
- Activity patterns analysis
- System usage tracking

**Export Options**:
- PDF reports for formal documentation
- Excel exports for data analysis
- Date range filtering
- Custom report generation

### 3. System Settings ⚙️
**Location**: Administration → System Settings

**Configuration Categories**:

#### General Settings
- Pharmacy information (name, address, contact)
- Currency and timezone settings
- Language preferences
- Business details management

#### Inventory Settings
- Low stock threshold configuration
- Auto-reorder system settings
- Expiry alert timing
- Batch tracking preferences
- Stock valuation methods (FIFO, LIFO, Average)

#### Sales Settings
- Tax rate configuration
- Discount system settings
- Receipt customization
- Backup automation settings
- Payment processing options

#### Security Settings
- Session timeout configuration
- Password policy enforcement
- Login attempt limits
- Two-factor authentication
- Audit logging controls

#### Notification Settings
- Email notification preferences
- SMS alert configuration
- System alert settings
- Report delivery schedules

### 4. Audit Logs 📋
**Location**: Administration → Audit Logs

**Tracking Capabilities**:
- **User Actions**: Login/logout, user creation, role changes
- **Inventory Operations**: Stock additions, updates, dispensing
- **Sales Activities**: Transaction processing, payment handling
- **System Changes**: Settings modifications, backup operations
- **Security Events**: Failed logins, unauthorized access attempts

**Log Features**:
- Real-time activity monitoring
- Advanced filtering options
- Export capabilities (CSV, PDF)
- Retention policy management
- Search and analysis tools

**Audit Information Captured**:
- User identification and role
- Action performed and module affected
- Timestamp and IP address
- Detailed description and context
- Success/failure status
- Additional metadata

### 5. Backup & Restore 💾
**Location**: Administration → Backup & Restore

**Backup Features**:
- **Manual Backups**: On-demand backup creation
- **Scheduled Backups**: Automated backup system
- **Backup Settings**: Frequency, retention, compression
- **Backup Types**: Full system, incremental, selective

**Restore Capabilities**:
- Point-in-time restoration
- Selective data recovery
- Backup verification
- Rollback procedures

**Backup Management**:
- Backup history and status
- Storage space monitoring
- Backup integrity checks
- Download and archive options

## Access Control

### Role-Based Permissions
- **Admin Only**: Full system access, user management, system settings
- **Pharmacist**: Clinical duties, inventory management, limited reporting
- **Cashier**: Sales operations, basic inventory viewing

### Security Features
- Session management and timeout
- Password policy enforcement
- Audit trail for all actions
- IP address tracking
- User agent logging

## API Endpoints

### User Management APIs
- `GET /api/modules/admin_users.php?action=list` - List all users
- `POST /api/modules/admin_users.php?action=create` - Create new user
- `POST /api/modules/admin_users.php?action=update` - Update user details
- `POST /api/modules/admin_users.php?action=delete` - Delete user
- `POST /api/modules/admin_users.php?action=toggle_status` - Toggle user status
- `GET /api/modules/admin_users.php?action=stats` - Get user statistics

### System Settings APIs
- `GET /api/modules/system_settings.php` - Get all settings
- `POST /api/modules/system_settings.php` - Save settings

### Audit Logs APIs
- `GET /api/modules/audit_logs.php?action=list` - Get audit logs
- `POST /api/modules/audit_logs.php?action=clear` - Clear audit logs
- `GET /api/modules/audit_logs.php?action=export` - Export audit logs

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'pharmacist', 'cashier') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

### System Settings Table
```sql
CREATE TABLE system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'float', 'boolean', 'json') DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50),
    user_role VARCHAR(20),
    action VARCHAR(50),
    module VARCHAR(50),
    description TEXT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('SUCCESS', 'FAILED', 'WARNING') DEFAULT 'SUCCESS',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Instructions

### Accessing Admin Features
1. Login with an administrator account
2. Navigate to the "Administration" tab (👑 icon)
3. Select the desired management function from the dashboard

### Creating Users
1. Go to Administration → User Management
2. Click "Add New User" button
3. Fill in required information:
   - Username (unique)
   - Password (minimum 6 characters)
   - Full name
   - Email (optional)
   - Role (admin, pharmacist, cashier)
   - Active status
4. Click "Create User" to save

### Configuring System Settings
1. Go to Administration → System Settings
2. Select the settings category from the sidebar
3. Modify the desired settings
4. Click "Save Settings" to apply changes

### Viewing Reports
1. Go to Administration → Reports & Analytics
2. Select the report type (Sales, Inventory, User Activity)
3. Set date range if needed
4. Use export buttons to download reports

### Managing Audit Logs
1. Go to Administration → Audit Logs
2. Use filters to narrow down log entries
3. Export logs for external analysis
4. Clear old logs when needed (with caution)

### Backup Operations
1. Go to Administration → Backup & Restore
2. Configure automatic backup settings
3. Create manual backups as needed
4. Download backups for external storage
5. Use restore function for data recovery

## Best Practices

### Security
- Regularly review user accounts and permissions
- Monitor audit logs for suspicious activities
- Implement strong password policies
- Enable two-factor authentication when available
- Regular security audits and reviews

### Data Management
- Schedule regular automated backups
- Test restore procedures periodically
- Monitor system performance and storage
- Archive old audit logs appropriately
- Maintain data retention policies

### User Management
- Follow principle of least privilege
- Regular user access reviews
- Prompt deactivation of unused accounts
- Clear role definitions and responsibilities
- Regular training and updates

### System Maintenance
- Regular system settings reviews
- Performance monitoring and optimization
- Software updates and patches
- Database maintenance and optimization
- Documentation updates and reviews

## Troubleshooting

### Common Issues
1. **User Creation Fails**: Check username uniqueness, password requirements
2. **Settings Not Saving**: Verify database permissions, check error logs
3. **Backup Failures**: Check storage space, database connectivity
4. **Audit Log Issues**: Verify table structure, check permissions
5. **Report Generation Problems**: Check date ranges, data availability

### Error Resolution
- Check browser console for JavaScript errors
- Review server logs for PHP errors
- Verify database connectivity and permissions
- Ensure proper file permissions for backups
- Check network connectivity for API calls

## Future Enhancements

### Planned Features
- Advanced reporting with charts and graphs
- Email notification system
- SMS alert integration
- Advanced user role customization
- API rate limiting and security
- Mobile app administration
- Integration with external systems
- Advanced backup encryption
- Real-time system monitoring
- Performance analytics dashboard

This comprehensive administrator role provides full system control and monitoring capabilities, ensuring efficient pharmacy management and operations oversight.