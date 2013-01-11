var express = require('express');

var app = express();

app.get('/', function(request, response) {
  response.send('Welcome to BSA Tree Recycle!');
});

if(app.settings.env == 'production') {
  var port = process.env.PORT || 5000;  
} else {
  var port = 9999;
}

app.listen(port, function() {
  console.log("Listening on " + port);
});