var express = require('express');

var app = express();

app.configure(function() {
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
});

if(app.settings.env == 'production') {
  var port = process.env.PORT || 5000;  
} else {
  var port = 9999;
}

app.get('/', function(request, response) {
  //response.send('Welcome to BSA Tree Recycle!');
  response.render('index');
});

app.get('/map', function(req, res) {
  res.send('Here\'s the map');
});

app.listen(port, function() {
  console.log("Listening on " + port);
});