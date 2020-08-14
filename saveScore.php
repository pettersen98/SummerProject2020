<?php
$servername = "sql111.epizy.com";
$username = "epiz_26425290";
$password = "FXi7dxUYxg";
$dbname = "epiz_26425290_operatorgamedb";

// Create connection
//$conn = new mysqli($servername, $username, $password);

$conn = mysqli_connect($servername, $username, $password, $dbname);

// Select database
//mysql_select_db('epiz_26425290_operatorgamedb', $conn);

// Check connection
if (!$conn->connect_error) {
	echo "Connected successfully! ";
}

$name = $_POST['rec_name'];
$score = $_POST['rec_score'];
$time = $_POST['rec_time'];

$sql = "INSERT INTO highscores VALUES ('$name', $score, $time)";

if (mysqli_query($conn, $sql)) {
  echo "New record created successfully!";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

?>