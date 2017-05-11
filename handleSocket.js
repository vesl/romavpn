const e = require('./brs_modules/brs_e.js');

function handleSocket(req,socket,config) {
	this.req = req;
	this.socket = socket;
	this.config = config;
	this.allowedModules = ['config','vpn'];
	this.allowedActions = ['load','update'];
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

handleSocket.prototype.loadTemplate = function(name){
    return new Promise((res,rej)=>{
        const template = require('./brs_modules/brs_template.js');
        Template = new template();
        Template.loadHTML(name).then((html)=>{
            res(html);
        }).catch((error)=>{rej(error);});
    });
};

handleSocket.prototype.process = function(){
	if(this.check() == false) return false;
	switch(this.req.module) {
		case 'config':
			this.handleConfig();
			break;
		case 'vpn':
			this.handleVpn();
			break;
	} 
};


//1 Handle modules


//1.1 Config handle
handleSocket.prototype.handleConfig = function(){
	switch(this.req.action){
        case 'load':
            this.loadConfig();
		case 'update':
			this.updateConfig();
			break;
	}
};

//1.2 VPN handle
handleSocket.prototype.handleVpn = function(){
	switch(this.req.action){
		case 'load':
			this.loadVpn(res.which);
		break;
	}
};

//2 Modules actions calls

//2.1 Config
handleSocket.prototype.loadConfig = function(){
    this.loadTemplate('config').then((html)=>{
        this.req.config = this.config;
        this.req.html = html;
        this.socket.emit('req',this.req);
    }).catch((error)=>{
        this.req.error = error;
        this.e.error('config',0,error);
        this.socket.emit('res',this.req);
    });
};

handleSocket.prototype.updateConfig = function(){
    if(!this.req.config._id) {
        this.config.save(this.req.config).then((saved)=>{
            this.req.configCreated = true;
            this.req.config = saved;
            this.e.success('config',0);
            this.socket.emit('res',this.req);
        }).catch((error)=>{
            this.req.error = error;
            this.e.error('config',1,error);
            this.socket.emit('res',this.req);
        });
    } else {
        //Edit existing
    }
};

//2.2 VPN 
handleSocket.prototype.loadVpn = function(which){
	const vpn = require('./brs_modules/brs_vpn.js');
	Vpn = new vpn();
	Vpn.get(which).then((all)=>{
		this.req.vpns=all;
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',0,error);
		this.socket.emit('res',this.req);
	});
};

handleSocket.prototype.createvpn = function() {
};

module.exports = handleSocket;