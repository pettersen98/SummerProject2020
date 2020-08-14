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
if ($conn->connect_error) {
	echo "Not available!";
}

$sql = "SELECT name, score, time FROM highscores ORDER BY score DESC LIMIT 10";

if($result = mysqli_query($conn, $sql)) {
	if (mysqli_num_rows($result) > 0) {
		echo "<table>";
		echo "<tr>";
		echo "<th> Name </th>";
                echo "<th> Time </th>";
                echo "<th> Score </th>";
           	echo "</tr>";
  		while($row = $result->fetch_assoc()) {
    			echo "<tr>";
			echo "<td> " . $row["name"] . " </td>";
			echo "<td> " . $row["time"] . " </td>";
			echo "<td> " . $row["score"] . " </td>";
			echo "</tr>";
		}
		echo "</table>";
	}
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

?>