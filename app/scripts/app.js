'use strict';

angular.module('myMapApp', ['myMapApp.directives', 'myMapApp.services'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/maps/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/maps/:city/:country/:latitude/:longitude', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/maps/:city/:country/:latitude/:longitude/:showSidebar', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/menu/', {
        templateUrl: 'views/menu.html',
        controller: 'MenuController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

// REPLACE THIS URL WITH AN ACTUAL SERVER/API!!!!!!!!!!!!!!!!!!!!!!
// This is a dummy json object to simulate the response that we get back from the server
angular.module("myMapApp").value('locationListURL', '../server/geolocList.json');
  //  .value('locationListURL', '../server/index.php')

angular.module("myMapApp.services", []);
angular.module("myMapApp.directives", []);