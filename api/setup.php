<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pharmacy System Setup</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 2rem;
        }
        .subtitle {
            color: #718096;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f7fafc;
            border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        .section h2 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            margin-right: 10px;
            margin-bottom: 10px;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .result {
            margin-top: 15px;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 13px;
            white-space: pre-wrap;
            max-height: 400px;
            overflow-y: auto;
        }
        .success {
            background: #c6f6d5;
            border: 1px solid #9ae6b4;
            color: #22543d;
        }
        .error {
            background: #fed7d7;
            border: 1px solid #fc8181;
            color: #742a2a;
        }
        .info {
            background: #bee3f8;
            border: 1px solid #90cdf4;
            color: #2c5282;
        }
        .credentials {
            background: #fefcbf;
            border: 1px solid #f6e05e;
            color: #744210;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
        }
        .credentials strong {
            display: block;
            margin-bottom: 5px;
        }
        .step {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .step-number {
            background: #667eea;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
        }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💊 Pharmacy System Setup</h1>
        <p class="subtitle">Complete setup wizard for authentication system</p>

        <!-- Step 1: Test Connection -->
        <div class="section">
            <h2>Step 1: Test Database Connection</h2>
            <p>Verify that the database is accessible and tables exist.</p>
            <button onclick="testConnection()">Test Connection</button>
            <div id="connection-result"></div>
        </div>

        <!-- Step 2: Setup Users -->
        <div class="section">
            <h2>Step 2: Create Default Users</h2>
            <p>Create admin, pharmacist, and cashier accounts with proper password hashes.</p>
            <button onclick="setupUsers()">Setup Users</button>
            <div id="users-result"></div>
        </div>

        <!-- Step 3: Test Login -->
        <div class="section">
            <h2>Step 3: Test Login</h2>
            <p>Test the login functionality with default credentials.</p>
            <button onclick="testLogin()">Test Login</button>
            <div id="login-result"></div>
        </div>

        <!-- Quick Start -->
        <div class="section">
            <h2>🚀 Quick Start</h2>
            <div class="step">
                <div class="step-number">1</div>
                <div>Click "Test Connection" to verify database</div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div>Click "Setup Users" to create accounts</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div>Click "Test Login" to verify authentication</div>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <div>Open frontend and login with credentials shown above</div>
            </div>
        </div>
    </div>

    <script>
        async function testConnection() {
            const resultDiv = document.getElementById('connection-result');
            resultDiv.innerHTML = '<div class="loading"></div> Testing connection...';
            
            try {
                const response = await fetch('test_connection.php');
                const data = await response.json();
                
                let html = '<div class="result ' + (data.success ? 'success' : 'error') + '">';
                html += JSON.stringify(data, null, 2);
                html += '</div>';
                
                if (data.success && data.database_connection) {
                    html += '<div class="credentials">';
                    html += '<strong>✅ Database Connected!</strong>';
                    html += 'Database: ' + data.database_name + '<br>';
                    html += 'Users in database: ' + data.users_count;
                    html += '</div>';
                }
                
                resultDiv.innerHTML = html;
            } catch (error) {
                resultDiv.innerHTML = '<div class="result error">Error: ' + error.message + '</div>';
            }
        }

        async function setupUsers() {
            const resultDiv = document.getElementById('users-result');
            resultDiv.innerHTML = '<div class="loading"></div> Creating users...';
            
            try {
                const response = await fetch('setup_users.php');
                const data = await response.json();
                
                let html = '<div class="result ' + (data.success ? 'success' : 'error') + '">';
                html += JSON.stringify(data, null, 2);
                html += '</div>';
                
                if (data.success) {
                    html += '<div class="credentials">';
                    html += '<strong>✅ Users Created Successfully!</strong><br><br>';
                    html += '<strong>Default Credentials:</strong><br>';
                    data.users_created.forEach(user => {
                        html += '• Username: <code>' + user.username + '</code> | Password: <code>' + user.password + '</code> (' + user.action + ')<br>';
                    });
                    html += '<br><strong>⚠️ Change these passwords in production!</strong>';
                    html += '</div>';
                }
                
                resultDiv.innerHTML = html;
            } catch (error) {
                resultDiv.innerHTML = '<div class="result error">Error: ' + error.message + '</div>';
            }
        }

        async function testLogin() {
            const resultDiv = document.getElementById('login-result');
            resultDiv.innerHTML = '<div class="loading"></div> Testing login...';
            
            try {
                const response = await fetch('modules/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: 'admin',
                        password: 'admin123'
                    })
                });
                
                const data = await response.json();
                
                let html = '<div class="result ' + (data.success ? 'success' : 'error') + '">';
                html += JSON.stringify(data, null, 2);
                html += '</div>';
                
                if (data.success) {
                    html += '<div class="credentials">';
                    html += '<strong>✅ Login Successful!</strong><br><br>';
                    html += 'User: ' + data.user.full_name + '<br>';
                    html += 'Role: ' + data.user.role + '<br>';
                    html += 'Session Token: ' + data.session_token.substring(0, 20) + '...<br><br>';
                    html += '<strong>You can now login to the frontend!</strong>';
                    html += '</div>';
                }
                
                resultDiv.innerHTML = html;
            } catch (error) {
                resultDiv.innerHTML = '<div class="result error">Error: ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>
