<?php
$dbhost = "127.0.0.1";
$dbuser = "root";
$dbpass = "";
$dbname = "life";
@mysql_connect($dbhost, $dbuser, $dbpass);
$id = @mysql_fetch_object(@mysql_query("SELECT id FROM aktien ORDER BY id DESC LIMIT 1"))->id;
$id++;
$wert = rand(50, 1500);
@mysql_query("INSERT INTO `life`.`aktien` (`id`, `name`, `wert`, `datum`) VALUES ('$id', 'test', '$wert', 'CURRENT_TIMESTAMP(6).000000')") OR die(@mysql_error());

?>