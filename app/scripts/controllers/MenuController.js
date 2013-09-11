'use strict';

angular.module('myMapApp')
	.controller('MenuController', function ($scope, locationList) {
		$scope.setCurPos = function(index) 
		{
			locationList.setCurPos(index);
		}

		var successHandler = function(data, status, headers, config){
			$scope.locationlist = data;
		};
		var failureHandler = function(data, status, headers, config){
			console.log('error', status, headers, config);
		};

		locationList.getLocations(1, successHandler, failureHandler);
	});
