<?php
// Simple password hash generator
// Usage: php generate_hash.php

$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password: $password\n";
echo "Hash: $hash\n";
echo "\nVerification test: " . (password_verify($password, $hash) ? 'PASS' : 'FAIL') . "\n";
?>
