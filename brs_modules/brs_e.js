const config = require('../config.js').log;
const fs = require('fs');

function e(socket) {
	this.socket = socket;
	this.file = config.file;
}

e.prototype.log = function(log){
	fs.appendFile(this.file,log+'\n',function(err){
		if(err) console.log("I can't write to "+this.file);
	});
};

e.prototype.emit = function(o){
	this.socket.emit('e',o);
};

e.prototype.error = function(module,n,more) {	
	var more = more || '';
	var date = new Date();
	var message = this.more[module][n][1];
	var o = {
		type : 'ERROR',
		module : module,
		n : n,
		date : date,
		message : message,
		more : more,
	}
	var log = date+' ERROR '+module.toUpperCase()+' '+message+' '+more;
	this.emit(o);
	this.log(log)
};

e.prototype.info = function(module,n,more) {	
	var more = more || '';
	var date = new Date();
	var message = this.more[module][n][1];
	var o = {
		type : 'INFO',
		module : module,
		n : n,
		date : date,
		message : message,
		more : more,
	}
	var log = date+' INFO '+module.toUpperCase()+' '+message+' '+more;
	this.emit(o);
	this.log(log)
};

e.prototype.more = {};
e.prototype.more.handleSocket=[
	[0,'No module defined on socket request'],
	[1,'Module not allowed on socket request'],
	[2,'Action not allowed on socket request'],
	[3,'Cant list all vpns'],
];

e.prototype.more.brs_mongo=[
	[0,'Connection to db failed'],
];

module.exports = e;