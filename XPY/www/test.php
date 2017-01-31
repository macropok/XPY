<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://paybase.com/api/user/profile");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
//curl_setopt($ch, CURLOPT_HEADER, FALSE);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer 8db934e784600b77438d7d212bcb05657a211518'));
$response = curl_exec($ch);
curl_close($ch);

var_dump($response);
?>