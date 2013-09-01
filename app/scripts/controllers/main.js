'use strict';

angular.module('myMapApp')
	.controller('MainController', function ($scope) {

	})
	.controller('MapController', function($scope) {
		$scope.search = 'Singapore';
		$scope.mapType = 'HYBRID';
		$scope.latitude = 34.397;
		$scope.longitude = 150.644;

		console.log($scope);
	});