//STATIC

const app=require('express')();
const server=require('http').Server(app);
const fs=require('fs');
const config=require('./config.js').app;
const handleSocket=require('./handleSocket.js');

server.listen(config.port, config.address);

app.get('/',function(req,res){
	fs.readFile(config.home, (err,data) => {
		if (err) res.status(404).send('');
		else if(data){
			res.setHeader('Content-Type','text/html');
			res.status(200).send(data);
		}
	});
});

app.get(/^\/js\/.*.js$/,function(req,res){
	fs.readFile('static'+req.url, (err,data) => {
		if(err) res.status(404).send('');
		else if(data) res.status(200).send(data);
	});
});

app.get(/^\/css\/.*.css$/,function(req,res){
	fs.readFile('static'+req.url, (err,data) => {
		if(err) res.status(404).send('');
		else if(data){
			res.setHeader('Content-Type', 'text/css');
			res.status(200).send(data);
		}
	});
});


//SOCKET

const io=require('socket.io')(server);

io.on('connection',function(socket) {
	socket.on('request',function(req){
		const handle = new handleSocket(req,socket);
		handle.process();
	});
});

io.listen(config.port_io);
