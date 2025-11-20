<?php
// Test different connection methods and credentials
echo "<h2>Testing MySQL Connections</h2>";

// Test 1: Current credentials from .env
echo "<h3>Test 1: Lloyd / Lpl1o2y8*@d</h3>";
try {
    $conn = new mysqli("localhost", "Lloyd", "Lpl1o2y8*@d");
    if ($conn->connect_error) {
        echo "❌ Connection failed: " . $conn->connect_error . "<br>";
    } else {
        echo "✅ Connection successful!<br>";
        $result = $conn->query("SHOW DATABASES LIKE 'webbooking'");
        if ($result && $result->num_rows > 0) {
            echo "✅ Database 'webbooking' EXISTS!<br>";
            if ($conn->select_db("webbooking")) {
                echo "✅ Successfully connected to database 'webbooking'!<br>";
            } else {
                echo "❌ Cannot access database. Permission issue.<br>";
            }
        } else {
            echo "❌ Database 'webbooking' does NOT exist!<br>";
        }
        $conn->close();
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

// Test 2: Root with empty password
echo "<h3>Test 2: root / (empty)</h3>";
try {
    $conn = new mysqli("localhost", "root", "");
    if ($conn->connect_error) {
        echo "❌ Connection failed: " . $conn->connect_error . "<br>";
    } else {
        echo "✅ Connection successful!<br>";
        $result = $conn->query("SHOW DATABASES LIKE 'webbooking'");
        if ($result && $result->num_rows > 0) {
            echo "✅ Database 'webbooking' EXISTS!<br>";
        } else {
            echo "❌ Database 'webbooking' does NOT exist!<br>";
        }
        $conn->close();
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

// Test 3: Root with password 'mysql'
echo "<h3>Test 3: root / mysql</h3>";
try {
    $conn = new mysqli("localhost", "root", "mysql");
    if ($conn->connect_error) {
        echo "❌ Connection failed: " . $conn->connect_error . "<br>";
    } else {
        echo "✅ Connection successful!<br>";
        $result = $conn->query("SHOW DATABASES LIKE 'webbooking'");
        if ($result && $result->num_rows > 0) {
            echo "✅ Database 'webbooking' EXISTS!<br>";
        } else {
            echo "❌ Database 'webbooking' does NOT exist!<br>";
        }
        $conn->close();
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

echo "<hr>";
echo "<p><strong>Please check which test shows ✅ and use those credentials in your .env file.</strong></p>";
?>

