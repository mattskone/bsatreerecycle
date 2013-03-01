var Pickup = require('../models/pickup');

module.exports = function(params){

	return {

		get: function(req, res) {

			if(req.params.date) {

				//TODO: handle NaN values:
				var ticks = Number(req.params.date),
					pickup = new Pickup();

				pickup.getPickups(ticks, function(pickups) {
					res.json(pickups);					
				})

			} else {

				params.connections.push(res);

				res.writeHead(200, {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					'Connection': 'keep-alive'
				});

				//Send one char every 25 seconds to prevent the Heroku H12 (Request Timeout) error
				setInterval(function() {
					params.connections.forEach(function(element, index, array) {
					  element.write('\n');
					});
				}, 25000);

				req.on('close', function() {
					params.connections = params.connections.filter(function(element, index, array) {
					  return element !== res;
					});
				});
			};

		},

		post: function(req, res) {

			var pickup = {
				"lat":parseFloat(req.body.lat),
				"lng":parseFloat(req.body.lng),
				"timestamp":new Date(req.body.timestamp),
				"tag":req.body.tag
			};

			new Pickup().addPickup(pickup);

			// Real-time feed via ajax:
			params.connections.forEach(function(elem, index, array) {
				elem.write('data: ' + JSON.stringify(pickup) + '\n\n');
			})

			res.redirect('..');

		}

	};
};