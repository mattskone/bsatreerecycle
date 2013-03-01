var initialZoom,
    initialCenter,
    lastPickup = new Date(),
    map,
    markers = [],
    selectedDate,
    today = new Date();

if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  }
}

Date.fromISO8601 = function(iso8601timestamp) {
    var regexp = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:\.([0-9]+))?Z$/,
        d = regexp.exec(iso8601timestamp);

    if(d) {
        var date = new Date(d[1], d[2] - 1, d[3], d[4], d[5], d[6]),
            offset = -date.getTimezoneOffset();
        return date.setTime(Number(date) + (offset * 60 * 1000));
    }
}

$(document).ready(function() {
    initialZoom = Number(localStorage.getItem('zoom')) || 4;
    initialCenter = localStorage.getItem('center') || '39.8333, -98.5833';
    $.getJSON('pickups/' + today.setHours(0,0,0,0), function(data) {
        addMarkers(data);
    });

    if(window.EventSource) {
        var source = new EventSource('../pickups');
        source.onmessage = function(e) {
            var pickup = JSON.parse(e.data);
            //Only load new trees real-time if user is viewing pickups for "Today":
            if(!selectedDate || (today - selectedDate < 1000*60*60*24)) {
                addMarker(new google.maps.LatLng(pickup.lat, pickup.lng)
                    , pickup.timestamp
                    , pickup.tag
                );
            }
        };
    } else {
        poll();
    }
    
    $(window).resize(function() {
        $('#map_canvas').css('width', $('.container').width());
        $('#map_canvas').css('height', $('.container').width() * 0.75);
    })

    $('body').on('load', initialize());
    $('#map_canvas').css('width', $('.container').width());
    $('#map_canvas').css('height', $('.container').width() * 0.75);
    
    $('#calendar').datepicker({
        inline:true,
        maxDate:0,
        onSelect: function(dateText, calendar) {
            selectedDate = new Date($('#calendar').datepicker("getDate"));
            $('#date_link').html(
                today - selectedDate < 1000*60*60*24 ?
                "Today" :
                selectedDate.toDateString()
            );
            $('#calendar').toggle('slow');

            clearMarkers();

            $.getJSON('pickups/' + selectedDate.setHours(0,0,0,0), function(data) {
                addMarkers(data);
            });
        }
    });

    $('#date_link').html("Today");
    $('#date_link').click(function() {
        $('#calendar').toggle('slow');
    });

    $('#set_map_default').click(function() {
        var zoom = map.getZoom();
        var latlng = map.getCenter();
        localStorage.setItem('zoom', zoom);
        localStorage.setItem('center', latlng.lat() + ', ' + latlng.lng());
    });
});

function addMarkers(markers) {
    markers.pickups.forEach(function(elem, index, array) {
        addMarker(new google.maps.LatLng(elem.lat, elem.lng),
            elem.timestamp, elem.tag);
    });
};

function addMarker(location, timestamp, tag) {
    var image = new google.maps.MarkerImage("tree.gif", null, null, null, new google.maps.Size(16, 24));
    var finalTimestamp;
    if(timestamp) { finalTimestamp = new Date(Date.fromISO8601(timestamp)).toLocaleString(); }
    marker = new google.maps.Marker({
        position: location,
        title: (tag || "") + " " + (finalTimestamp || ""),
        map: map,
        icon: image
    });
    markers.push(marker);
};

function clearMarkers() {
    markers.forEach(function(elem, index, array) {
        elem.setMap(null);
    });
    markers = [];
};

function initialize() {
    var latlng = initialCenter.split(', ');
    var mapOptions = {
        center: new google.maps.LatLng(latlng[0], latlng[1]),
        zoom: initialZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);
};

/*
*   Polling implemented for browsers that don't support server-sent events.
*/
function poll() {
    $.ajax({
        dataType: 'json',
        url: 'pickups/' + lastPickup.valueOf(),
        type: 'GET',
        cache: false,
        success: function(e) {
            addMarkers(e);
            e.pickups.forEach = function(elem, idx, array) {
                lastPickup = elem.timestamp > lastPickup ? elem.timestamp : lastPickup;
            }
            setTimeout('poll()', 10000);
        },
        error: function(xhr, msg, err) {
            // No error handler yet
        }
    });
};