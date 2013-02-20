module.exports = function(params){
	return {
		get: function(req, res) {
		  	res.render('about', { 
		  		data: { 
				    version: params.pkg.version, 
				    page: 'about',
				    title: 'About'
				}
			});
		}
	};
};