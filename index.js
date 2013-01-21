var express = require('express'),
    app = express(),
    connections = [];

app.configure(function() {
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.logger('tiny'));
  app.use(express.static('images'));
  app.use(express.static('scripts'));
});

if(app.settings.env == 'production') {
  var port = process.env.PORT || 5000;  
} else {
  var port = 9999;
}

app.get('/', function(request, response) {
  //response.render('index', {local_data: request.headers['user-agent']});
  response.render('mobile_mark');
});

var markersarray = [
  {"lat":47.57, "lng":-122.015},
  {"lat":47.57, "lng":-122.01},
  {"lat":47.565, "lng":-122.01},
  {"lat":47.565, "lng":-122.015}
];

app.get('/map', function(req, res) {
  res.render('map', {local_data: JSON.stringify({markers:markersarray})});
});

app.get('/createmarker', function(req, res) {
  console.log('Connections: ' + connections.push(res));
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  req.on('close', function() {
    connections = connections.filter(function(element, index, array) {
      return element !== res;
    });
    console.log('Connection: ' + connections.length);
  });
});

app.post('/createmarker', function(req, res) {
  var latlng = JSON.stringify({"lat":req.body.lat,"lng":req.body.lng});
  markersarray.push(JSON.parse(latlng));
  console.log(latlng);
  console.log('Total markers: ' + markersarray.length);
  sendMarker('data: ' + latlng + '\n\n');
  res.redirect('..');
});

function sendMarker(data) {
  if(data != null) {
    connections.forEach(function(element, index, array) {
      element.write(data);
    });
  };
};

app.listen(port, function() {
  console.log("Listening on " + port);
});