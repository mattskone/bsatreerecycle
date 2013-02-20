module.exports = function(app) {
	var connections = [],
		pkg = require('../package.json'),
		params = {
			'connections': connections,
			'pkg': pkg
		},
		index = require('./index'),
		about = require('./about'),
		license = require('./license'),
		map = require('./map'),
		mark = require('./mark'),
		pickups = require('./pickups');

	app.get('/', index(params).get);
	app.get('/about', about(params).get);
	app.get('/license', license.get);
	app.get('/map', map(params).get);
	app.get('/mark', mark(params).get);
	app.get('/pickups', pickups(params).get);
	app.get('/pickups/:date', pickups(params).get);
	app.post('/pickups', pickups(params).post);
};