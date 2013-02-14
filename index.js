var express = require('express'),
  hbs = require('hbs'),
  app = express(),
  connections = [];

app.configure(function() {
  app.engine('html', hbs.__express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.use(express.static('images'));
  app.use(express.static('scripts'));
  app.use(express.static('styles'));
  app.use(express.bodyParser());
  app.use(express.favicon('images/favicon_32x32.ico'));
  app.use(express.logger('tiny'));
});

if(app.settings.env == 'production') {
  var port = process.env.PORT || 5000;  
} else {
  var port = 9999;
}

app.get('/', function(request, response) {
  response.render('index'); //, {local_data: request.headers['user-agent']});
  //response.render('mobile_mark', {useragent: request.headers['user-agent']});
});

app.get('/mark', function(req, res) {
  res.render('mark', {useragent: req.headers['user-agent']});
});

var pickups = { "pickups": [
  {"lat":47.57, "lng":-122.015, "timestamp":1360685482621, "tag":"Test1"},
  {"lat":47.57, "lng":-122.01, "timestamp":1360685515901, "tag":"Test2"},
  {"lat":47.565, "lng":-122.01, "timestamp":1360685602335, "tag":"Test3"},
  {"lat":47.565, "lng":-122.017, "timestamp":1360685698461, "tag":"Test4"}
]};

app.get('/map', function(req, res) {
    res.render('map'); //, { context: JSON.stringify({ markers: markersarray }) });
});

app.get('/pickups', function(req, res) {
  console.log('Connections: ' + connections.push(res));
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  setInterval(function() {
    connections.forEach(function(element, index, array) {
      element.write('\n');  //Send one char every 25 seconds to prevent the Heroku H12 (Request Timeout) error
    });
  }, 25000);
  
  req.on('close', function() {
    connections = connections.filter(function(element, index, array) {
      return element !== res;
    });
    console.log('Connection: ' + connections.length);
  });
});

app.get('/pickups/:date', function(req, res) {
  res.json(pickups);
});

app.post('/pickups', function(req, res) {
  var latlng = JSON.stringify({"lat":req.body.lat,"lng":req.body.lng});
  //markersarray.push(JSON.parse(latlng));
  console.log(latlng);
  //console.log('Total markers: ' + markersarray.length);
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

app.get('/jstest', function(req, res) {
  res.render('jstest.jade');
});

app.listen(port, "0.0.0.0", function() {
  console.log("Listening on " + port);
});