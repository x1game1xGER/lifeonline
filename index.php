<?php
//error_reporting(0);

/** Session starten und Configurationen laden **/
session_start();
include 'config.php';

/** Hintergrund auswählen 
$bg = array('wp0.jpg', 'wp1.jpg', 'wp2.jpg', 'wp3.jpg', 'wp4.jpg');
$i = rand(0, count($bg)-1);
$selectedBg = "$bg[$i]";
$selectedBg = "wp0.jpg";
*/

/** LOGIN **/
if(isset($_POST["username"]) && isset($_POST["passwort"]))
{
	$username = $_POST["username"];
	$passwort = md5($_POST["passwort"]);
	if($passwort != "" AND $username != "")
	{
		@mysql_connect($dbhost, $dbuser, $dbpass);
		@mysql_select_db($dbname); 
		$sql = "SELECT passwort, name, playerid FROM players WHERE playerid='$username' LIMIT 1";
		$quer = @mysql_query($sql) or die(@mysql_error());
		$num = @mysql_num_rows($quer);
		if ($num == 0)
		{
			$_SESSION["meldung"] = "Falsches Passwort/Username!";
			$_SESSION["meldungcol"] = "e";
			header("Location: ./");
		}
		else
		{
			$row = @mysql_fetch_object($quer);
			$pass = $row->passwort;
			$name = $row->name;
			$uid = $row->playerid;
			if($pass == $passwort)
			{
				$_SESSION["username"] = $name;
				$_SESSION["passwort"] = $pass;
				$_SESSION["uid"] = $uid;
				setcookie("Arma3lifeonline", $name, time()+600);
				header("Location: ./");
			}
			else
			{
				$_SESSION["meldung"] = "Falsches Passwort / Benutzername!";
				$_SESSION["meldungcol"] = "e";
				header("Location: ./");
			}
		}
	}
}

/** Variablen setzen **/
if(isset($_SESSION["username"]))
{
	if(isset($_COOKIE["Arma3lifeonline"]))
	{
		$_SESSION["username"] == $_COOKIE["Arma3lifeonline"];
	}
	$username = $_SESSION["username"];
	$passwort = $_SESSION["passwort"];
	$uid = $_SESSION["uid"];
}

/** REGISTER **/
if(isset($_POST["username"]) && isset($_POST["passwort"]) && isset($_POST["passwort2"]) && isset($_POST["igpasswort"]))
{
	$username = $_POST["username"];
	$passwort = md5($_POST["passwort"]);
	$passwort2 = md5($_POST["passwort2"]);
	$igp = $_POST["igpasswort"];
	if($passwort != "" AND $username != "")
	{
		if($passwort2 == $passwort)
		{
			@mysql_connect($dbhost, $dbuser, $dbpass);
			@mysql_select_db($dbname); 
			$sql = "SELECT authcode FROM players WHERE playerid='$username'  LIMIT 1";
			$quer = @mysql_query($sql) or die(@mysql_error());
			$num = @mysql_num_rows($quer);
			if ($num == 0){
				
			}
			else
			{
				$row = @mysql_fetch_object($quer);
				$authcode = $row->authcode;
				if($authcode == $igp){
					$eintrag = "UPDATE players SET passwort='$passwort' WHERE playerid='$username'"; 
					$eintragen = @mysql_query($eintrag); 
					if($eintragen == true){ 
						@mysql_query("UPDATE players SET authcode='$passwort' WHERE playerid='$username'");
						setcookie("Arma3lifeonline", $username, time()+600);
						header("Location: ./");		
					}
				}
				else
				{
					$_SESSION["meldung"] = "Falscher authcode!";
					$_SESSION["meldungcol"] = "e";
					header("Location: ./");
				}
			}
		}
		else
		{
			$_SESSION["meldung"] = "Die Passwörter müssen übereinstimmen!";
			$_SESSION["meldungcol"] = "e";
			header("Location: ./");
		}
	}
	else
	{
		$_SESSION["meldung"] = "Passwort / Username dürfen nicht leer sein!";
		$_SESSION["meldungcol"] = "e";
		header("Location: ./");
	}
}

