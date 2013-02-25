var map,
    cookieZoom,
    cookieCenter,
    initialZoom,
    initialCenter,
    markers = [],
    selectedDate,
    today = new Date();

$(document).ready(function() {
    cookieZoom = /zoom=\d+/.exec(document.cookie);
    initialZoom = cookieZoom ? Number(cookieZoom[0].slice(5)) : 4;
    cookieCenter = /center=\(.+(?=\);?)/.exec(unescape(document.cookie));
    initialCenter = cookieCenter ? cookieCenter[0].slice(8) : '39.8333, -98.5833';
    $.getJSON('pickups/' + today.setHours(0,0,0,0), function(data) {
        addMarkers(data);
    });

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
        document.cookie='zoom=' + zoom + 
            ';expires=' + new Date(Date.now() + 1000*60*60*24*30);
        document.cookie='center=' + escape(latlng) +
            ';expires=' + new Date(Date.now() + 1000*60*60*24*30);
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
    if(timestamp) { finalTimestamp = new Date(timestamp).toLocaleString(); }
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