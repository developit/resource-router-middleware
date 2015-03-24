var Router = require('express').Router;

var keyed = ['get', 'read', 'put', 'patch', 'update', 'del', 'delete'],
	map = { index:'get', list:'get', read:'get', create:'post', update:'put', modify:'patch' };

module.exports = function ResourceRouter(route) {
	var router = Router(),
		key, fn, url;

	[].concat(route.middleware || []).forEach(router.use.bind(router));

	if (route.load) {
		router.param(route.id, function(req, res, next, id) {
			route.load(req, id, function(err, data) {
				if (err) return res.status(404).send(err);
				req[route.id] = data;
				next();
			});
		});
	}

	for (key in route) {
		fn = map[key] || key;
		if (typeof router[fn]==='function') {
			url = ~keyed.indexOf(key) ? ('/:'+route.id) : '/';
			router[fn](url, route[key]);
		}
	}

	return router;
};

module.exports.keyed = keyed;
