<?php
header('Access-Control-Allow-Origin: *');  
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
//extract data from the post


$data = json_decode(file_get_contents("php://input"));
//set POST variables
$api_server = 'http://api.paycoin.com/v1/account/';
if($data->type == 'login')
	$fields = array(
	   'email' => $data->email,
	   'password' => $data->password
	);
else
	$fields = array(
	   'id' => $data->id
	);
if($data->type == 'auth/check')
	$fields = array(
	   'email' => $data->email,
	   'code' => $data->code
	);
//url-ify the data for the POST

//open connection
$ch = curl_init();
$url = $api_server.$data->type."/";

$data_string = json_encode($fields);  
echo $data_string;
//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);                                                                  
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      


//execute post
$result = curl_exec($ch);
echo $result;
//close connection
curl_close($ch);
?>