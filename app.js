const app=require('express')();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const fs=require('fs');

const config=require('./config.js').app;
const log=require('./brs_modules/brs_log.js');
const vpnClient=require('./brs_modules/brs_vpnClient.js');

server.listen(config.port, config.address);

app.get('/',function(req,res){
	fs.readFile(config.home, (err,data) => {
		if (err) {
			log.err('app',0,err);
			res.status(404);
		}
		res.setHeader('Content-Type','text/html');
		res.status(200).send(data);
	});
});

app.get(/^\/js\/.*.js$/,function(req,res){
	fs.readFile('static'+req.url, (err,data) => {
		if(err) {
			log.err('app',1,err);
			res.status(404);
		}
		else res.status(200).send(data);
	});
});

io.on('connection',function() {
});

io.listen(config.port_io);



