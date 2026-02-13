<?php
// Simple test script to check login API
$url = 'http://localhost/pharmacy-system/api/modules/login.php';
$data = json_encode([
    'username' => 'admin',
    'password' => 'admin123'
]);

$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n",
        'method'  => 'POST',
        'content' => $data
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response:\n";
echo $result;
echo "\n\nParsed:\n";
$parsed = json_decode($result, true);
print_r($parsed);
?>
