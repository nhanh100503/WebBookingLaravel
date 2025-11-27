<?php
/**
 * AMPPS Diagnostic Script
 * Run this script to check MySQL and Apache connectivity
 * Usage: php check_ampps.php
 */

echo "=== AMPPS Connection Diagnostic ===\n\n";

// Check MySQL Connection
echo "1. Checking MySQL Connection...\n";
echo "   Host: 127.0.0.1\n";
echo "   Port: 3306\n";
echo "   Username: root\n\n";

try {
    $mysql = @mysqli_connect('127.0.0.1', 'root', '', '', 3306);
    if ($mysql) {
        echo "   ✓ MySQL connection successful!\n";
        echo "   Server version: " . mysqli_get_server_info($mysql) . "\n";
        mysqli_close($mysql);
    } else {
        echo "   ✗ MySQL connection failed!\n";
        echo "   Error: " . mysqli_connect_error() . "\n";
    }
} catch (Exception $e) {
    echo "   ✗ MySQL connection error: " . $e->getMessage() . "\n";
}

echo "\n";

// Check if MySQL port is open
echo "2. Checking MySQL Port (3306)...\n";
$connection = @fsockopen('127.0.0.1', 3306, $errno, $errstr, 2);
if ($connection) {
    echo "   ✓ Port 3306 is open and accepting connections\n";
    fclose($connection);
} else {
    echo "   ✗ Port 3306 is not accessible\n";
    echo "   Error: $errstr ($errno)\n";
}

echo "\n";

// Check if Apache port is open
echo "3. Checking Apache Port (80)...\n";
$connection = @fsockopen('127.0.0.1', 80, $errno, $errstr, 2);
if ($connection) {
    echo "   ✓ Port 80 is open (Apache likely running)\n";
    fclose($connection);
} else {
    echo "   ✗ Port 80 is not accessible\n";
    echo "   Error: $errstr ($errno)\n";
}

echo "\n";

// Check phpMyAdmin URL
echo "4. Checking phpMyAdmin URL...\n";
$ch = curl_init('http://localhost/phpmyadmin/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$response = @curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    echo "   ✓ phpMyAdmin is accessible at http://localhost/phpmyadmin/\n";
} elseif ($httpCode == 0) {
    echo "   ✗ Cannot reach phpMyAdmin (Apache may not be running)\n";
} else {
    echo "   ⚠ phpMyAdmin returned HTTP code: $httpCode\n";
}

echo "\n";

// Check MySQL processes
echo "5. Checking MySQL Processes...\n";
$processes = shell_exec("ps aux | grep -i mysql | grep -v grep");
if ($processes) {
    echo "   ✓ MySQL processes found:\n";
    $lines = explode("\n", trim($processes));
    foreach ($lines as $line) {
        if (trim($line)) {
            echo "     - " . trim($line) . "\n";
        }
    }
} else {
    echo "   ✗ No MySQL processes found (MySQL may not be running)\n";
}

echo "\n";

// Check Apache processes
echo "6. Checking Apache Processes...\n";
$processes = shell_exec("ps aux | grep -iE '(httpd|apache)' | grep -v grep");
if ($processes) {
    echo "   ✓ Apache processes found:\n";
    $lines = explode("\n", trim($processes));
    foreach (array_slice($lines, 0, 3) as $line) {
        if (trim($line)) {
            echo "     - " . trim($line) . "\n";
        }
    }
} else {
    echo "   ✗ No Apache processes found (Apache may not be running)\n";
}

echo "\n";

// Summary
echo "=== Summary ===\n";
echo "If MySQL connection failed:\n";
echo "  1. Open AMPPS Control Panel\n";
echo "  2. Make sure MySQL service is 'Running' (green)\n";
echo "  3. If not, click 'Start' for MySQL\n";
echo "  4. Try again\n\n";

echo "If phpMyAdmin is not accessible:\n";
echo "  1. Make sure Apache is running in AMPPS\n";
echo "  2. Try: http://localhost/phpmyadmin/\n";
echo "  3. Check Apache error logs\n\n";

echo "For more details, see: PHPMYADMIN_TROUBLESHOOTING.md\n";

