// API FOR THE GOOGLE MAPS SERVICE
// DEPENDENT ON GOOGLE MAPS API
/*
googlemaps acts as both a service to interact with the map, and also the model for the map itself
*/
'use strict';

// pass in a google maps implementation as the mapObj
// pass in the angular timeout object
var mapFactory = function(mapObj, ng_timeout)
{
	function MapClass(in_mapObj)
	{
		this.loaded = true;
		this.mapObj = in_mapObj,
		this.map = null;
		this.location = null;
		this.city = null;
		this.country = null;
		this.longitude = null;
		this.latitude = null;
		this.zoom = null;
		this.markers = [];
		this.geocoder = new this.mapObj.Geocoder();
	}

	MapClass.prototype = 
	{
		// Create a new map at this element
		createMap : function(element, options)
		{
			this.map = new this.mapObj.Map(element, options);
		},

		// Create a new LatLng googlemaps object, since this happens fairly often
		createLatLng : function(lat, long)
		{
			return new this.mapObj.LatLng(this.getLat(), this.getLong() );
		},

		placeMarker : function( params ) 
		{
		  var animationMode = (params.animation === this.mapObj.Animation.DROP || params.animation === this.mapObj.Animation.BOUNCE) ? params.animation : '';
		  var marker = new this.mapObj.Marker({
		      position: params.position,
		      map: this.map,
		      title: params.title,
		      animation: animationMode
		  });
		  this.markers.push(marker);
		  return marker;
		},

		clearMarkers : function()
		{
			for(var i=0; i < this.markers.length; i++)
			{
				this.markers[i].setMap(null);
			}
		},

		createInfoWindow : function(heading, body) 
		{
			return new this.mapObj.InfoWindow({
				content: '<div class="infoWindow">'+
					'<h1>' + heading + '</h1>' + 
					'<div class="body">' + body + '</div>'
			});
		},

		setMapType : function(value) 
		{ 
			this.map.setMapTypeId(this.mapObj.MapTypeId[value]);
		},

		// PUT THIS IN GOOGLE MAPS SERVICE
		mapTimeout : null,
		setMapPosition : function(lat, long, zoom, callback)
		{
			ng_timeout.cancel(this.mapTimeout);
			var self = this;
			this.mapTimeout = ng_timeout(function()
			{
				self.map.panTo(new self.mapObj.LatLng(lat, long)); 
				self.map.setZoom(zoom);
				if(callback) { callback.call(); }
			}, 1000);
		},

		setLocation: function(value) { this.location = value; },
		setCity : function(value) { this.city = value; },
		setCountry : function(value) { this.country = value; },

		// setLat sets the latitude of the map
		setLat : function(value)
		{
			if(isNaN(value)) { return; }
			if(value > 90) { return; }

			this.latitude = value;
		},

		// setLong sets the longitude of the map
		setLong : function(value)
		{
			if(isNaN(value)) { return; }
			if(value > 180 || value < -180) { return; }

			this.longitude = value;
		},

		setZoom : function(value)
		{
			if(isNaN(value)) { return; }
			this.zoom = value;
		},

		getLocation : function() { return this.location; },
		getCity : function() { return this.city; },
		getCountry : function() { return this.country; },
		getLat : function() { return this.latitude; },
		getLong: function() { return this.longitude; },
		getZoom : function() { return this.zoom; }
	}
	return new MapClass(mapObj);
}

try
{
	google; // if google is not loaded, this will fail before angular assigns the service
	angular.module("myMapApp.services")
		.service('googlemaps', ['$timeout', function($timeout) { return mapFactory(google.maps, $timeout); }]);	
}
catch(e)
{
	angular.module("myMapApp.services")
		.service('googlemaps', function() { alert('Google Maps was unable to load'); console.log(e); return { loaded: false }} )
}