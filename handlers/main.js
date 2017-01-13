'use strict';
let Promise = require('promise'),
	xslt = require('libxslt'),
	readFile = Promise.denodeify(require('fs').readFile),
	fs = require('fs'),
	qs = require('querystring'),
	util = require('util');

class Main {
	static index(response) {
		xslt.parseFile('xml/vcard.xsl', function (err, style) {
			if (err) {
				throw err;
			}
			style.applyToFile('xml/vcard.xml', function (err, page) {
				if (err) {
					throw err;
				}
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(page);
				response.end();
				util.log('Successfully transformed XML to HTML through XSLT.');
			})
		})
	}

	static sendCities(response) {
		readFile('data/cities.json')
		.then(json => {
			response.writeHead(200, { 'Content-Type': 'application/json'});
			response.write(json, 'utf-8');
			response.end();
			util.log('Successfully returned list of cities in JSON.');
		})	
		.catch(err => {console.log(err);})
	}
	
	static tickets(response) {
		readFile('views/tickets.html')
		.then(page => {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(page);
			response.end();
			util.log('Rendered ticket order form.');
		})		
		.catch(err => {console.log(err);})
	}

	static reserveTickets(response, request) {
		if (request.method === 'POST') {
			let body = '';
			request.on('data', function (data) {
				body += data;
				console.log('body: ' + body);
			});
			let post = '';
			request.on('end', function () {
				post = qs.parse(body);
				fs.writeFile('./data/orders', JSON.stringify(post), function (err) {
					if (err) {
						util.log(err);
					}
				})				
				response.writeHead(200, { 'Content-Type': 'application/json'});
				const answer = { name: post.name, surname: post.surname };
				response.write(JSON.stringify(answer), 'utf-8');
				response.end();
				util.log('Order was saved.')
			});			
		} else {
			response.writeHead(404);
			response.end();
		}
	}
}

module.exports = Main;