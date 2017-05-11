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

e.prototype.success = function(module,n){
	var date = new Date();
	var message = this.success[module][n][1];
	var o = {
		type : 'INFO',
		module: module,
		n : n,
		date : date,
	}
	var log = date+' INFO '+module.toUpperCase()+' '+message;
	this.emit(o);
	this.log(log)

};

e.prototype.info = function(module,n,more) {	
	var date = new Date();
	var message = this.more[module][n][1];
	var more = more.toString() || '';
	if (more instanceof Error) more = 'Javascript Error : '+more.message+' File : '+more.fileName+' Line : '+more.lineNumber;
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
];

e.prototype.more.mongo=[
	[0,'Connection to db failed'],
];

e.prototype.more.config=[
    [0,'Could not load html template'],
	[1,'Configuration not created'],
];

e.prototype.more.vpn=[
];



e.prototype.success.config=[
	[0,'Configuration saved'],
];

module.exports = e;