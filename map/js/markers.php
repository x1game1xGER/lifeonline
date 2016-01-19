<?php
include '../../config.php';
echo '
dzMap.buildings = [
	' ;
		@mysql_connect($dbhost, $dbuser, $dbpass);
		@mysql_select_db($dbname); 
		$quer = @mysql_query("SELECT pos, owned, id FROM houses") or die(@mysql_error());
		$num = @mysql_num_rows($quer);
		if ($num != 0)
		{
			$id = 0;
			while ($row = @mysql_fetch_assoc($quer))
			{
				$house_owned = $row['owned'];
				if($house_owned)
				{
					$house_marker = "house_set";
				}
				else
				{
					$house_marker = "house_free";
				}
				$house_pos = $row["pos"];
				$house_id = $row["id"];
				$house_pos = str_replace("[", "", $house_pos);
				$house_pos = str_replace("]", "", $house_pos);
				$house_pos_coord = explode(',', $house_pos);
				$house_pos_coord[0] = ($house_pos_coord[0] - 185) / 10000 * 26.2;
				$house_pos_coord[2] = (10000 - $house_pos_coord[1] + 150) / 10000 * 26.2;
				echo '
	{
		id: '.$id.',
		x: '.$house_pos_coord[2].',
		y: '.$house_pos_coord[0].',
		Type: "'.$house_marker.'",
		s: 6,
		Icon: "'.$house_id.'"
	},
				';
				$id++;
			}
		}
		echo '
	
	{
		id: 999,
		x: 0.0,
		y: 0.0,
		Type: "",
		s: 6,
		Icon: ""
	},
	];

	dzMap.markers = [
	{
		id:50734,
		x:10.1,
		y:20.9,
		Type:"label",
		i:"",
		n:"Old Town",
		Icon:"normal"
	},
	{
		id:50734,
		x:8.35,
		y:22.1,
		Type:"label",
		i:"",
		n:"Lakewood",
		Icon:"light"
	},
	{
		id:50734,
		x:4.9,
		y:22.9,
		Type:"label",
		i:"",
		n:"Smallville",
		Icon:"light"
	},
	{
		id:50734,
		x:12.8,
		y:20.8,
		Type:"label",
		i:"",
		n:"Springfield Cliffs",
		Icon:"normal"
	},
	{
		id:50734,
		x:16.2,
		y:17.3,
		Type:"label",
		i:"",
		n:"Old Bedford",
		Icon:"normal"
	},
	{
		id:50734,
		x:23.4,
		y:12.8,
		Type:"label",
		i:"",
		n:"Nueva San Cristobal",
		Icon:"normal"
	},
	{
		id:50734,
		x:18.2,
		y:13.6,
		Type:"label",
		i:"",
		n:"Morrison Town",
		Icon:"normal"
	},
	{
		id:50734,
		x:6.6,
		y:8.8,
		Type:"label",
		i:"",
		n:"Los Diablos",
		Icon:"heavy"
	},
	{
		id:50734,
		x:5.2,
		y:15.0,
		Type:"label",
		i:"",
		n:"New Haven",
		Icon:"normal"
	},
	{
		id:50734,
		x:9.2,
		y:21.5,
		Type:"label",
		i:"",
		n:"Lakeside//Hauptstadt",//8554.96,6577.36
		Icon:"heavy"
	}
	];
	dzMap.onLoaded();
';
?>