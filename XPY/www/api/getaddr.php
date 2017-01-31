<?php
header('Access-Control-Allow-Origin: *');  
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$link = mysql_connect('localhost', 'atom_xpy', 'testpassword');
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

$db_selected = mysql_select_db('atom_xpy', $link);


$sqlstr = "Select * from address ";
$result = mysql_query($sqlstr, $link);


if (!$result) {
    echo "DB Error, could not query the database\n";
    echo 'MySQL Error: ' . mysql_error();
    exit;
}
$count = 0;
while ($row = mysql_fetch_assoc($result)) {
    
	//echo $sqlstr;
	$res[$count] = $row;
	$count++;
	
}
$vars['result'] = $res;
echo json_encode($vars);
exit;
?>