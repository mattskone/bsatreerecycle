module.exports = function(params){
	return {
		get: function(req, res) {
		  	res.render('index', { 
		  		data: { 
				    version: params.pkg.version, 
				    page: 'index',
				    title: 'Home'
				}
			});
		}
	};
};