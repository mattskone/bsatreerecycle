var MongoClient = require('mongodb').MongoClient;

module.exports = function(params){

	return {

		get: function(req, res) {

			if(req.params.date) {

				//TODO: handle NaN values:
				var ticks = Number(req.params.date)

				MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
					if(!err) {
						db.collection('pickups', function(err, coll) {
							if(!err) {
								var start = new Date(ticks);
								var end = new Date(ticks + 1000*60*60*24);
								coll.find({"timestamp":{$gte: new Date(ticks),$lt: new Date(ticks + 1000*60*60*24)}})
									.toArray(function(err, docs) {
									    if(!err) {
									    	res.json({'pickups': docs});
									    };
								  	});
							};
						});
					};
				});

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

			params.connections.forEach(function(elem, index, array) {
				elem.write('data: ' + JSON.stringify(pickup) + '\n\n');
			})

			res.redirect('..');

		}

	};
};