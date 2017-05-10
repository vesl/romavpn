const e = require('./brs_modules/brs_e.js');

function handleSocket(req,socket,config) {
	this.req = req;
	this.socket = socket;
	this.config = config;
	this.allowedModules = ['template','config','vpn'];
	this.allowedActions = ['load','list','create'];
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
	switch(this.req.module) {
		case 'template':
			this.handleTemplate();
			break;
		case 'config':
			this.handleConfig();
			break;
		case 'vpn':
			this.handleVpn();
			break;
	} 
};


//1 Handle modules

//1.1 Template handle
handleSocket.prototype.handleTemplate = function(){
	switch(this.req.action){
		case 'load':
			this.loadTemplate();
			break;
	}
};

//1.2 Config handle
handleSocket.prototype.handleConfig = function(){
	switch(this.req.action){
		case 'create':
			this.createConfig();
			break;
	}
};

//1.3 VPN handle
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

//2 Modules actions calls

//2.1 Template actions calls
handleSocket.prototype.loadTemplate = function(){
	const template = require('./brs_modules/brs_template.js');
	Template = new template();
	Template.loadHTML(this.req.template).then((html)=>{
		this.req.html = html;
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('template',0,error);
		this.socket.emit('res',this.req);
	});

};

//2.2
handleSocket.prototype.createConfig = function(){
	this.config.save(this.req.config).then((saved)=>{
		this.req.configCreated = true;
		this.req.config = saved;
		this.e.success('config',0);
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('config',0,error);
		this.socket.emit('res',this.req);
	});
};

//2.3 VPN actions calls
handleSocket.prototype.listvpn = function(){
	const Vpn = new vpn();
	Vpn.getAll().then(()=>{
		
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',0,error);
		this.socket.emit('res',this.req);
	});
};

handleSocket.prototype.createvpn = function() {
};

module.exports = handleSocket;