/** Wenn eingeloggt **/
if(isset($username))
{
	@mysql_connect($dbhost, $dbuser, $dbpass);
	@mysql_select_db($dbname); 
	
	if(isset($_GET["logout"]))
	{
		$_SESSION["username"] = "";
		$_SESSION["passwort"] = "";
		session_destroy();
		header("Location: ./");
	}

	$sql = "SELECT * FROM players WHERE name='$username'";
	$quer = @mysql_query($sql) or die(@mysql_error());
	$num = @mysql_num_rows($quer);
	if ($num != 0)
	{
		$row = @mysql_fetch_object($quer);
		$pass = $row->passwort;
		$adminlevel = $row->adminlevel;
		$bankacc = $row->bankacc;
		$_SESSION["admin"] = $adminlevel;
		$lic = $row->civ_licenses;
		$lic = str_replace("`", "", $lic);
		if (strpos($lic,'license_civ_rebel,1') !== false)
		{
			$reblic = 1;
			
		}
		else
		{
			
			$reblic = 0;
		}
		
		$sql = "SELECT members, name, owner, id FROM gangs WHERE active='1'";
		$quer = @mysql_query($sql) or die(@mysql_error());
		$num = @mysql_num_rows($quer);
		$gang = 0;
		if ($num != 0)
		{
			while ($row = @mysql_fetch_assoc($quer))
			{
				$gangstring = $row['members'];
				if(strpos($gangstring,$uid) != false)
				{
					$gang = 1;
					$my_gang = $row["name"];
					$my_gang_owner_uid = $row["owner"];
					$my_gang_id = $row["id"];
				}
			}
		}
		$sql = "SELECT pid, inventory, containers, pos FROM houses";
		$quer = @mysql_query($sql) or die(@mysql_error());
		$num = @mysql_num_rows($quer);
		$house = 0;
		if ($num != 0)
		{
			while ($row = @mysql_fetch_assoc($quer))
			{
				$housstring = $row['pid'];
				if($housstring == $uid)
				{
					$house = 1;
					$house_inventory = $row["inventory"];
					$house_pos = $row["pos"];
					$house_containers = $row["containers"];
				}
			}
		}
	}

	/* KAUFEN */
	if(isset($_GET["buy"]))
	{
		if($bankacc > $vehicleprice[$_POST["classname"]])
		{
			if(in_array($_POST["classname"], $vehicles_land))
			{
				$type = 'Car';
				$side = "civ";
			}
			elseif(in_array($_POST["classname"], $vehicles_ship))
			{
				$type = 'Ship';
				$side = "civ";
			}
			elseif(in_array($_POST["classname"], $vehicles_air))
			{
				$type = 'Air';
				$side = "civ";
			}
			elseif(in_array($_POST["classname"], $vehicles_land_police))
			{
				$type = 'Car';
				$side = "cop";
			}
			elseif(in_array($_POST["classname"], $vehicles_ship_police))
			{
				$type = 'Ship';
				$side = "cop";
			}
			elseif(in_array($_POST["classname"], $vehicles_air_police))
			{
				$type = 'Air';
				$side = "cop";
			}
			$veh_cln = $_POST["classname"];
			$veh_skn = $_POST["skin"];
			if($veh_skn == "")
			{
				$_SESSION["meldung"] = "Du hast keinen Skin ausgewählt!<br>Falls keine vorhanden sind bitte Administrator kontaktieren.";
				$_SESSION["meldungcol"] = "e";
				header("Location: ?id=shop");
			}
			else
			{
				$hid = @mysql_fetch_object(@mysql_query("SELECT id FROM vehicles ORDER BY id DESC LIMIT 1"))->id;
				$hid++;
				$newbankacc = $bankacc - $vehicleprice[$_POST["classname"]];
				@mysql_query("UPDATE players SET bankacc='$newbankacc' WHERE playerid='$uid'");
				@mysql_query("INSERT INTO `vehicles`(`id`, `side`, `classname`, `type`, `pid`, `alive`, `active`, `plate`, `color`, `inventory`) VALUES ($hid,'$side','$veh_cln','$type','$uid',1,0,$veh_plate,$veh_skn,'\"[]\"')");
				$_SESSION["meldung"] = $vehiclecton["$veh_cln"].$String_buy_success;
				$_SESSION["meldungcol"] = "s";
				header("Location: ?id=shop");
			}
		}
		else
		{
			$_SESSION["meldung"] = $String_more_money;
			$_SESSION["meldungcol"] = "e";
			header("Location: ?id=shop");
			
		}

	}
	elseif(isset($_GET["verkaufen"]))
	{
		$newbankacc = 0;
		$deletevehicle = $_GET["verkaufen"];
		@mysql_query("DELETE FROM vehicles WHERE id='$deletevehicle' AND pid='$uid'");
		$used_sell_price = $vehicleprice[$_GET['classname']] * $sellproz;
		$newbankacc = $bankacc + $used_sell_price;
		@mysql_query("UPDATE players SET bankacc='$newbankacc' WHERE playerid='$uid'");
		$_SESSION["meldung"] = $String_veh_id.$deletevehicle.$String_was_sold;
		$_SESSION["meldungcol"] = "s";
		header("Location: ?id=garage");
		
	}
	elseif(isset($_GET["creategang"]))
	{
		if($bankacc > $gang_price)
		{
			$gang_name = $_POST["Gangname"];
			
			$gs = array("??");
			$sql = "SELECT * FROM gangs";
			$quer = @mysql_query($sql) or die(@mysql_error());
			$num = @mysql_num_rows($quer);
			if ($num != 0)
			{
				while ($row = @mysql_fetch_assoc($quer))
				{
					$n = $row['name'];
					array_push($gs, $n);
				}
			}
			if (in_array($gang_name, $gs)) {
				$_SESSION["meldung"] = $String_Gang_exist;
				header("Location: ?id=gangs");
			}
			else
			{
				$gang_owner = $uid;
				$gid = @mysql_fetch_object(@mysql_query("SELECT id FROM gangs ORDER BY id DESC LIMIT 1"))->id;
				$gid++;
				$newbankacc = $bankacc - $gang_price;
				@mysql_query("UPDATE players SET bankacc='$newbankacc' WHERE playerid='$uid'");
				@mysql_query("INSERT INTO `gangs`(`id`, `owner`, `name`, `members`, `maxmembers`, `bank`, `active`) VALUES ($gid,'$gang_owner','$gang_name','\"[`".$gang_owner."`]\"', 8, 0, 1)");
				$_SESSION["meldung"] = $String_gang_name.$gang_name.$String_was_created;
				$_SESSION["meldungcol"] = "s";
				header("Location: ?id=gangs");
			}
		}
		else
		{
			$_SESSION["meldung"] = $String_more_money;
			$_SESSION["meldungcol"] = "e";
			header("Location: ?id=gangs");
		}
		
	}
	elseif(isset($_GET["deletegang"]))
	{
		$gang_to_delete = $_GET["deletegang"];
		@mysql_query("DELETE FROM gangs WHERE owner='$uid'");
		$_SESSION["meldung"] = $String_gang_name.$gang_to_delete.$String_was_deleted;
		$_SESSION["meldungcol"] = "s";
		header("Location: ?id=gangs");
		
	}
	elseif(isset($_GET["leavegang"]))
	{
		$gang_to_leave = $_GET["leavegang"];
		$leavegang_members = @mysql_fetch_object(@mysql_query("SELECT members FROM gangs WHERE owner='$my_gang_owner_uid' LIMIT 1"))->members;
		$leavegang_members = trim($leavegang_members, '"()[]');
		$leavegang_members = str_replace("`", "", $leavegang_members);
		$leavegang_members = str_replace($uid, "", $leavegang_members);
		$leavegang_members = str_replace(",,", ",", $leavegang_members);
		$leavegang_members_array = explode(',', $leavegang_members);
		$leavegang_members_c = count($leavegang_members_array);
		$new_group_members = "\"[";
		if($leavegang_members_c > 1)
		{
			foreach ($leavegang_members_array as $mem)
			{
				$new_group_members .= "`".$mem."`,";
			}
		}
		else
		{
			$new_group_members .= "";
		}
		$new_group_members .= "]\"";
		@mysql_query("UPDATE gangs SET members='$new_group_members' WHERE owner='$my_gang_owner_uid'");
		$_SESSION["meldung"] = $String_you_leaveg.$gang_to_leave.$String_leave;
		$_SESSION["meldungcol"] = "s";
		header("Location: ?id=gangs");
		
	}
	elseif(isset($_GET["gang_move_money"]))
	{
		if(isset($_POST["amount"]))
		{
			if($_POST["amount"] != "")
			{
				$amount = $_POST["amount"];
				if($bankacc >= $amount)
				{
					$newbankacc = $bankacc - $amount;
					@mysql_query("UPDATE players SET bankacc='$newbankacc' WHERE playerid='$uid'");
					$gang_bank = @mysql_fetch_object(@mysql_query("SELECT bank FROM gangs WHERE owner='$my_gang_owner_uid' LIMIT 1"))->bank;
					$newbank = $gang_bank + $amount;
					@mysql_query("UPDATE gangs SET bank='$newbank' WHERE owner='$my_gang_owner_uid'");
					header("Location: ?id=mygang");
				}
				else
				{
					$_SESSION["meldung"] = $String_more_money;
					$_SESSION["meldungcol"] = "e";
					header("Location: ?id=editgang");
				}
			}
			else
			{
				$_SESSION["meldung"] = $String_no_amount;
				$_SESSION["meldungcol"] = "e";
				header("Location: ?id=editgang");
			}
		}
	}
	elseif(isset($_GET["gang_buy_slots"]))
	{
		if(isset($_POST["amount"]))
		{
			if($_POST["amount"] != "")
			{
				$gang_bank = @mysql_fetch_object(@mysql_query("SELECT bank FROM gangs WHERE owner='$my_gang_owner_uid' LIMIT 1"))->bank;
				$amount = $_POST["amount"];
				if($gang_bank >= $amount * $Gang_slot_price)
				{
					$newgang_bank = $gang_bank - $amount * $Gang_slot_price;
					@mysql_query("UPDATE gangs SET bank='$newgang_bank' WHERE owner='$my_gang_owner_uid'");
					$gang_maxmembers = @mysql_fetch_object(@mysql_query("SELECT maxmembers FROM gangs WHERE owner='$my_gang_owner_uid' LIMIT 1"))->maxmembers;
					$newmaxmembers = $gang_maxmembers + $amount;
					@mysql_query("UPDATE gangs SET maxmembers='$newmaxmembers' WHERE owner='$my_gang_owner_uid'");
					header("Location: ?id=mygang");
				}
				else
				{
					$_SESSION["meldung"] = $String_more_money_gang;
					$_SESSION["meldungcol"] = "e";
					header("Location: ?id=editgang");
				}
			}
			else
			{
				$_SESSION["meldung"] = $String_no_amount;
				$_SESSION["meldungcol"] = "e";
				header("Location: ?id=editgang");
			}
		}
	}
	elseif(isset($_GET["news_add_post"]))
	{
		if(isset($_POST["text"]) AND isset($_POST["title"]))
		{
			if($_POST["text"] != "")
			{
				$post_id = @mysql_fetch_object(@mysql_query("SELECT id FROM news ORDER BY id DESC LIMIT 1"))->id;
				$post_id++;
				$post_datum = date('d.m.Y H:i:s');
				$post_title = $_POST["title"];
				$post_text = $_POST["text"];
				$post_text = nl2br($post_text, false);
				$post_text = '<center><h3>'.$post_title.'</h3></center>'.$post_text;
				//@mysql_query("INSERT INTO `news`(`id`, `datum`, `ersteller`, `text`, `kommentare`) VALUES ($post_id,'$post_datum','$uid','$post_text', '')");
				@mysql_query("INSERT INTO `life`.`news` (`id`, `datum`, `ersteller`, `text`, `kommentar`) VALUES ('$post_id', '$post_datum', '$uid', '$post_text', '')");
				
				//header("Location: ./");
				
			}
		}
	}
	elseif(isset($_GET["change_passwort"]))
	{
		if(isset($_POST["pw"]) AND isset($_POST["pw0"]) AND isset($_POST["pw1"]))
		{
			if($_POST["pw"] != "" AND $_POST["pw0"] != "" AND $_POST["pw1"] != "")
			{
				$ch_pw_old = $_POST["pw"];
				$ch_pw_new = $_POST["pw0"];
				$ch_pw_new1 = $_POST["pw1"];
				if($_SESSION["passwort"] == md5($ch_pw_old) AND $ch_pw_new == $ch_pw_new1)
				{
					$ch_pw_new = md5($ch_pw_new);
					@mysql_query("UPDATE players SET passwort='$ch_pw_new' WHERE playerid='$uid'");
					header("Location: ?id=account");
				}
			}
		}
	}

	if(!isset($_SESSION["meldungc"]))
	{
		$_SESSION["meldungc"] = 0;
	}

}
?>
<html>
<head>
	<link rel="icon" href="favicon.ico" type="image/x-icon" />
	<meta charset="utf-8"> 
	<title><?php echo $Main_title; ?></title>
	<link href="css/style.css" rel="stylesheet" type="text/css">
	<style type="text/css">
		body{
		background: url(img/<?php echo $selectedBg; ?>);
		background-size: cover;
		background-attachment: fixed;
		background-repeat: no-repeat;
		background-position: center center;
	}
	</style>
	<script type="text/javascript">
		function toggleMe(a){
		var e=document.getElementById(a);
		if(!e)return true;
		if(e.style.display=="none"){
		e.style.display="block"
		}
		else{
		e.style.display="none"
		}
		return true;
		}
	</script>
	<script>
		window.onload = function(){
			if ($("#close").length > 0){
				document.getElementById('close').onclick = function(){
					this.parentNode.parentNode.parentNode
					.removeChild(this.parentNode.parentNode);
					return false;
				};
			}
		};
	</script>
	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script>
		function loadshop(x){
		$('#shopright').load('shop.php?id=' +x.id);
		}
	</script>
	<?php
	if(isset($_GET["id"]))
	{
		if($_GET["id"] == "aktien")
		{
			if(isset($_GET["v"]))
			{
				if($_GET["v"] != "")
				{
					$aktien_name = $_GET["v"];
					echo "
					<script src=\"http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.1.min.js\"></script>
					<script>
						var graph;
						var xPadding = 30;
						var yPadding = 30;
						
						var data = { values:[
					";
					$sql = "SELECT * FROM aktien WHERE name='test' ORDER BY id ASC";
					$quer = @mysql_query($sql) or die(@mysql_error());
					$num = @mysql_num_rows($quer);
					if ($num != 0)
					{
						while ($row = @mysql_fetch_assoc($quer))
						{
							$aktien_datum = $row['datum'];	
							$aktien_wert = $row['wert'];	
							echo "{ X: \"".$aktien_datum."\", Y: ".$aktien_wert."},";
						}
					}
					echo "
						]};
						function getMaxY() {
							var max = 0;
							
							for(var i = 0; i < data.values.length; i ++) {
								if(data.values[i].Y > max) {
									max = data.values[i].Y;
								}
							}
							
							max += 10 - max % 10;
							return max;
						}
						function getXPixel(val) {
							return ((graph.width() - xPadding) / data.values.length) * val + (xPadding * 1.5);
						}
						function getYPixel(val) {
							return graph.height() - (((graph.height() - yPadding) / getMaxY()) * val) - yPadding;
						}
						$(document).ready(function() {
							graph = $('#graph');
							var c = graph[0].getContext('2d');            
							c.lineWidth = 2;
							c.strokeStyle = '#FFF';
							c.font = 'italic 8pt sans-serif';
							c.textAlign = \"center\";
							c.beginPath();
							c.moveTo(xPadding, 0);
							c.lineTo(xPadding, graph.height() - yPadding);
							c.lineTo(graph.width(), graph.height() - yPadding);
							c.stroke();
							for(var i = 0; i < data.values.length; i ++) {
								c.fillStyle = 'white';
								c.fillText(data.values[i].X, getXPixel(i), graph.height() - yPadding + 20);
							}
							c.textAlign = \"right\"
							c.textBaseline = \"middle\";
							for(var i = 0; i < getMaxY(); i += 50) {
								c.fillStyle = 'white';
								c.fillText(i, xPadding - 10, getYPixel(i));
							}
							c.strokeStyle = '#f00';
							c.beginPath();
							c.moveTo(getXPixel(0), getYPixel(data.values[0].Y));
							for(var i = 1; i < data.values.length; i ++) {
								c.lineTo(getXPixel(i), getYPixel(data.values[i].Y));
							}
							c.stroke();
							c.fillStyle = '#FFF';
							for(var i = 0; i < data.values.length; i ++) {  
								c.beginPath();
								c.arc(getXPixel(i), getYPixel(data.values[i].Y), 4, 0, Math.PI * 2, true);
								c.fill();
							}
						});
					</script>
					";
				}
			}
		}
	}	
	?>
