<?php
/*
 * MySQL constant definitions 
 * 
 */
define('DB_NAME', 'dems1990_epic0815');
define('DB_USER', 'dems1990_emijd13');
define('DB_PASSWORD', 'eMijD%92_08');
define('DB_HOST', 'localhost');

function escapeXss($input) {
	$input = strip_tags($input);
	return mysql_escape_string($input);
}

if(!$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD)) {
	die('Could not connect; '  . mysql_error());
}
if(!mysql_select_db(DB_NAME, $link)) {
	die('Can\'t use ' . DB_NAME . ': ' . mysql_error());
}


$name 			= escapeXss($_POST['name']);
$title 			= ($_POST['title'] != '')?escapeXss($_POST['title']):'';
$institution 	= escapeXss($_POST['institution']);
$phone 			= escapeXss($_POST['phone']);
$email 			= escapeXss($_POST['email']);
$conf1 			= intval($_POST['conf1']);
$conf2 			= intval($_POST['conf2']);
$conf3 			= intval($_POST['conf3']);
$conf4 			= intval($_POST['conf4']);
$conf5 			= intval($_POST['conf5']);
$none  			= intval($_POST['none']);
$honey 			= $_POST['honeypot'];

if ($honey != '') {
	//Submitted by non-human
	die('Invalid request');
} else {
	$sql = "INSERT INTO Epic (name,title,institution,phone,email,conf1,conf2,conf3,conf4,conf5,none) 
	VALUES ('" . $name . "', '" . $title . "','" . $institution . "','" . $phone . "','" . $email . "','" .
	 $conf1 . "','". $conf2 . "','" . $conf3 . "','" . $conf4 . "','" . $conf5 . "','". $none ."')";
	if (!mysql_query($sql)) {
		die('Error: ' . mysql_error());
	} else {
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Epic Landing page</title>
<link href="css/style.css" rel="stylesheet" type="text/css">
<script src="js/jquery.min.js" type="text/javascript"></script>
<script src="js/jquery.validate.min.js" type="text/javascript"></script>
<script src="js/function.js" type="text/javascript"></script>
</head>

<body>
	<img src="images/spacer.gif" height="20">
	<div class="main">
		<div class="content">
			<a href="http://www.epicsciences.com" target="_blank"><img src="images/Logo.png" width="204" height="47" alt="Epic Sciences"></a>
			<div><img src="images/spacer.gif" height="20"></div>
			<img src="images/header1.png" width="700" height="174" alt="Validated Detection of CTCs" title="Validated Detection of CTCs" border="0">
			<br>
			<h1>Thank you for your interest in Epic Sciences!</h1>
			<hr/>
			<p class="h3">We will contact you in the next 2 days to schedule a meeting time.<br/><br/>For more information on the Technology please visit <a href="http://www.epicsciences.com/what-we-do.php">here.</a> or to contact us directly, please email <a href="mailto:lisa.wright@epicsciences.com">Lisa Wright</a> at Epic Sciences.</p>
		</div>
	</div>
</body>
</html>
<?php 
	}
}
mysql_close();
?>