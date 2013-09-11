'use strict';
/* Directives */
/* Depends on googlemaps to function properly */
angular.module('myMapApp.directives')
  .directive('map', ['$timeout', 'googlemaps', function($timeout, googlemaps) {
  	
  	// handle the case where google maps was unable to load
  	if(googlemaps.loaded === false) { return {
  			restrict: 'E',
  			replace: true,
  			template: '<div class="map">Unfortunately, there was an issue loading Google Maps</div>'
  		}
  	}

    return {
    	restrict: 'E',
    	scope: {
    		searchParam: "=",
    		mapType: "=",
    		inLat: "=",
    		inLong: "=",
    		outLat: "=",
    		outLong: "=",
    		outAddress: "="
    	},
    	replace: true,
    	template: '<div class="map">My Map</div>',
		controller: ['$scope', function($scope)
		// THE CONTROLLER SHOULD MAKE CALLS ON BEHALF OF THE DIRECTIVE TO THE GOOGLE MAPS SERVICE
		// CONTROLLER CAN INTERACT WITH THE PRESENTATION MODEL/STATE ($scope), BUT SHOULD NOT MAINTAIN APP LEVEL MODEL/STATE (GOOGLE MAPS SERVICE)
		// GOOGLE MAPS SERVICE IS IN CHARGE OF MAINTAINING MAP APPLICATION MODEL/STATE
		{
 			// REWRITE THIS TO WORK WITH THE GOOGLE MAPS SERVICE
 			$scope.geocode_timeout = null;
			$scope.getGeocodeInfo = function(value)
			{
				$timeout.cancel($scope.geocode_timeout);
				$scope.geocode_timeout = $timeout(function() 
				{ 
					googlemaps.geocoder.geocode( {'address': value}, function(results, status) 
					{
						if(status !== googlemaps.mapObj.GeocoderStatus.OK || results.length < 1) { return; }

						var curLat = (results[0].geometry.location.lat()).toFixed(2),
							curLong = (results[0].geometry.location.lng()).toFixed(2),
							city = results[0].address_components[0].long_name,
							country = results[0].address_components[results[0].address_components.length - 1].long_name,
							fullAddress = results[0].formatted_address;

						// broadcast coordinates to elements that rely on it
						$scope.outLat = curLat;
						$scope.outLong = curLong;
						$scope.outAddress = fullAddress;

						googlemaps.setCity(city);
						googlemaps.setCountry(country);
						googlemaps.setLocation(fullAddress);
						googlemaps.setLat(curLat);
						googlemaps.setLong(curLong);
						googlemaps.setZoom(11);

						var callback = function()
						{
							googlemaps.clearMarkers();
							var curMarker = googlemaps.placeMarker({ 
								position: googlemaps.createLatLng(googlemaps.getLat(), googlemaps.getLong() ), 
								title: 'Location: ' + googlemaps.getLocation(),
								animation: googlemaps.mapObj.Animation.DROP								
							});
							var infowindow = googlemaps.createInfoWindow(fullAddress + ' at (' + curLat + ', ' + curLong + ')', 'This is a test of the Info Window');
							$timeout(function() { infowindow.open(googlemaps.map, curMarker); }, 500 );
						}
						googlemaps.setMapPosition(curLat, curLong, googlemaps.getZoom(), callback );

					});
				}, 1200);
			}
			$scope.mapTypeHandler = function(val) { googlemaps.setMapType(val); }
			$scope.latitudeHandler = function(val) { 
				googlemaps.setLat(val); 
				
				// maybe we do a reverse lookup of the address here?
				$scope.outLat = googlemaps.getLat();
				$scope.outLong = googlemaps.getLong();
//				$scope.outAddress = fullAddress;

				googlemaps.setMapPosition(googlemaps.getLat(), googlemaps.getLong(), googlemaps.getZoom() ); 
			}
			$scope.longitudeHandler = function(val) { 
				googlemaps.setLong(val); 

				// maybe we do a reverse lookup of the address here?
				$scope.outLat = googlemaps.getLat();
				$scope.outLong = googlemaps.getLong();

				googlemaps.setMapPosition(googlemaps.getLat(), googlemaps.getLong(), googlemaps.getZoom() ); 
			}
		}],

    	link: function(scope, element) 
    	{ 
    		// we assume that lat/lng have been set before proceeding
			var mapOptions = 
			{
				center: googlemaps.createLatLng(googlemaps.getLat(), googlemaps.getLong() ),
				zoom: googlemaps.getZoom(),
				mapTypeId: googlemaps.mapObj.MapTypeId.TERRAIN,
				mapTypeControlOptions: {
					position: googlemaps.mapObj.ControlPosition.LEFT_TOP
				}
			};
			googlemaps.createMap(element[0], mapOptions);
			googlemaps.clearMarkers();
			var curMarker = googlemaps.placeMarker({ 
				position: googlemaps.createLatLng(googlemaps.getLat(), googlemaps.getLong() ),  
				title: 'Location: ' + googlemaps.getLocation(),
				animation: googlemaps.mapObj.Animation.DROP								
			});
			var infowindow = googlemaps.createInfoWindow(googlemaps.getLocation() + ' at (' + googlemaps.getLat() + ', ' + googlemaps.getLong() + ')', 'This is a test of the Info Window');
			infowindow.open(googlemaps.map, curMarker);

			scope.$watch("searchParam", scope.getGeocodeInfo);
			scope.$watch("mapType", scope.mapTypeHandler ); 
			scope.$watch("inLat", scope.latitudeHandler );
			scope.$watch("inLong", scope.longitudeHandler );
    	}
	}
  }]);