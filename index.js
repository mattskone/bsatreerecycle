var express = require('express'),
  fs = require('fs'),
  hbs = require('hbs'),
  MongoClient = require('mongodb').MongoClient,
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

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/license', function(req, res) {
  res.set('Content-Type', 'text/plain');
  fs.readFile('LICENSE', 'utf8', function(err, text) {
    res.send(text);
  });
});

app.get('/mark', function(req, res) {
  res.render('mark', {useragent: req.headers['user-agent']});
});

var pickups = { "pickups": [
  {"lat":47.57, "lng":-122.015, "timestamp":1360685482621, "tag":"Test1"},
  {"lat":47.57, "lng":-122.01, "timestamp":1360685515901, "tag":"Test2"},
  {"lat":47.565, "lng":-122.01, "timestamp":1360685602335, "tag":"Test3"},
  {"lat":47.565, "lng":-122.015, "timestamp":1360685698461, "tag":"Test4"}
]};

app.get('/map', function(req, res) {
    res.render('map');
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
  console.log(req.params.date);
  //TODO: handle NaN values:
  var ticks = Number(req.params.date)
  // console.log(new Date(ticks));
  MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
    if(!err) {
      db.collection('pickups', function(err, coll) {
        if(!err) {
          var start = new Date(ticks);
          var end = new Date(ticks + 1000*60*60*24);
          // console.log('Start: ' + start.toDateString() + ' End: ' + end.toDateString());
          coll.find({"timestamp":{$gte: new Date(ticks),$lt: new Date(ticks + 1000*60*60*24)}})
              .toArray(function(err, docs) {
                if(!err) {
                  // console.log(docs.length);
                  res.json({'pickups': docs});
                };
              });
        };
      });
    };
  });
});

app.post('/pickups', function(req, res) {
  var pickup = {
    "lat":parseFloat(req.body.lat),
    "lng":parseFloat(req.body.lng),
    "timestamp":new Date(req.body.timestamp),
    "tag":req.body.tag
  };

  MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
    if(!err) {
      db.collection('pickups', function(err, coll) {
        if(!err) {
          coll.insert(pickup, {w:1}, function(err, results) {
            if(err) { console.log(err); };
            db.close();
          });
        };
      });
    };
  });

  console.log(pickup);
  sendMarker('data: ' + JSON.stringify(pickup) + '\n\n');
  res.redirect('..');
});

// This function is for real-time updates of ongoing pickups
function sendMarker(data) {
  if(data) {
    connections.forEach(function(element, index, array) {
      element.write(data);
    });
  };
};

app.listen(port, "0.0.0.0", function() {
  console.log("Listening on " + port);
});