// Model data
var locations = [{
    title: 'Fatima Hospital',
    location: {
        lng: 80.95747515476772,
        lat: 26.875095641973893
    },
    id: "4d37afcd0f81b60c896e393a"
}, {
    title: 'Sanjay Gandhi Post Graduate Institute Of Medical Science',
    location: {
        lng: 80.94987979731742,
        lat: 26.746916661410477
    },
    id: "51090844e4b0a6dc08898655"
}, {
    title: 'Divine Heart Hospital ',
    location: {
        lng: 81.02022552490234,
        lat: 26.854610443115234
    },
    id: "51888845498ea7ade96447b2"
}, {
    title: 'Vivekananda Polyclinic',
    location: {
        lng: 80.94225131841313,
        lat: 26.87634719664301
    },
    id: "4f2fb9d6e4b03caf5522f422"
}, {
    title: 'Sanjay Gandhi Post Graduate Institute',
    location: {
        lng: 80.97078551843309,
        lat: 26.89911455799042
    },
    id: '50d1a117e4b08030c037ca08'
}, {
    title: 'Kamla Devi Hospital & Lucknow Test Tube Baby Centre',
    location: {
        lng: 80.926112,
        lat: 26.841033
    },
    id: '50dfefebe4b0167bd6ba79ab'
}, {
    title: 'Shekhar Hospital',
    location: {
        lng: 80.98626288410205,
        lat: 26.87757346252734
    },
    id: "4e65ef7352b1260c149730ec"
}, {
    title: 'Hanumant Endosurgery Center',
    location: {
        lng: 80.98762133,
        lat: 26.84778991
    },
    id: "4cd268d33e0c8cfa4d871712"
}, {
    title: 'HAL HOSPITAL',
    location: {
        lng: 80.99108679946569,
        lat: 26.863317985917803
    },
    id: "4bcbd344b6c49c7463f99291"
}];

var client_ID = 'L0XCPHUML5UH1SUQVKMYII0AGQ5O32TYDNER5CVYAHCCULCM';
var client_SECRET = 'ZRSHPRGZNED0LVAXIJ3HKH4H0E4ML15CAOJUDIXU3IGWGVUV';
var largeInfowindow = new google.maps.InfoWindow();
"use strict";

var loc = function(title, location, marker, id) {
    var self = this;
    this.title = title;
    this.location = location;
    this.marker = marker;
    this.id = id;

    // This function populates the infowindow when the marker is clicked. It only allows
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    this.populateInfoWindow = function(infowindow) {
        var marker = self.marker;
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker !== marker) {
            // Clear the infowindow content.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
                marker.setAnimation(null);
            });
            // Get data from Foursquare
            var foursquareURL = 'https://api.foursquare.com/v2/venues/' +
                self.id + '?client_id=' + client_ID + '&client_secret=' +
                client_SECRET + '&v=20170815';
            $.getJSON(foursquareURL).done(function(data) {
                var results = data.response.venue;
                self.address = results.location.formattedAddress[0];
                self.city = results.location.city;
                self.contact = results.contact.formattedPhone;
                if (typeof self.contact === 'undefined') {
                    self.contact = "Unavailable";
                }
                if (typeof self.address === 'undefined') {
                    self.address = "Unavailable";
                }
                if (typeof self.city === 'undefined') {
                    self.city = "Unavailable";
                }
                self.content = "<div><h4>" + self.title + "</h4><p>Address: " + self.address +
                    "<br> City: " + self.city + "<br> Contact: " + self.contact +
                    "</p>" + "<p>Data provided by Foursquare</p>";
                infowindow.setContent(self.content);
                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);
            }).fail(function() {
                alert("There was an error with the Foursquare API call." +
                    "Please refresh the page and try again to load Foursquare data.");
            });
            //Timer for the marker to continue bouncing.
            setTimeout(function() {
                self.marker.setAnimation(null);
            }, 5000);
        }
    };

    // An onclick event to open the large infowindow at each marker.
    this.marker.addListener('click', function() {
        self.populateInfoWindow(largeInfowindow);
    });
};




var viewModel = function() {
    var markers = [];
    var self = this;
    this.filter = ko.observable('');
    this.alocs = ko.observableArray();
    this.isempty = ko.observable(false);

    var defaultIcon = makeMarkerIcon('E60000');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // The following group uses the location array to create an 
    // array of markers and initialize the data.
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
        });
        // An onclick event to bounce the marker.
        marker.addListener('click', function() {
            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
            }
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        // Create a new loction.
        self.alocs.push(new loc(title, position, marker, locations[i].id));
        markers.push(marker);
    }

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34)
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    // On selecting element from list view opens infowindow for that location.
    self.setopt = function(option) {
        option.populateInfoWindow(largeInfowindow);
        if (option.marker.getAnimation() !== null) {
            option.marker.setAnimation(null);
        } else {
            option.marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    };

    // Filters the locations according to input in search box.
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return self.alocs();
        } else {
            return self.alocs().filter(function(i) {
                return i.title.toLowerCase().indexOf(filter) >= 0;
            });
        }
    });

    // Used for autocomplete for filtering.
    $(function() {
        var availableTags = [];
        for (var i = 0; i < locations.length; i++)
            availableTags.push(locations[i].title);
        $("#filter-text").autocomplete({
            source: availableTags
        });
    });

    // Displays the markers of filtered locations.
    var fltr = ko.computed(function() {
        var items = self.filteredItems();
        if (items.length != 0) {
            self.isempty(false);
            hideMarkers();
            var mrks = [];
            for (var i = 0; i < items.length; i++)
                mrks.push(items[i].marker)
            showMarkers(mrks);
        } else {
            self.isempty(true);
            showMarkers(markers);
        }
    });

    // This function will loop through the listings and hide them all.
    function hideMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    // This function will loop through the markers array and display them all.
    function showMarkers(markers) {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker.
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }
};

ko.applyBindings(new viewModel());