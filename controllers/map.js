module.exports = function(params){
	return {
		get: function(req, res) {
		  	res.render('map', { 
		  		data: { 
				    version: params.pkg.version, 
				    page: 'map',
				    title: 'Map'
				}
			});
		}
	};
};