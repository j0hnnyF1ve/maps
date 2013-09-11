/*
The purpose of this service is interface with the server to fetch a playable list of locations
*/

'use strict';
var locationListFactory = function(ng_http, locationURL)
{
	function LocationListClass()
	{
		this.currentPosition = 0;
	}

	LocationListClass.prototype = {
		// CAN WE WRITE THIS IN A WAY THAT WE CACHE FUTURE CALLS OF THE SAME TYPE?
		// IE, THE SAME LOCATION URL GETS A CACHED COPY
		// ADD A GETTER/SETTER FOR LOCATION URL
		// STORE COPY OF LOCATION URL LOCALLY
		// MAYBE A HASH BASED ON THE LOCATION URL?
		// get locations should have success and failure callbacks, as well as an id to do a lookup
		getLocations: function(locationsID, success, failure) 
		{
			ng_http({method: 'GET', url: locationURL})
				.success( function(data, status, headers, config) { 
					for(var i=0; i < data.length; i++) 
					{
						data[i].index = i; // add an index so we can set the current position
					}
					success(data, status, headers, config); 
				})
				.error(failure);
		},

		setCurPos : function(value) { this.currentPosition = value; },
		getCurPos : function()		{ return this.currentPosition;	}
	};
	return new LocationListClass();
}

angular.module("myMapApp.services")
	.service('locationList', ['$http', 'locationListURL', function($http, locationListURL) { return locationListFactory($http, locationListURL); }]);