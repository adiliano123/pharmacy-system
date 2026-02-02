<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

echo "<h1>Direct API Test</h1>";
echo "<p><strong>Current Time:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "<p><strong>Request Method:</strong> " . $_SERVER['REQUEST_METHOD'] . "</p>";
echo "<p><strong>Server:</strong> " . $_SERVER['HTTP_HOST'] . "</p>";

echo "<h2>Test Links:</h2>";
echo "<p><a href='modules/process_sale_simple.php' target='_blank'>Test Simple Process Sale (GET)</a></p>";
echo "<p><a href='test_method.php' target='_blank'>Test Method Endpoint</a></p>";
echo "<p><a href='check_sale_tables.php' target='_blank'>Check Database Tables</a></p>";

echo "<h2>POST Test Form:</h2>";
echo "<form method='POST' action='modules/process_sale_simple.php'>";
echo "<input type='hidden' name='test' value='form_data'>";
echo "<button type='submit'>Test POST to Simple Endpoint</button>";
echo "</form>";

echo "<h2>JavaScript Test:</h2>";
echo "<button onclick='testPost()'>Test POST with JavaScript</button>";
echo "<div id='result'></div>";

echo "<script>
async function testPost() {
    try {
        const response = await fetch('modules/process_sale_simple.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({test: 'javascript_data'})
        });
        
        const result = await response.json();
        document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
    } catch (error) {
        document.getElementById('result').innerHTML = '<p style=\"color: red;\">Error: ' + error.message + '</p>';
    }
}
</script>";
?>