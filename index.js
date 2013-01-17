var express = require('express');

var app = express();

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
  response.render('index');
});

var connections = [];

app.get('/events', function(req, res) {
  //connections.push(res);
  //console.log('Connections: ' + connections.length);
  
  //res.writeHead(200, {
  //  'Content-Type': 'text/event-stream',
  //  'Cache-Control': 'no-cache',
  //  'Connection': 'keep-alive'
  //});
  
  //sendEvent('First call');
});

app.get('/createmarker', function(req, res) {
  connections.push(res);
  console.log('Connections: ' + connections.length);
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Spam': 'eggs'
  });
});

app.get('/sendevent', function(req, res) {
  //sendEvent('Click!');
  res.send(200);
});

app.get('/map', function(req, res) {
  res.render('map');
});

app.get('/jquerytest', function(req, res) {
  res.send(req.url);
});

var times = new Array();

app.post('/jquerytest', function(req, res) {
  times.push(req.body.time);
  res.send(times);
});

app.post('/createmarker', function(req, res) {
  var latlng = 'data: ' + JSON.stringify({"lat":req.body.lat,"lng":req.body.lng}) + '\n\n';
  console.log(latlng);
  sendMarker(latlng);
  res.redirect('..');
});

function sendMarker(data) {
  if(data != null) {
    connections.forEach(function(element, index, array) {
      element.write(data);
    });
  };
};

function sendEvent(data) {
  if(data != null) {
    var event = 'data: ' + data + '\n\n';
    console.log(event);
    connections.forEach(function(element, index, array) {
      element.write(event);
    });
  } else {
    return null;
  };
};

app.listen(port, function() {
  console.log("Listening on " + port);
});