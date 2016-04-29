var socket = null;
var user = null;
$(document).ready(function() {
    $("#layermapa").hide();
    $("#btnJoin").click(function() {
        socket = io.connect('http://localhost:8080'); //iniciamos conexion con el server
        user = $("#user").val(); //guardamos el usuario insertado en memoria
        //socket.on('login',user);//llamamos el evento login del server

        socket.on('message', function(msg) {
            console.log('Received Message: %s', msg);
            //$(".messages").append(msg.text);
            $(".marker-title").append(msg.text);
        });
        $("#layermapa").show();
        $(".user").hide();
    });
    $('form').submit(function() {
        socket.emit('message', {
            "user": user,
            "message": $("#textSend").val()
        });
        $('#textSend').val('');
        return false;
    });
    $('#textSend').keyup(function(evt) {
        if (evt.keyCode === 13) {
            $('textSend').val('');
        }
    });
});

L.mapbox.accessToken = 'pk.eyJ1Ijoia2FyaXRvdHAiLCJhIjoib0ppeVhnWSJ9.JOLM9BQLqtI_bjvNzjNPew';
var geolocate = document.getElementById('geolocate');
var map = L.mapbox.map('map', 'mapbox.streets');
var myLayer = L.mapbox.featureLayer().addTo(map); //api html5
if (!navigator.geolocation) {
    geolocate.innerHTML = 'Geolocation is not available';
} else {
    geolocate.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();
    };
}
//muestra posicion en el mapa
map.on('locationfound', function(e) {
    map.fitBounds(e.bounds);
    myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': '' + user,
            'marker-color': '#ff8888',
            'marker-symbol': 'star'
        }
    });
    myLayer.openPopup();
    geolocate.parentNode.removeChild(geolocate);
});
map.on('locationerror', function() {
    geolocate.innerHTML = 'Position could not be found';
});