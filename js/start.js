function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("wrapper").style.visibility = "hidden";
    }

function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("wrapper").style.visibility = "visible";
	  }
var map;
var largeInfowindow;
    // Constructor creates a new map
function initMap() {
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 26.8467, lng: 80.9462},
            zoom: 13,
            mapTypeControl: false
        });
        largeInfowindow = new google.maps.InfoWindow();        
        ko.applyBindings(new viewModel());
    }
function error(){
        alert('There was an error with the Google API call.'+
              'Please refresh the page and try again');
    }
