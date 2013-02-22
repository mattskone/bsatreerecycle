module.exports = {
	get: function(req, res) {
		var fs = require('fs');
		res.set('Content-Type', 'text/plain');
		fs.readFile('LICENSE', 'utf8', function(err, text) {
			if(err) {
				console.log('Error reading license file: ' + err.message);
			} else {
				res.send(text);
			};
		});
	}
};