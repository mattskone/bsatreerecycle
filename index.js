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
  response.render('index');
});

app.get('/map', function(req, res) {
  res.render('map');
});

app.get('/createmarker', function(req, res) {
  connections.push(res);
  console.log('Connections: ' + connections.length);
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
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

app.listen(port, function() {
  console.log("Listening on " + port);
});