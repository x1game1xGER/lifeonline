<?php
session_start();
error_reporting(-1);
include '../../config.php';
if(isset($_GET["id"]) && $_SESSION["admin"] == 3)
{
	$s_house_id = $_GET["id"];
	@mysql_connect($dbhost, $dbuser, $dbpass);
	@mysql_select_db($dbname); 
	$abfrage = "SELECT * FROM houses WHERE id='$s_house_id'";
	$ergebnis = mysql_query($abfrage);
	while($row = mysql_fetch_object($ergebnis))
	   {
	   $s_house_owner_pid = $row->pid;
	   $s_house_inventory = $row->inventory;
	   $s_house_containers = $row->containers;
	   }
	$abfrage2 = "SELECT name FROM players WHERE playerid='$s_house_owner_pid'";
	$ergebnis2 = mysql_query($abfrage2);
	while($row2 = mysql_fetch_object($ergebnis2))
	   {
	   $s_house_owner_name = $row2->name;
	   }
	echo $s_house_owner_name."<br>".$s_house_inventory."<br>".$s_house_containers."<br>"."<br>";
}
elseif($Main_allow_Mapnames)
{
	$s_house_id = $_GET["id"];
	@mysql_connect($dbhost, $dbuser, $dbpass);
	@mysql_select_db($dbname); 
	$abfrage = "SELECT * FROM houses WHERE id='$s_house_id'";
	$ergebnis = mysql_query($abfrage);
	while($row = mysql_fetch_object($ergebnis))
	   {
	   $s_house_owner_pid = $row->pid;
	   }
	$abfrage2 = "SELECT name FROM players WHERE playerid='$s_house_owner_pid'";
	$ergebnis2 = mysql_query($abfrage2);
	while($row2 = mysql_fetch_object($ergebnis2))
	   {
	   $s_house_owner_name = $row2->name;
	   }
	echo $s_house_owner_name;
}
?>