<?php
header('Access-Control-Allow-Origin: *');  
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$link = mysql_connect('localhost', 'atom_xpy', 'testpassword');
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

$db_selected = mysql_select_db('atom_xpy', $link);

$data = json_decode(file_get_contents("php://input"));

if(!$data)
	exit;


$sqlstr = "Select * from address where email='" . $data->email . "' and `addr`='".$data->addr."'";
$result = mysql_query($sqlstr, $link);


if (!$result) {
    echo "DB Error, could not query the database\n";
    echo 'MySQL Error: ' . mysql_error();
    exit;
}

if ($row = mysql_fetch_assoc($result)) {
    $sqlstr = "update address set `name` = '".$data->name."' where `email`='".$data->email."' and `addr`='".$data->addr."'";
	$result = mysql_query($sqlstr, $link);
	if (!$result) {
		echo "DB Error, could not query the database\n";
		echo 'MySQL Error: ' . mysql_error();
		exit;
	}
	echo "success";
	exit;
}
$sqlstr = "Insert into address (`id`,`email`,`name`,`addr`) values (0,'".$data->email."','".$data->name."','".$data->addr."')";

$result = mysql_query($sqlstr, $link);

if (!$result) {
    echo "DB Error, could not query the database\n";
    echo 'MySQL Error: ' . mysql_error();
    exit;
}
mysql_close($link);
echo "success";
exit;
?>