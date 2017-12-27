
//STATIC

const app=require('express')();
const server=require('http').Server(app);
const fs=require('fs');
const handleSocket=require('./handleSocket.js');

server.listen(80);

app.get('/',function(req,res){
	fs.readFile('./static/html/index.html', (err,data) => {
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

app.get(/^\/img\/.*/,function(req,res){
	fs.readFile('static'+req.url, (err,data) => {
		if(err) res.status(404).send('');
		else if(data) res.status(200).send(data);
	});
});

//SOCKET

const io=require('socket.io')(server);

io.on('connection',function(socket) {
	const config=require('./brs_modules/brs_config.js');
	Config = new config();
	Config.load(socket).then((ok)=>{
		socket.emit('appReady',true);
	}).catch((notready)=>{
		socket.emit('appReady',false);
	});
	socket.on('req',function(req){
		console.log(req);
		const HandleSocket = new handleSocket(req,socket,Config);
		HandleSocket.process();
	});
});

io.listen(3000);
