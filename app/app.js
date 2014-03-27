#!/usr/bin/env node
var fs = require('fs');
var dns = require('native-dns');
var utils = require('./utils');
var config = require('./config');


var filelog = fs.createWriteStream(config.logfile, {'flags': 'a', encoding: null});
var log = function (txt) {
	filelog.write(txt + '\n');
	console.log(txt);
}

var server = dns.createServer();

server.on('request', function (req, res) {
	var host = req.question[0].name;

	// log request
	log('['+req.address.address+'] needs ' + host);

	// kennen we die host?
	if(config.DNSentries[host] ) {
		return interceptRequest(host, req, res);
	}else{
		return forwardRequest(host, req, res);
	}
});

function interceptRequest (host, req, res) {
	var address = config.DNSentries[host];

	log('Giving '+req.address.address+' local DNS entry: ' + host + ' -> ' + address);

	res.answer.push(dns.A({
		name: host,
		address: address,
		ttl: 600,
	}));

	res.send();
}

function forwardRequest (host, req, res) {
	var question = dns.Question({
		name: host,
		type: dns.consts.NAME_TO_QTYPE.A
	});

	var fowardReq = dns.Request({
		question: question,
		server: { address: config.forwardaddress, port: 53, type: 'udp' },
		timeout: 1000,
	});

	fowardReq.on('message', function (err, answer) {
		answer.answer.forEach(function (forwardRes) {
			if( forwardRes.type == 1 ) {
				res.answer.push(dns.A({
					name: host,
					address: forwardRes.address,
					ttl: 1000,
				}));
			}
		});

		res.send();
	});

	fowardReq.send();
}

server.on('error', function (err, buff, req, res) {
	console.log( err.stack );
});

server.on('listening', function () {
	console.log('> running local DNS-forwarder on ' + this.address().address + '  . Make sure this IP is right!');
});

server.on('socketError', function (err, socket) {
	console.log(err);
});

server.on('close', function () {
	console.log('server closed ', this.address().address);
});


var ip = '127.0.0.1';
if(config.localip && config.localip != ''){
	ip = config.localip;
}else{
	var localips = utils.getLocalIps();
	if(localips.length > 0)
		ip = localips[0];
}
server.serve(53, ip);









