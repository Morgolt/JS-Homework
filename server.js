'use strict';
let http = require("http"),
	util = require('util'),
	Promise = require('promise'),
	url = require('url'),
	path = require('path'),
	fs = require('fs');

let Router = require('./router');

class Server {
	static start() {
		this.getConfig()
			.then(this.createServer);
	}

	static createServer(config) {		
		http.createServer(function (request, response) {
			const urlPath = url.parse(request.url).pathname;
			util.log(request.method + ' Request on url ' + urlPath);
			if (request.method === 'GET' && path.extname(urlPath)) {
				Server.serveStaticFiles(response, urlPath);
				return;
			}
			let route = Router.find(urlPath, config.routes);
			if (!route) {				
				response.writeHead(404)
				util.log('404. Requested URL doesn\'t exists.');
				response.end();
				return;
			}						
			try {
				let handler = require('./handlers/' + route.handler);
				handler[route.action](response, request);
			} catch(e) {
				response.writeHead(500);
				response.end();
				util.log(e);
			}
							
		}).listen(config.port);
		util.log('Server running on http://localhost:' + config.port);
	}

	static getConfig() {
		return new Promise(function(resolve) {
			fs.readFile('config.json', 'utf8', function(error, config) {
				if (error) {
					throw error;
				}
				let conf = JSON.parse(config);
				resolve({
					port: conf['port'],
					routes: conf['routes']
				});
			}); 
		});
	}

	static serveStaticFiles(response, urlPath) {
		let contentType = '';
		const filePath = '.' + urlPath;
		const ext = path.extname(urlPath);
		switch(ext) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css'
				break;
		}
		fs.readFile(filePath, function(err, file) {
			if (err) {
				response.writeHead(404);
				util.log('404. Requested URL doesn\'t exists.');
				response.end();
			} else {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end(file, 'utf-8');
			}

		});
	}
}

Server.start();


