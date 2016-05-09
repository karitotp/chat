          L.mapbox.accessToken = 'pk.eyJ1Ijoia2FyaXRvdHAiLCJhIjoib0ppeVhnWSJ9.JOLM9BQLqtI_bjvNzjNPew';
          var geolocate = document.getElementById('geolocate');
          var map = L.mapbox.map('map', 'mapbox.streets');

          var myLayer = L.mapbox.featureLayer().addTo(map);
          if (!navigator.geolocation) {
            geolocate.innerHTML = 'Geolocation is not available';
          } else {
            geolocate.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              map.locate();
            };
          }

          map.on('locationfound', function(e) {

            map.fitBounds(e.bounds);
            var position = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [e.latlng.lng, e.latlng.lat]
              },
              properties: {
                'title': ''+user,
                'marker-color': '#ff8888',
                'marker-symbol': 'star'
              }
            };

            socket.emit('location', position);

            myLayer.setGeoJSON(position);
            myLayer.openPopup();
            geolocate.parentNode.removeChild(geolocate);


          });
          map.on('locationerror', function() {
            geolocate.innerHTML = 'Position could not be found';
          });

          //var socket = null;
          //var user = null;

    $(document).ready(function(){
    $(".layermapa").hide();
    $("#btnJoin").click(function(){
    socket = io.connect('http://localhost:3000');//iniciamos conexion con el server
    user = $("#user").val();//guardamos el usuario insertado en memoria
    socket.emit('login',user);//llamamos el evento login del server
    socket.on('chat_message', function (msg) {
    console.log('Received Message: %s', msg);
    //$(".messages").append(msg.text);
    $(".marker-title").append(msg.text);
    });
    $(".layermapa").show();
    $(".user").hide();
    });
    $('form').submit(function(){
    socket.emit('chat_message',{"user": user,"chat_message": $("#m").val()});
    $('#m').val('');
    return false;
    });
    $('#m').keyup(function (evt) {
    if (evt.keyCode === 13) {
    $('m').val('');
    }
    });
    });

           //==========================================================================
          socket.on('location', function(position) {
            console.log(position);
            myLayer.setGeoJSON(position);


          });