</head>
<body>
<!---Headline---->
<div id="globalheader">
	<div id="headline">
		<div>
			<a style="text-decoration:none;" href="./"><h2 id="headlinetitle"><?php echo $Main_title; ?></h2></a>
		</div>
		<div id="headlinemenu">
			<?php
			if(isset($username))
			{
				$sqlp = "SELECT bankacc FROM players WHERE playerid='$uid'";
				$querp = @mysql_query($sqlp) or die(@mysql_error());
				$nump = @mysql_num_rows($querp);
				if ($nump != 0){
					$rowp = @mysql_fetch_object($querp);
					$bankacc = $rowp->bankacc;
					$bankacc = number_format($bankacc, 1, ".", "'");
					$bankacca = substr($bankacc, 0, -2);
				}
				echo"
				<a id='headlinemenu' href='./'>Home</a>
				<a id='headlinemenu' href='?id=account'>Account</a>
				";
				if(isset($my_gang))
				{
					echo"
					<a id='headlinemenu' href='?id=mygang'>".$my_gang."</a>
					";
				}
				echo "
				<a id='headlinemenu' href='?id=shop'>Shop</a>
				<a id='headlinemenu' href='?id=garage'>Garage</a>
				<a id='headlinemenu' href='?id=gangs'>Gangs</a>
				<a id='headlinemenu' href='?id=haus'>Haus</a>
				";
				if($adminlevel >= 3)
				{
					echo"
						<a id='headlinemenu' href='?id=panel'>Admin Bereich</a>
					";
				}
				if($Main_use_map == true)
				{
					echo"
						<a id='headlinemenu' href='?id=map'>Map</a>
					";
				}
				if($Main_use_aktien == true)
				{
					echo"
						<a id='headlinemenu' href='?id=aktien&v=test'>Aktien</a>
					";
				}
				echo "<a style='color:green;font-weight: 700;font-size: 15px;font-family: 'Source Sans Pro', Helvetica, Arial ,sans-serif;' id='headlinemenu'>$bankacca$</a>";
			}
			?>
		</div>
		<div id="headlinetabs">
			<?php
			if(!isset($username))
			{
				echo("
					<a id='headlinetabstext' href='?login'>Login</a><span id='headlinetabstext'>&nbsp;&nbsp;|&nbsp;</span>
					<a id='headlinetabstext' href='?register'>Register</a>
				");
			}
			else
			{
				echo("
					<a id='headlinetabstext' href='?logout'>Logout ($username)</a>
				");
			}
			?>
		</div>
	</div>
</div>
<!------->
<?php
	if(isset($_SESSION["meldung"]))
	{
		if($_SESSION["meldung"] != "")
		{
			$meldung = $_SESSION["meldung"];
			if($_SESSION["meldungcol"] == "s")
			{
				$color = "background-color: rgba(143, 208, 30, 0.39);";
			}
			elseif($_SESSION["meldungcol"] == "e")
			{
				$color = "background-color: rgba(208, 30, 30, 0.39);";
			}
			echo '
				<div>
					<a class="meldung" style="'.$color.'">
						<div>
							<span id="close">x</span>
							<p class="text">
								<center>'.$meldung.'</center>
							</p>
						</div>
					</a>
				</div>
			';
			if($_SESSION["meldungc"] == 1)
			{
				$_SESSION["meldung"] = NULL;
				$_SESSION["meldungc"] = 0;
			}
			else
			{
				$_SESSION["meldungc"] = 1;
			}
		}
	}
	
	if(!isset($_SESSION["username"]) && isset($_GET["login"]))
	{
		echo '
		<div id="content">	
		<form action="" method="post" >
			<table>
			<tr>
				<td>PlayerID:</td>
				<td><input type="text" size="24" maxlength="50" name="username"></td>
			</tr>
			<tr>
				<td>Passwort:</td>
				<td><input type="password" size="24" maxlength="50" name="passwort"></td>
				<td><input type="submit" value="Login"></td>
			</tr>
			</table>
		</form>
		</div>
		';
	}
	else if(!isset($_SESSION["username"]) && isset($_GET["register"]))
	{
		echo'
		<div id="content">	
		<form action="" method="post">
			<table>
				<tr>
					<td>PlayerID:</td>
					<td><input type="text" size="24" maxlength="64" name="username"></td>
				</tr>
				<tr>
					<td>Passwort:</td>
					<td><input type="password" size="24" maxlength="64" name="passwort"></td>
				</tr>
				<tr>
					<td>Passwort wiederholen:</td>
					<td><input type="password" size="24" maxlength="64" name="passwort2"></td>
				</tr>
				<tr>
					<td>Auth Code:</td>
					<td><input type="text" size="4" maxlength="5" name="igpasswort"><input type="submit" value="Register"></td>
				</tr>
			</table>
		</form>
		</div>		
		';
	}
	else if(isset($_SESSION["username"]) && isset($_GET["id"]))
	{
		if($_GET["id"] == "blackmarket")
		{
			if($reblic == 1)
			{
				echo'
				<div id="content">
				<center><h3>Schwarzmarkt</h3></center>
					<center><input style="background-color:rgba(128, 78, 0, 0.9)" type="button" onclick="return toggleMe(\'Vehicles\')" value="Fahrzeuge"></center>
					<div style="display:none;" id="Vehicles">
						<div id="shopc" style="background-color:rgba(128, 78, 0, 0.9)">
							<div id="item">
								<img width="256px" src="img/Vehicles/O_G_Offroad_01_armed_F.png" />
								<ul id="description">
									<li>M2 MG inklusive!</li>
									<li>Für raues Terrain geeignet</li>
									<br>
									<br>
									<span><a style="font-weight: bold;">80000&#x20ad;</a></span>&nbsp;<a href="?buy=O_G_Offroad_01_armed_F"><button>Kaufen!</button></a>
								</ul>
								<center><h2>Offroad + M2</h2></center>
							</div>
						</div>
					</div>
				</div>
				';
			}
			else
			{
				header("Location: ?id=shop");	
			}
		}
		if($_GET["id"] == "shop")
		{
			echo'
			<div id="content">
			<center><h3>Shop</h3></center>
			<div  style="height:430px;">
				<h4 style="text-align:left;">Fahrzeuge:</h4>
				<div id="shopleft">
					<center>
					<input style="background-color:rgba(0, 0, 0, 0); margin-top:5px;width:230px;text-align:left;font-weight:700;text-align:center;cursor:auto;" type="button"  value="Zivil"><br>
					';
			foreach($vehicles_land as $veh)
			{
				if(isset($vehiclecton["$veh"]))
				{
					echo '<input style="background-color:rgba(114, 181, 110, 0.9);margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=civ" onclick="loadshop(this);" value="'.$vehiclecton["$veh"].'"><br>';
				}
				else
				{
					echo '<input style="background-color:rgba(114, 181, 110, 0.9); margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=civ" onclick="loadshop(this);" value="'.$veh.'"><br>';
				}
			}
			foreach($vehicles_ship as $veh)
			{
				if(isset($vehiclecton["$veh"]))
				{
					echo '<input style="background-color:rgba(15, 113, 194, 0.9); margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=civ" onclick="loadshop(this);" value="'.$vehiclecton["$veh"].'"><br>';
				}
				else
				{
					echo '<input style="background-color:rgba(15, 113, 194, 0.9); margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=civ" onclick="loadshop(this);" value="'.$veh.'"><br>';
				}
			}
			foreach($vehicles_air as $veh)
			{
				if(isset($vehiclecton["$veh"]))
				{
					echo '<input style="background-color:rgba(92, 160, 216, 0.9); margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=civ" onclick="loadshop(this);" value="'.$vehiclecton["$veh"].'"><br>';
				}
				else
				{
					echo '<input style="background-color:rgba(92, 160, 216, 0.9); margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=civ" onclick="loadshop(this);" value="'.$veh.'"><br>';
				}
			}
			if($Main_shop_police)
			{
				echo '<input style="background-color:rgba(0, 0, 0, 0); margin-top:5px;width:230px;text-align:left;font-weight:700;text-align:center;cursor:auto;" type="button"  value="Polizei"><br>';
				foreach($vehicles_land_police as $veh)
				{
					echo '<input style="background-color:rgba(114, 181, 110, 0.9); margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=cop" onclick="loadshop(this);" value="'.$vehiclecton["$veh"].'"><br>';
				}
				foreach($vehicles_ship_police as $veh)
				{
					echo '<input style="background-color:rgba(15, 113, 194, 0.9); margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=cop" onclick="loadshop(this);" value="'.$vehiclecton["$veh"].'"><br>';
				}
				foreach($vehicles_air_police as $veh)
				{
					echo '<input style="background-color:rgba(92, 160, 216, 0.9); margin-top:5px;width:230px;text-align:left;" type="button" id="'.$veh.'&side=cop" onclick="loadshop(this);" value="'.$vehiclecton["$veh"].'"><br>';
				}
			}
			echo'		
					
					</center>
				</div>
				<div id="shopright">
					<center><h3>Willkommen im Shop, '.$username.'!</h3></center>
				</div>
			</div>
			</div>
			';
		}
		else if($_GET["id"] == "account")
		{
			$sqlp = "SELECT name, cash, bankacc, bankacc, adminlevel, donatorlvl, coplevel, playerid FROM players WHERE playerid='$uid'";
			$querp = @mysql_query($sqlp) or die(@mysql_error());
			$nump = @mysql_num_rows($querp);
			if ($nump != 0){
				$rowp = @mysql_fetch_object($querp);
				$name = $rowp->name;
				$cash = $rowp->cash;
				$bankacc = $rowp->bankacc;
				$adminlevel = $rowp->adminlevel;
				$donatorlvl = $rowp->donatorlvl;
				$coplevel = $rowp->coplevel;
				$playerid = $rowp->playerid;
				
				$bankacc = number_format($bankacc, 1, ".", "'");
				$bankacc = substr($bankacc, 0, -2);
				
				$cash = number_format($cash, 1, ".", "'");
				$cash = substr($cash, 0, -2);
			}
			
			echo'
			<div id="content">
			<center><h3>Account</h3></center>
				<div>
					<h4>Accountinfo</h4>
					<table>
						<tr>
							<td width="25"></td>
							<td  height="25"><p>Adminlevel</p></td>
							<td  height="25"><p>'.$adminlevel.'</p></td>
						</tr>
						<tr>
							<td width="25"></td>
							<td  height="25"><p>Donatorlevel</p></td>
							<td  height="25"><p>'.$donatorlvl.'</p></td>
						</tr>
						<tr>
							<td width="25"></td>
							<td  height="25"><p>Polizeilevel</p></td>
							<td  height="25"><p>'.$coplevel.'</p></td>
						</tr>
						<tr>
							<td width="25"></td>
							<td  height="25"><p>PlayerID</p></td>
							<td  height="25"><p>'.$playerid.'</p></td>
						</tr>
						<tr>
							<td width="25"></td>
							<td  height="25"><p>Altis Bank</p></td>
							<td  height="25"><p>'.$bankacc.'$</p></td>
						</tr>
						<tr>
							<td width="25"></td>
							<td  height="25"><p>Bargeld</p></td>
							<td  height="25"><p>'.$cash.'$</p></td>
						</tr>
					</table>
				</div>
				<div>
				<h4>Passwort ändern</h4>
					<form action="?change_passwort" method="post">
						<a>altes Passwort</a><br>
						<input type="password" name="pw"><br>
						<a>neues Passwort</a><br>
						<input type="password" name="pw0"><br>
						<a>wiederholen</a><br>
						<input type="password" name="pw1">
						<input type="submit" value="ändern">
					</form>
				</div>	
			</div>
			';
		}
		else if($_GET["id"] == "gangs")
		{
			echo'
			<div id="content">
			<center><h3>Wähle eine Gang aus oder erstelle eine.</h3></center>
			<center>
			<form method="post" action="?id=gang">';
			$sql = "SELECT * FROM gangs WHERE active=1";
			$quer = @mysql_query($sql) or die(@mysql_error());
			$num = @mysql_num_rows($quer);
			if ($num != 0)
			{
				echo "<div id='gangsselecet'><select name='Gang'>";
				while ($row = @mysql_fetch_assoc($quer))
				{
					$gang_name = $row['name'];
					$gang_bank = $row['bank'];
					$gang_maxmembers = $row['maxmembers'];
					$gang_members = $row['members'];
					$gang_members = trim($gang_members, '"()[]');
					$gang_members = str_replace("`", "", $gang_members);
					$gang_membersarray = explode(',', $gang_members);
					$gang_members_c = count($gang_membersarray);
					echo "<option value='".$gang_name."'>".$gang_name." ".$gang_members_c."/".$gang_maxmembers." </option>";			
				}
				echo "</select>&nbsp;<input type='submit' value='OK'/></form>";
			}
			else
			{
				echo '
					<h3>Es gibt derzeit keine Gangs!</h3>
				';
			}
			
			if ($gang == 1)
			{
				if($my_gang_owner_uid == $uid)
				{
										echo'
					<center>
						<p>Du kannst keine Gang erstellen, da du bereits in einer Gang bist!<br>Deine Gang: '.$my_gang.'</p>
						<center><a style="color: #0047B2;font-weight: 900;text-decoration:none;" href="?deletegang"><div style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;color: #FFFFFF;background-color: rgba(0,26,102,.75);">'.$my_gang.' löschen</div></a></center>
					</center>
					';

				}
				else
				{
					echo'
					<center>
						<p>Du kannst keine Gang erstellen, da du bereits in einer Gang bist!<br>Deine Gang: '.$my_gang.'</p>
						<center><a style="color: #0047B2;font-weight: 900;text-decoration:none;" href="?leavegang='.$my_gang.'"><div style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;color: #FFFFFF;background-color: rgba(0,26,102,.75);">'.$my_gang.' verlassen</div></a></center>
					</center>
					';
				}
			}
			else
			{
				echo'
				<center>
					<form method="post" action="?creategang">
					<input type="hidden" value="'.$uid.'" name="owner"/>
					<input type="text" placeholder="Gangname" name="Gangname" />
					<input type="submit" value="für 50000$ erstellen"/>
					</form>
				</center>
				';
			}			
			echo '
				</div></div>
			';
		}
		else if($_GET["id"] == "gang")
		{
			if(isset($_POST["Gang"]))
			{
				$Gang_name = $_POST["Gang"];
				$Gang_sql = "SELECT * FROM gangs WHERE name='$Gang_name' LIMIT 1";
				$Gang_quer = @mysql_query($Gang_sql) or die(@mysql_error());
				$Gang_num = @mysql_num_rows($Gang_quer);
				if ($Gang_num != 0)
				{
					$Gang_row = @mysql_fetch_object($Gang_quer);
					$Gang_bank = $Gang_row->bank;
					$Gang_maxmembers = $Gang_row->maxmembers;
					$Gang_owner_uid = $Gang_row->owner;
					$gang_members = $Gang_row->members;
					$gang_members = trim($gang_members, '"()[]');
					$gang_members = str_replace("`", "", $gang_members);
					$gang_membersarray = explode(',', $gang_members);
					$gang_members_c = count($gang_membersarray);	
					$sql3 = "SELECT name FROM players WHERE playerid='$Gang_owner_uid' LIMIT 1";
					$quer3 = @mysql_query($sql3) or die(@mysql_error());
					$num3 = @mysql_num_rows($quer3);
					if ($num3 != 0)
					{
						$row3 = @mysql_fetch_object($quer3);
						$Gang_owner = $row3->name;
					}
					
					echo "
					<div id='content'>
					";
					
					if($Gang_owner_uid == $uid)
					{
						echo"
						<a href='?id=editgang' style='text-transform: uppercase;text-decoration:none;color:#FFFFFF;'>
							<div style='padding-left:920px;'>
								edit
							</div>
						</a>
						";
					}					
					echo"
					<center><h3>$Gang_name</h3></center>
					<div>
						<br>
						<table style='undefined;table-layout: fixed; width: 216px'>
							<colgroup>
								<col style='width: 68px'>
								<col style='width: 68px'>
								<col style='width: 68px'>
								<col style='width: 68px'>
								<col style='width: 68px'>
								<col style='width: 68px'>
							</colgroup>
							<tr>
								<th colspan='3' rowspan='3'></th>
								<th colspan='3'></th>
							</tr>
							<tr>
								<td></td>
								<td colspan='3'>Gründer: $Gang_owner</td>
							</tr>
							<tr>
								<td></td>
								<td colspan='3'>Members: $gang_members_c/$Gang_maxmembers</td>
							</tr>
							<tr>
								<td></td>
								<td colspan='3'>Bank: $Gang_bank$</td>
							</tr>
						</table>
						<br>
						<ul>
							<li>Member
								<ul>
					  ";
					foreach($gang_membersarray as $v)
					{
						if($v != "")
						{
							$sql2 = "SELECT * FROM players WHERE playerid='$v' LIMIT 1";
							$quer2 = @mysql_query($sql2) or die(@mysql_error());
							$num2 = @mysql_num_rows($quer2);
							if ($num2 != 0)
							{
								$row2 = @mysql_fetch_object($quer2);
								$gang_member_name = $row2->name;
								echo "<li>".$gang_member_name."</li>";
							}
						}
					}
					echo "
								</ul>
							</li>
						</ul>
					</div>";
					
				}
				echo'<center><a style="color: #0047B2;font-weight: 900;text-decoration:none;" href="?id=gangs"><div style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;color: #FFFFFF;background-color: rgba(0,26,102,.75);">Zurück</div></a></center></div>';
			}
			else
			{
				echo '<div id="content">
				<center><h3>Keine Gang ausgewählt!</h3></center>
				<center><a style="color: #0047B2;font-weight: 900;text-decoration:none;" href="?id=gangs"><div style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;color: #FFFFFF;background-color: rgba(0,26,102,.75);">Zurück</div></a></center>
				</div>';
			}
		}
		else if($_GET["id"] == "editgang")
		{
			if($my_gang_owner_uid == $uid)
			{
				echo '
					<div id="content">
						<center>
							<h3>Spenden</h3>
							<form method="post" action="?gang_move_money">
								<input type="number" name="amount" min="500" value="500" step="250">
								<input type="submit" value="Spenden">							
							</form>

							<h3>Slots</h3>
							1 Slot 10000$
							<form method="post" action="?gang_buy_slots">
								<input type="number" min="1" max="32" name="amount">
								<input type="submit" value="Kaufen">							
							</form>
							<br>
							<a href="?deletegang='.$my_gang.'"><button>Gang löschen</button></a>
						</center>
					</div>
				';
			}
			else
			{
				echo '
					<div id="content">
						<center>
							<h3>Spenden</h3>
							<form method="post" action="?gang_move_money">
								<input type="number" name="amount" min="500" value="500" step="250">
								<input type="submit" value="Spenden">							
							</form>
							<br><br>
							<a href="?leavegang='.$my_gang.'"><button>Gang verlassen</button></a>
						</center>
					</div>
				';
			}
		}
		else if($_GET["id"] == "mygang")
		{
			if(isset($my_gang))
			{
				$Gang_name = $my_gang;
				$Gang_sql = "SELECT * FROM gangs WHERE name='$Gang_name' LIMIT 1";
				$Gang_quer = @mysql_query($Gang_sql) or die(@mysql_error());
				$Gang_num = @mysql_num_rows($Gang_quer);
				if ($Gang_num != 0)
				{
					$Gang_row = @mysql_fetch_object($Gang_quer);
					$Gang_bank = $Gang_row->bank;
					$Gang_maxmembers = $Gang_row->maxmembers;
					$Gang_owner_uid = $Gang_row->owner;
					$gang_members = $Gang_row->members;
					$gang_members = trim($gang_members, '"()[]');
					$gang_members = str_replace("`", "", $gang_members);
					$gang_membersarray = explode(',', $gang_members);
					$gang_members_c = count($gang_membersarray);	
					$sql3 = "SELECT * FROM players WHERE playerid='$Gang_owner_uid' LIMIT 1";
					$quer3 = @mysql_query($sql3) or die(@mysql_error());
					$num3 = @mysql_num_rows($quer3);
					if ($num3 != 0)
					{
						$row3 = @mysql_fetch_object($quer3);
						$Gang_owner = $row3->name;
					}
					
					echo "
					<div id='content'>
					";
						echo"
						<a href='?id=editgang' style='text-transform: uppercase;text-decoration:none;color:#FFFFFF;'>
							<div style='padding-left:920px;'>
								edit
							</div>
						</a>
					<center><h3>$Gang_name</h3></center>
					<div>
						<h4>Info</h4>
						<table style='undefined;table-layout: fixed; width: 216px'>
							<colgroup>
								<col style='width: 68px'>
								<col style='width: 68px'>
								<col style='width: 68px'>
								<col style='width: 68px'>
								<col style='width: 68px'>
								<col style='width: 68px'>
							</colgroup>
							<tr>
								<th colspan='3' rowspan='3'></th>
								<th colspan='3'></th>
							</tr>
							<tr>
								<td></td>
								<td colspan='3'>Gründer: $Gang_owner</td>
							</tr>
							<tr>
								<td></td>
								<td colspan='3'>Members: $gang_members_c/$Gang_maxmembers</td>
							</tr>
							<tr>
								<td></td>
								<td colspan='3'>Bank: $Gang_bank$</td>
							</tr>
						</table>
						<br>
						<ul>
							<li>Member
								<ul>
					  ";
					foreach($gang_membersarray as $v)
					{
						if($v != "")
						{
							$sql2 = "SELECT name FROM players WHERE playerid='$v' LIMIT 1";
							$quer2 = @mysql_query($sql2) or die(@mysql_error());
							$num2 = @mysql_num_rows($quer2);
							if ($num2 != 0)
							{
								$row2 = @mysql_fetch_object($quer2);
								$gang_member_name = $row2->name;
								echo "<li>".$gang_member_name."</li>";
							}
						}
					}
					echo "
								</ul>
							</li>
						</ul>
					</div>
					</div>";
				}
			}
			else
			{
				echo '
					<div id="content">
						<center><h3>Du bist in keiner Gang!</h3>
						<a style="color: #0047B2;font-weight: 900;text-decoration:none;" href="?id=gangs"><div style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;color: #FFFFFF;background-color: rgba(0,26,102,.75);">Tritt einer Gang bei oder erstelle eine!</div></a>
						</center>
					</div>
				';				
			}
		}
		else if($_GET["id"] == "garage")
		{
			echo'
			<div id="content">
			<center><h3>Garage</h3></center>
			<div id="garage">
			';
			$sql = "SELECT classname, alive, id, active, color FROM vehicles WHERE pid='$uid' AND alive='1'";
			$quer = @mysql_query($sql) or die(@mysql_error());
			$num = @mysql_num_rows($quer);
			if ($num != 0)
			{
				while ($row = @mysql_fetch_assoc($quer))
				{
					$garage_classname = $row['classname'];
					$garage_alive = $row['alive'];
					$garage_id = $row['id'];
					$garage_active = $row['active'];
					$garage_color = $row['color'];
					if($garage_alive == 1)
					{
						if($garage_active == 0)
						{
							$veh_name = $vehiclecton["$garage_classname"];
							$sell_price = $vehicleprice["$garage_classname"] * $sellproz;
							$sell_price = number_format($sell_price, 1, ".", "'");
							$sell_price = substr($sell_price, 0, -2);
							$garage_color = array_search($garage_color, $vehicleskins[$garage_classname]);
							echo '
							<div style="vertical-align: top;display: inline-block;text-align: center;width: 230px;">
							<img height="128px" src="img/vehicles/'.$garage_classname.'.png" /><span>'.$veh_name.' - '.$garage_color.'</span><br>
							<a style="color:rgba(0,26,102,.85);font-weight: 700;font-size: 15px;text-decoration:none;" >'.$sell_price.'$</a>&nbsp;<a href="?verkaufen='.$garage_id.'&classname='.$garage_classname.'"><button style="margin-top:5px;background-color: rgba(157, 147, 53, 0.52);">verkaufen</button></a></span>
							</div>';
						}
						else
						{
							$veh_name = $vehiclecton["$garage_classname"];
							$sell_price = $vehicleprice["$garage_classname"] * $sellproz;
							$sell_price = number_format($sell_price, 1, ".", "'");
							$sell_price = substr($sell_price, 0, -2);
							$garage_color = array_search($garage_color, $vehicleskins[$garage_classname]);
							echo '
							<div style="vertical-align: top;display: inline-block;text-align: center;width: 230px;">
								<img style="opacity: 1;" height="128px" src="img/vehicles/'.$garage_classname.'.png" /><span style="opacity: 1;">'.$veh_name.' - '.$garage_color.'</span><br>
								<a style="color:rgba(0,26,102,.85);font-weight: 700;font-size: 15px;text-decoration:none;opacity: 1;" >'.$sell_price.'$</a>&nbsp;<a><button style="cursor:pointer; margin-top:5px;background-color: rgba(157, 147, 53, 0.2);opacity: 0.25;">verkaufen</button></a></span>
							</div>';
						}
					}
				}
			}
			else
			{
				echo '
					<center>
						<h4 style="padding-top:15px;">Deine Garage ist leer!</h4>
					</center>
				';
				}
			echo'</div></div>';
		}
		else if($_GET["id"] == "panel")
		{
			echo'
				<div id="content">
				<center><h3>Admin Panel</h3>
				<h4>News Post erstellen</h4>
					<form method="post" action="?news_add_post">
						<input type="text" name="title" placeholder="Titel"><br>
						<textarea name="text" maxChars="4096" rows="11" cols="128" placeholder="Text"></textarea><br>
						<input type="submit" value="Erstellen">							
					</form>
				</center>
				</div>
			';
		}

		else if($_GET["id"] == "aktien")
		{
			echo'
				<div id="content">
				<center><h3>Aktien<br>'.$aktien_name.'</h3></center>
				<canvas id="graph" width="940" height="450">   
				</canvas> 
				</div>
			';
		}
		else if($_GET["id"] == "haus")
		{
			if($house == 1)
			{
				$house_inventory = str_replace("\"", "", $house_inventory);
				$house_inventory = str_replace("`", "", $house_inventory);
				$house_inventory = str_replace("]", "", $house_inventory);
				$house_inventory = str_replace("[", "", $house_inventory);
				$house_inventory_array = explode(',', $house_inventory);
				$house_inventory_array_count = count($house_inventory_array);
				$house_inventory_array_count = round($house_inventory_array_count/2 );
				$house_containers = str_replace("\"", "", $house_containers);
				$house_containers = str_replace("`", "", $house_containers);
				$house_containers = str_replace("]", "", $house_containers);
				$house_containers = str_replace("[", "", $house_containers);
				$house_containers_array = explode(',', $house_containers);
				$house_containers_array = array_filter($house_containers_array);
				$house_containers_array_count = count($house_containers_array);
				$house_containers_array_count = round($house_containers_array_count - 4);
				
			}
			echo'
				<div id="content">
					<center><h3>Haus</h3></center>
			';
			
			if($house == 1)
			{
				echo '
					Du hast ein Haus '.$house_pos.'.<br>
				';
				echo '
					<br>
					Inventar:
					<br>
				';
				
				$test = 0;
				if($house_inventory_array_count > 1)
				{
					while($test <= $house_inventory_array_count)
					{
						echo '&nbsp;&nbsp;'.$house_inventory_array[$test + 1].'x '.$item_cton[$house_inventory_array[$test]].'<br>';
						$test += 2;
					}
					
					echo '<br>';
					
					$test = 0;
					$test2 = 0;
					$test3 = 0;
					while($test <= $house_containers_array_count)
					{
						if($house_containers_array[$test] == 'B_supplyCrate_F'){
							echo 'Kiste:<br>';
						}
						elseif(!is_numeric($house_containers_array[$test]))
						{
							$test2 = $test3+1;
							
							while($test2 <= $house_containers_array_count)
							{
								if(is_numeric($house_containers_array[$test2]))
								{
									$test3 = $test2;
									break;
								}
								$test2++;
							}
							echo '&nbsp;&nbsp;'.$house_containers_array[$test3].'x '.$Weapon_cton[$house_containers_array[$test]].'<br>';
						}
						$test++;
					}
				}
			}
			else
			{
				echo '
				<center>
					Du hast kein Haus, kaufe dir eins um Items zu lagern<br>
					und vieles mehr.
				</center>
				';
			}

			echo'
				</div>
			';
		}
		
		else if($_GET["id"] == "map" && $Main_use_map == true)
		{
			echo '
			<div id="content">
			<center><h3>Map</h3></center>
				<iframe width="920px" height="640px" frameBorder="0" src="map/index.html" />
			</div>
			';			
		}
	}
	else
	{
		if(isset($username))
		{
			echo'
			<div id="content">
			<center><h3>News</h3></center>
			';
			$sql = "SELECT * FROM news ORDER BY id DESC";
			$quer = @mysql_query($sql) or die(@mysql_error());
			$num = @mysql_num_rows($quer);
			if ($num != 0)
			{
				while ($row = @mysql_fetch_assoc($quer))
				{
					$post_ersteller = $row['ersteller'];
					$post_datum = $row['datum'];
					$post_id = $row['id'];
					$post_text = $row['text'];
					$sql3 = "SELECT name FROM players WHERE playerid='$post_ersteller' LIMIT 1";
					$quer3 = @mysql_query($sql3) or die(@mysql_error());
					$num3 = @mysql_num_rows($quer3);
					if ($num3 != 0)
					{
						$row3 = @mysql_fetch_object($quer3);
						$post_ersteller  = $row3->name;
					}
					echo "
					<div id='Newspost'>
						<div id='Newspostleft'>
							<p>
								<center>
									<a style='font-weight: 900;'>#".$post_id."</a>
								</center>
								<br>
									Ersteller: ".$post_ersteller."
								<br>
									Datum: ".$post_datum."
							</p>
						</div>
						<div id='Newspostright'>
							".$post_text."
						</div>
					</div>
					<br>
					";
				}
			}
			
			echo'		
			</div>
			';
		}else{
		echo'
		<div id="content">
			<center><h3>Willkommen bei Arma 3 Life Online!</h3></center>
			<p>
			<ul>Arma 3 Life Online!<br>
				<li>Verwalte deine Gang Online</li>
				<li>Bestelle dir Autos, Waffen oder Essen in dein Arma 3 Life Haus!</li>
				<li>oder shoppe im Schwarzmarkt grosse mengen an Waffen und Drogen!</li>
				<li>Das reicht dir nicht? Plane überfälle und Bankräube.</li>
				<li>Du woltest immerschon ein Drogenboss sein?</li>
				<li>Das ist deine Chance!</li>
				<li>Oder willst du lieber das Böse bekämpfen?</li>
				<li>Dann trete uns bei!</li>
			</ul>
			</p>
		</div>
		';
		}
	}
	/*
	if($_SESSION["username"])
	{
		echo '
			<div id="chat">
				
				
			</div>
		';
	}
	*/
	
	@mysql_connect($dbhost, $dbuser, $dbpass);
	@mysql_select_db($dbname); 
	$result = @mysql_query("SELECT uid FROM players");
	$num_rows = @mysql_num_rows($result);
	echo"
	<div id='sidebarright'>
		<a style='color:white;font-weight: 600;font-size: 15px;font-family: 'Source Sans Pro', Helvetica, Arial ,sans-serif;'>".$String_reg_users."<br>".$num_rows."</a>
	</div>	
	<div id='sidebar'>
		<a style='color:white;font-weight: 400;font-size: 15px;font-family: 'Source Sans Pro', Helvetica, Arial ,sans-serif;' href='ts3server://rain3.org/?port=9987'><img width='48px' height='48px' src='img/teamspeak.png' /></a><br>
	</div>
	";
	?>
	<div id="foot">
		<center>
			<p>&copy;2015</p>
		</center>
	</div>
</body>
</html>


