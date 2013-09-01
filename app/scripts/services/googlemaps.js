// API FOR THE GOOGLE MAPS SERVICE
// DEPENDENT ON GOOGLE MAPS API
var mapService = function(mapObj)
{
	return function() {
		return mapObj;
	


	}
}
angular.module("myMapApp.services", [])
	.service('googlemaps', mapService(google.maps));


