/**
 * Demo App for middleware "node-header-session"
 */
 
 'use strict';
 
var
	express = require('express');

var
	headerSession = require('..');

var
	app = express();

app.use(express.static('static'));

headerSession(app, {
	name: 'x-demo-session-token',
	debug: true,
	metricsUrl: '/metrics/header-session'
});

app.get('/count', function (req, res) {
	
	req.headerSession.getSession().then(function (session) {
		console.log('count: receive session: ', session);
		var count = session.count || 0;
		session.count = ++count;
		res.send({
			count: count
		});
	});
});

app.listen(3000, function () {
	console.log('demo server is startet and listen on http://localhost:3000');
});

	 