module.exports = function(params){
	return {
		get: function(req, res) {
		  	res.render('mark', { 
		  		data: { 
				    version: params.pkg.version, 
				    page: 'mark',
				    title: 'Mark a Pickup'
				}
			});
		}
	};
};