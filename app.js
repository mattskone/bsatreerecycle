/*
 * Declare module dependencies
*/

var express = require('express'),
  fs = require('fs'),
  hbs = require('hbs'),
  app = express();

/*
 * Configure Express framework
*/

app.configure(function() {
  app.use(express.static('images'));
  app.use(express.static('scripts'));
  app.use(express.static('styles'));
  app.use(express.favicon('images/favicon_32x32.ico'));
  app.use(express.logger('tiny'));
  app.engine('html', hbs.__express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
  })
});

process.on('unhandledException', function(err) {
  console.log(err.message);
});

/*
 * Register Handlebars partials
*/

//Without encoding, readFileSync() returns buffer, not string
hbs.registerPartial('footer', fs.readFileSync(__dirname + '/views/footer.html', 'utf8'));
hbs.registerPartial('head', fs.readFileSync(__dirname + '/views/head.html', 'utf8'));
hbs.registerPartial('nav', fs.readFileSync(__dirname + '/views/nav.html', 'utf8'));

/*
 * Define URL routes (controllers)
*/

require('./controllers/controller')(app);

/*
 * Start Express
*/

if(app.settings.env == 'production') {
  var port = process.env.PORT || 5000;  
} else {
  var port = 9999;
}

app.listen(port, "0.0.0.0", function() { });