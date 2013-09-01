'use strict';

angular.module('myMapApp', ['myMapApp.directives', 'myMapApp.services'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
