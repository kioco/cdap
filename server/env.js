//
// Server environment configuration
//

(function () {

	this.configure = function (app, express, io, done) {

		process.env.NODE_ENV = process.env.NODE_ENV || 'development';

		console.log('Configuring for ' + process.env.NODE_ENV);

		if (process.env.NODE_ENV === 'development') {
			this.PORT = 9999;
		} else {
			this.PORT = 80;
		}

		app.get('/', function (req, res) {
			res.sendfile(__dirname + '/index.html');
		});
		app.use(express['static'](__dirname + '/../client/'));

		var api = this.api = require('./api');
		var fs = require('fs'),
			xml2js = require('xml2js');
		var parser = new xml2js.Parser();

		fs.readFile((process.env.CONTINUUITY_HOME || './server') + '/conf/continuuity-site.xml',
			function (err, result) {

				if (err) {
					console.log('COULD NOT OPEN CONFIG (' + (process.env.CONTINUUITY_HOME || '.') +
						'/continuuity-site.xml)');

					done(false);

				} else {
					parser.parseString(result, function (err, result) {

						var config = {};

						for (var item in result) {
							item = result[item];
							config[item.name] = item.value;
						}

						// Upload
						config['resource.manager.cloud.port'] = 45000;
						// Manager
						config['flow.manager.server.port'] = 45001;
						// Monitor
						config['flow.monitor.server.port'] = 45002;
						// Gateway
						config['gateway.port'] = 10000;

						api.configure(config);
						done(true);

					});
				}

			});

		/*
		if (process.env.NODE_ENV === 'production') {

			this.USERNAME = 'cntnty';
			this.PASSWORD = 'realtime';

			this.PORT = 80;
			this.api.configure({
				'upload': { 'host': 'upload.continuuity.com', 'port': 45000 },
				'manager': { 'host': 'manager.continuuity.com', 'port': 45001 },
				'monitor': { 'host': 'monitor.continuuity.com', 'port': 45002 },
				'gateway': { 'host': 'stream.continuuity.com', 'port': 10000, 'baseUri': '/rest-stream/' }
			});

		} else if (process.env.NODE_ENV === 'staging') {

			this.USERNAME = 'cntnty';
			this.PASSWORD = 'realtime';

			this.PORT = 80;
			this.api.configure({
				'upload': { 'host': '127.0.0.1', 'port': 45000 },
				'manager': { 'host': '127.0.0.1', 'port': 45001 },
				'monitor': { 'host': '127.0.0.1', 'port': 45002 },
				'gateway': { 'host': '127.0.0.1', 'port': 10000, 'baseUri': '/rest-stream/' }
			});

		} else {

			this.PORT = 9999;
			this.api.configure({
				'upload': { 'host': '127.0.0.1', 'port': 45000 },
				'manager': { 'host': '127.0.0.1', 'port': 45001 },
				'monitor': { 'host': '127.0.0.1', 'port': 45002 },
				'gateway': { 'host': '127.0.0.1', 'port': 10000, 'baseUri': '/rest-stream/' }
			});

		}
		*/

		io.configure('production', function(){
			io.enable('browser client minification');
			io.enable('browser client etag');
			io.enable('browser client gzip');
			io.set('log level', 1);
			io.set('transports', [
				'websocket',
				'flashsocket',
				'htmlfile',
				'xhr-polling',
				'jsonp-polling'
				]);
		});

		io.configure('development', function(){
			io.set('transports', ['websocket']);
		});
	};

}).call(exports);