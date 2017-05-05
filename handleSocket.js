const e = require('./brs_modules/brs_e.js');

function handleSocket(req,socket) {
	this.req = req;
	this.socket = socket;
	this.allowedModules = ['vpn'];
	this.allowedActions = ['list','create'];
	this.e = new e(socket);
}

handleSocket.prototype.check = function(){
	if(!this.req.module) {
		this.e.error('handleSocket',0);
		return false;
	}
	if(this.allowedModules.indexOf(this.req.module) == -1) {
		this.e.error('handleSocket',1,this.req.module);
		return false;
	}
	if(this.allowedActions.indexOf(this.req.action) == -1) {
		this.e.error('handleSocket',2,this.req.action);
		return false;
	}
	return true;
};

handleSocket.prototype.process = function(){
	if(this.check() == false) return false;
	if(this.req.module == 'vpn') this.handleVpn();
};

handleSocket.prototype.handleVpn = function(){
	switch(this.req.action){
		case 'list':
			this.listvpn();
		break;
		case 'create':
			this.createvpn();
		break;
	}
};

handleSocket.prototype.listvpn = function(){
	this.req.vpns=[];
	this.socket.emit('response',this.req);
}

handleSocket.prototype.createvpn = function() {
	
	this.socket.emit('response',);
}

module.exports = handleSocket;