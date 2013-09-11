'use strict';

angular.module('myMapApp')
	.controller('MapController', function($scope, $routeParams, googlemaps) {
	  	// handle the case where google maps was unable to load
		if(googlemaps.loaded === false) { return; }

		$scope.sidebarOpen = ($routeParams.showSidebar) ? $routeParams.showSidebar : false;

		var city = ($routeParams.city) ? $routeParams.city : ((googlemaps.getCity() ) ? googlemaps.getCity() : 'Singapore');
		var country = ($routeParams.country) ? $routeParams.country : ((googlemaps.getCountry() ) ? googlemaps.getCountry() : 'Singapore');
		var latitude = ($routeParams.latitude) ? $routeParams.latitude : ((googlemaps.getLat() ) ? googlemaps.getLat() : '1.2800945');
		var longitude = ($routeParams.longitude) ? $routeParams.longitude : ((googlemaps.getLong() ) ? googlemaps.getLong() : '103.8509491');

		// googlemaps must always be instantiated with lat/long
		// otherwise the map creation will fail
		googlemaps.setLocation(city + ',' + country);
		googlemaps.setLat(latitude);
		googlemaps.setLong(longitude);
   		googlemaps.setZoom(7);

		$scope.latitude = googlemaps.getLat();
		$scope.longitude = googlemaps.getLong();
		$scope.displayAddress = googlemaps.getLocation();
		$scope.displayLatitude = googlemaps.getLat();
		$scope.displayLongitude = googlemaps.getLong();
		
		//var search = ($routeParams.location) ? $routeParams.location : ((googlemaps && googlemaps.getLocation() ) ? googlemaps.getLocation() : 'Singapore');
		// If we have a location, we should set the location using lat/long
		// that way we avoid Geocode lookups, since we only get 2,500 a day
		//$scope.search = search;
		//$scope.search = (googlemaps && googlemaps.getLocation() ) ? googlemaps.getLocation() : 'Singapore';
		
		$scope.mapType = 'HYBRID';
	});