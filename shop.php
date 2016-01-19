<?php
include 'config.php';
$vehicle_classname = $_GET["id"];
$vehicle_name = $vehiclecton[$vehicle_classname];
$vehicle_price = $vehicleprice[$vehicle_classname];
$vehicle_description = $vehicledesc[$vehicle_classname];
$vehicle_price = number_format($vehicle_price, 1, ".", "'");
$vehicle_price = substr($vehicle_price, 0, -2);
$side = $_GET["side"];

if($side == "civ")
{
	echo '
		<center><h3 style="margin-bottom:0px;">'.$vehicle_name.'</h3></center>
		<img style="margin-top:-50px; float:left;" width="320px" src="img/vehicles/'.$vehicle_classname.'.png" />
		<div style="margin-right:25px; float:right;">
			<h4 style="margin-bottom:0px; padding-right:15px;">Beschreibung</h4>
			<div style="padding-left:15px;">
				<p>'.$vehicle_description.'</p>
				<form action="?buy" method="post">
					<input type="hidden" value="'.$vehicle_classname.'" name="classname">
					<a style="color:rgba(0,26,102,.85);font-weight: 700;font-size: 15px;text-decoration:none;">'.$vehicle_price.'$</a>
					<input type="submit" value="Kaufen" /><br><br>
					<select name="skin">';
						foreach ($vehicleskins[$vehicle_classname] as $skin) {
							echo "<option value='".$skin."'>".array_search($skin, $vehicleskins[$vehicle_classname])."</option>";
						}
						echo '
					</select>
				</form>
			</div>
		</div>
	';
}
elseif($side == "cop")
{
	echo '
		<center><h3 style="margin-bottom:0px;">'.$vehicle_name.'</h3></center>
		<img style="margin-top:-50px; float:left;" width="320px" src="img/vehicles/'.$vehicle_classname.'.png" />
		<div style="margin-right:25px; float:right;">
			<h4 style="margin-bottom:0px; padding-right:15px;">Beschreibung</h4>
			<div style="padding-left:15px;">
				<p>'.$vehicle_description.'</p>
				<form action="?buy" method="post">
					<input type="hidden" value="'.$vehicle_classname.'" name="classname">
					<a style="color:rgba(0,26,102,.85);font-weight: 700;font-size: 15px;text-decoration:none;">'.$vehicle_price.'$</a>
					<input type="submit" value="Kaufen" /><br><br>
					<select name="skin">';
						foreach ($vehicleskins_police[$vehicle_classname] as $skin) {
							echo "<option value='".$skin."'>".array_search($skin, $vehicleskins_police[$vehicle_classname])."</option>";
						}
						echo '
					</select>
				</form>
			</div>
		</div>
	';
}
?>