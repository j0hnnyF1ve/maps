'use strict';

angular.module('myMapApp')
	.controller('MainController', function ($scope, $location) {
		$scope.changeView = function(routeName){
			$location.path(routeName);
		}
	});