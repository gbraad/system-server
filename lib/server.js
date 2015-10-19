var server;

var start = function() {
	var settings	= require('./settings');
	global.settings	= settings;
	var PORT		= process.env.PORT || settings.port || 3000;
	
	var express		= require('express');
	var http		= require('http');
	var bodyParser	= require('body-parser');
	var app			= express();
	global.express	= app;
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	// initial page serve
	var site		= require('./site');
	app.get('/', require('./site').index);

	// apps namespace
	var apps		= require('./apps');
	app.get('/apps', apps.list);
	app.post('/apps', apps.start);

	console.log('Listening on port: ' + PORT);
	server			= http.createServer(app);
	server.listen(PORT);

	// advertise our http endpoint
	//var mdns = require('mdns');
	//var ad = mdns.createAdvertisement(mdns.tcp('http'), PORT);
	//ad.start();
}

var stop = function stop() {
	server && server.close();
};

module.exports = {
	start: start,
	stop: stop
};

if (require.main === module) {
    start();
}
