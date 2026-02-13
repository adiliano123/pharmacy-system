<!DOCTYPE html>
<html>
<head>
    <title>API Test</title>
    <style>
        body { font-family: monospace; padding: 20px; }
        .test { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
        .success { background: #d4edda; }
        .error { background: #f8d7da; }
        pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>API Response Test</h1>
    
    <div id="results"></div>
    
    <script>
        const apis = [
            { name: 'Login', url: 'http://localhost/pharmacy-system/api/modules/login.php', method: 'POST', body: {username: 'admin', password: 'admin123'} },
            { name: 'Admin Stats', url: 'http://localhost/pharmacy-system/api/modules/get_admin_stats_simple.php', method: 'GET' },
            { name: 'Admin Users', url: 'http://localhost/pharmacy-system/api/modules/admin_users.php?action=list', method: 'GET' },
        ];
        
        async function testAPI(api) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'test';
            resultDiv.innerHTML = `<h3>Testing: ${api.name}</h3><p>URL: ${api.url}</p>`;
            document.getElementById('results').appendChild(resultDiv);
            
            try {
                const options = {
                    method: api.method,
                    headers: { 'Content-Type': 'application/json' }
                };
                
                if (api.body) {
                    options.body = JSON.stringify(api.body);
                }
                
                const response = await fetch(api.url, options);
                const text = await response.text();
                
                resultDiv.innerHTML += `<p><strong>Status:</strong> ${response.status}</p>`;
                resultDiv.innerHTML += `<p><strong>Raw Response (first 500 chars):</strong></p>`;
                resultDiv.innerHTML += `<pre>${text.substring(0, 500)}</pre>`;
                
                try {
                    const json = JSON.parse(text);
                    resultDiv.className += ' success';
                    resultDiv.innerHTML += `<p><strong>✓ Valid JSON</strong></p>`;
                    resultDiv.innerHTML += `<pre>${JSON.stringify(json, null, 2)}</pre>`;
                } catch (e) {
                    resultDiv.className += ' error';
                    resultDiv.innerHTML += `<p><strong>✗ JSON Parse Error:</strong> ${e.message}</p>`;
                    resultDiv.innerHTML += `<p><strong>Character at position 148:</strong> "${text.charAt(148)}" (code: ${text.charCodeAt(148)})</p>`;
                    resultDiv.innerHTML += `<p><strong>Full Response:</strong></p>`;
                    resultDiv.innerHTML += `<pre>${text}</pre>`;
                }
            } catch (error) {
                resultDiv.className += ' error';
                resultDiv.innerHTML += `<p><strong>Fetch Error:</strong> ${error.message}</p>`;
            }
        }
        
        async function runTests() {
            for (const api of apis) {
                await testAPI(api);
            }
        }
        
        runTests();
    </script>
</body>
</html>
