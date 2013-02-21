var MongoClient = require('mongodb').MongoClient;

var Pickup = function() { }

/*
* Returns an array of documents from the database where 'timestamp' falls
* between the input timestamp (measured in ticks) and 24 hours later.
*/
Pickup.prototype.getPickups = function(ticks, callback) {
	MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
		if(!err) {
			db.collection('pickups', function(err, coll) {
				if(!err) {
					var start = new Date(ticks);
					var end = new Date(ticks + 1000*60*60*24);
					coll.find({"timestamp":{$gte: new Date(ticks),$lt: new Date(ticks + 1000*60*60*24)}})
						.toArray(function(err, docs) {
						    if(!err) {
						    	db.close();
						    	callback({ 'pickups': docs });
						    };
					  	});
				};
			});
		};
	});
}

/*
* Inserts a 'pickup' into the database. The input 'pickup' is expected 
* to be a JSON object  with the structure:
*
* {
	"lat": <latitude in degrees eg/ 39.8333>,
	"lng": <longitude in degress eg/ -98.5833>,
	"timestamp": <javascript Date object representing the date/time of the pickup>,
	"tag": <string label for this pickup source eg/ "Mike's Car">
* }
*/
Pickup.prototype.addPickup = function(pickup) {
	MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
		if(!err) {
			db.collection('pickups', function(err, coll) {
				if(!err) {
					coll.insert(pickup, {w:1}, function(err, results) {
						db.close();
					});
				};
			});
		};
	});
}

module.exports = Pickup;