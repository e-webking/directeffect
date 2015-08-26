<?php

define('DB_NAME', 'dems1990_epic0815');
define('DB_USER', 'dems1990_emijd13');
define('DB_PASSWORD', 'eMijD%92_08');
define('DB_HOST', 'localhost');

$link = mysql_connect (DB_HOST, DB_USER, DB_PASSWORD);

if (!$link)  {
		die('Could not connect; '  . mysql_error());
}

$db_selected = mysql_select_db(DB_NAME, $link);

if (!$db_selected) {
		die('Can\'t use ' . DB_NAME . ': ' . mysql_error());
}

$value = $_POST['name'];
$value2 = $_POST['title'];
$value3 = $_POST['institution'];
$value4 = $_POST['phone'];
$value5 = $_POST['email'];
$value6 = $_POST['conf1'];
$value7 = $_POST['conf2'];
$value8 = $_POST['conf3'];
$value9 = $_POST['conf4'];
$value10 = $_POST['conf5'];
$value11 = $_POST['none'];

$sql = "INSERT INTO Epic (name, title, institution, phone, email, conf1, conf2, conf3, conf4, conf5, none) VALUES ('$value', '$value2', '$value3', '$value4', '$value5', '$value6', '$value7', '$value8', '$value9', '$value10', '$value11',)";

if (!mysql_query($sql)) {
	die('Error: ' . mysql_error());
}


mysql_close();
?>