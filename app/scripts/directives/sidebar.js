'use strict';

angular.module('myMapApp.directives')
	.directive('sidebar', ['$timeout', 'locationList', 'googlemaps', function($timeout, locationList, googlemaps) {
	    return {
	    	restrict: 'E',
	    	replace: true,
	    	scope: {
	    		sidebarModel: '&',
	    		changeView: '=',
	    		sidebarOpen: '='
	    	},
	    	templateUrl: 'views/partials/sidebar.html',
	    	controller: function($scope) { 
	    		$scope.linkClick = function(curLocation)
	    		{
	    			var nextIndex = curLocation.index + 1;
	    			if(nextIndex >= locationList.length) { nextIndex = 0; }
					locationList.setCurPos(curLocation.index + 1); 

					$scope.gotoLocation(curLocation.index);
	    		}
	    		$scope.prev = function()
	    		{
	    			var curPosition = locationList.getCurPos();
					if(curPosition < 0) { curPosition = $scope.locations.length - 1; }

					var nextPosition = curPosition-1;
					locationList.setCurPos(nextPosition);

					$scope.gotoLocation(curPosition);
	    		}
	    		$scope.next = function()
	    		{
	    			var curPosition = locationList.getCurPos();
					if(curPosition >= $scope.locations.length) { curPosition = 0; }

					var nextPosition = curPosition+1;
					locationList.setCurPos(nextPosition);

					$scope.gotoLocation(curPosition);
	    		}
	    		$scope.gotoLocation = function(index)
	    		{
	    			var curLocation = $scope.locations[index];
					googlemaps.setCity(curLocation.City);
					googlemaps.setCountry(curLocation.Country);
					googlemaps.setLocation(curLocation.City + ', ' + curLocation.Country);
					googlemaps.setLat(curLocation.Latitude);
					googlemaps.setLong(curLocation.Longitude);
					googlemaps.setZoom(11);

					$scope.sidebarModel.curPos = index;
					$scope.sidebarModel.isLoading = true;

					var callback = function()
					{
						$scope.sidebarModel.isLoading = false;

						googlemaps.clearMarkers();
						var curMarker = googlemaps.placeMarker({ 
							position: googlemaps.createLatLng(googlemaps.getLat(), googlemaps.getLong() ), 
							title: 'Location: ' + googlemaps.getLocation(),
							animation: googlemaps.mapObj.Animation.DROP								
						});

						var infowindow = googlemaps.createInfoWindow(curLocation.City + ', ' + curLocation.Country + ' at (' + curLocation.Latitude + ', ' + curLocation.Longitude + ')', 'This is a test of the Info Window');
						$timeout(function() { infowindow.open(googlemaps.map, curMarker); }, 500 );
					}

					googlemaps.setMapPosition(googlemaps.getLat(), googlemaps.getLong(), googlemaps.getZoom(), callback);
//	    			var mapUrl = 'maps/' + curLocation.City + '/' + curLocation.Country + '/' + curLocation.Latitude + '/' + curLocation.Longitude + '/true';

//	    			$scope.changeView(mapUrl);

	    		}
	    	},
	    	link: function(scope, element) { 
				scope.sidebarModel.handleText = 'Menu';
				scope.sidebarModel.show = (scope.sidebarOpen) ? scope.sidebarOpen : true;
				scope.sidebarModel.isLoading = false;

				var successHandler = function(data, status, headers, config){
					scope.locations = data;
					scope.sidebarModel.curPos = locationList.getCurPos();
//					scope.locations[locationList.getCurPos()].selected = true;
				};
				var failureHandler = function(data, status, headers, config){
					console.log('error', status, headers, config);
				};

				locationList.getLocations(1, successHandler, failureHandler);
	    	}
	    };
	}]);