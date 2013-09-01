<?php
$filename = isset($_GET['in_file']) ? $_GET['in_file'] . '.csv' : '';
$outputFile = $_GET['out_file'] ? $_GET['out_file'] .'.json': '';

if(!is_file($filename) ) { return; }
$content = file_get_contents($filename);
$list = explode(chr(10), $content);
$city_list = array();
foreach($list as $item)
{
	$obj =  explode(',', $item);
	if(empty($obj)) { continue; } 

	$city_info = lookup($obj[0] . ',' . $obj[1]);
	$lat = ''; $long = ''; $locType = '';
	if($city_info) 
	{
		$lat = $city_info['latitude'];
		$long = $city_info['longitude'];
		$locType = $city_info['types'];
	}

	array_push($city_list, array(
		"City" => $obj[0], 
		"Country" => $obj[1], 
		"Latitude" => $lat, 
		"Longitude" => $long,
		"LocationType" => $locType
		)
	);
}
//print_r($city_list);
$fp = fopen($outputFile, 'w');
fwrite($fp, json_encode($city_list));
fclose($fp);


function lookup($string)
{
	$string = str_replace (" ", "+", urlencode($string));
	$details_url = "http://maps.googleapis.com/maps/api/geocode/json?address=".$string."&sensor=false";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $details_url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$response = json_decode(curl_exec($ch), true);

	// If Status Code is ZERO_RESULTS, OVER_QUERY_LIMIT, REQUEST_DENIED or INVALID_REQUEST
	if ($response['status'] != 'OK') {
	return null;
	}

//	print_r($response);
	$geometry = $response['results'][0]['geometry'];
	$types = implode(',', $response['results'][0]['types']);
 
	$longitude = $geometry['location']['lat'];
	$latitude = $geometry['location']['lng'];

	$array = array(
	    'latitude' => $geometry['location']['lng'],
	    'longitude' => $geometry['location']['lat'],
	    'location_type' => $geometry['location_type'],
	    'types' => $types
	);

	return $array;
}
?>