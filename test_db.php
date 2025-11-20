<?php
$servername = "localhost";
$username = "Lloyd"; // Your MySQL username
$password = "Lpl1o2y8*@d"; // Your MySQL password
$database = "webbooking"; // Database name to check

echo "<h2>Database Connection Test</h2>";
echo "Testing connection with:<br>";
echo "Username: $username<br>";
echo "Password: " . str_repeat('*', strlen($password)) . "<br>";
echo "Database: $database<br><br>";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
  die("❌ <strong>Connection failed:</strong> " . $conn->connect_error . "<br><br>Please check your credentials in this file and update your .env file accordingly.");
}
echo "✅ <strong>Connected successfully to MySQL!</strong><br><br>";

// Check if database exists
$result = $conn->query("SHOW DATABASES LIKE '$database'");

if ($result && $result->num_rows > 0) {
  echo "✅ <strong>Database '$database' EXISTS!</strong><br>";
  
  // Try to select the database
  if ($conn->select_db($database)) {
    echo "✅ <strong>Successfully connected to database '$database'!</strong><br><br>";
    echo "<strong>If you see this message, these credentials work!</strong><br>";
    echo "Make sure your .env file has:<br>";
    echo "DB_USERNAME=$username<br>";
    echo "DB_PASSWORD=$password<br>";
    echo "DB_DATABASE=$database<br>";
  } else {
    echo "❌ Database '$database' exists but cannot be accessed. Check user permissions.<br>";
    echo "You may need to grant privileges: GRANT ALL PRIVILEGES ON $database.* TO '$username'@'localhost';<br>";
  }
} else {
  echo "❌ Database '$database' DOES NOT EXIST!<br>";
  echo "Please create the database in phpMyAdmin first.<br>";
}

$conn->close();
?>
