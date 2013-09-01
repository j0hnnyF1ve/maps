'use strict';
/* Directives */
/* Depends on googlemaps to function properly */
angular.module('myMapApp.directives', [])
  .directive('map', ['$timeout', 'googlemaps', function($timeout, googlemaps) {
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
			// PUT THESE IN THE GOOGLE MAPS SERVICE
    		$scope.cur_longitude = 150.644;
    		$scope.cur_latitude = 34.397;
    		$scope.curZoom = 9;
			$scope.markers = [];
			$scope.geocoder = new googlemaps.Geocoder();

			// PUT THIS IN GOOGLE MAPS SERVICE
 			$scope.createMap = function(element, options)
 			{
 				$scope.myMap = new googlemaps.Map(element, options);
 			}

 			// REWRITE THIS TO WORK WITH THE GOOGLE MAPS SERVICE
 			$scope.geocode_timeout = null;
			$scope.getGeocodeInfo = function(value)
			{
				$timeout.cancel($scope.geocode_timeout);
				$scope.geocode_timeout = $timeout(function() 
				{ 
					$scope.geocoder.geocode( {'address': value}, function(results, status) 
					{
						if(status !== googlemaps.GeocoderStatus.OK || results.length < 1) { return; }

						var curLat = Math.round(results[0].geometry.location.lat(), 2),
							curLong = Math.round(results[0].geometry.location.lng(), 2),
							fullAddress = results[0].formatted_address;

						$scope.outLat = curLat;
						$scope.outLong = curLong;
						$scope.outAddress = fullAddress;

						$scope.setMapPosition(curLat, curLong, $scope.curZoom);

						$scope.clearMarkers();
						$scope.placeMarker({ 
							position: results[0].geometry.location, 
							map: $scope.myMap,
							title: 'Location: ' + fullAddress,
							animation: googlemaps.Animation.DROP								
						});
					});
				}, 2000);
			}

			$scope.placeMarker = function( params ) 
			{
			  var animationMode = (params.animation === googlemaps.Animation.DROP || params.animation === googlemaps.Animation.BOUNCE) ? params.animation : '';
			  var marker = new googlemaps.Marker({
			      position: params.position,
			      map: params.map,
			      title: params.title,
			      animation: animationMode
			  });
			  $scope.markers.push(marker);
			}

			$scope.clearMarkers = function()
			{
				for(var i=0; i < $scope.markers.length; i++)
				{
					$scope.markers[i].setMap(null);
				}
			}

			// PUT THIS IN GOOGLE MAPS SERVICE
			$scope.setMapType = function(value) 
			{ 
				$scope.myMap.setMapTypeId(googlemaps.MapTypeId[value]);
			}

			// PUT THIS IN GOOGLE MAPS SERVICE
			$scope.setLat = function(value)
			{
				if(isNaN(value)) { return; }
				if(value > 90 || value < 0) { return; }

				$scope.cur_latitude = Math.round(value, 2);
				$scope.setMapPosition($scope.cur_latitude, $scope.cur_longitude, $scope.curZoom); 
			}

			// PUT THIS IN GOOGLE MAPS SERVICE
			$scope.setLong = function(value)
			{
				if(isNaN(value)) { return; }
				if(value > 180 || value < -180) { return; }

				$scope.cur_longitude = Math.round(value, 2);
				$scope.setMapPosition($scope.cur_latitude, $scope.cur_longitude, $scope.curZoom); 
			}

			// PUT THIS IN GOOGLE MAPS SERVICE
			$scope.map_timeout = null;
			$scope.setMapPosition = function(lat, long, zoom)
			{
				$timeout.cancel($scope.map_timeout);
				$scope.map_timeout = $timeout(function()
				{
					$scope.myMap.panTo(new googlemaps.LatLng(lat, long)); 
					$scope.myMap.setZoom(zoom);
				}, 1000);
			}
		}],

    	link: function(scope, element, attrs, ctrl) 
    	{ 
			var mapOptions = 
			{
				center: new googlemaps.LatLng(scope.cur_latitude, scope.cur_longitude),
				zoom: 4,
				mapTypeId: googlemaps.MapTypeId.TERRAIN,
			};
			scope.createMap(element[0], mapOptions)
			scope.$watch("searchParam", scope.getGeocodeInfo);
			scope.$watch("mapType", scope.setMapType); 
			scope.$watch("inLat", scope.setLat);
			scope.$watch("inLong", scope.setLong);

			console.log(scope);
    	}
	}
  }]);