const e = require('./brs_modules/brs_e.js');

function handleSocket(req,socket,config) {
	this.req = req;
	this.socket = socket;
	this.config = config;
	this.allowedModules = ['config','vpn','vpnAdd'];
	this.allowedActions = ['load','update','add'];
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
	if(this.check() === false) return false;
	switch(this.req.module) {
		case 'config':
			this.handleConfig();
			break;
		case 'vpn':
			this.handleVpn();
			break;
		case 'vpnAdd':
			this.handleVpnAdd();
			break;
	} 
};


//1 Handle modules


//1.1 Config handle
handleSocket.prototype.handleConfig = function(){
	switch(this.req.action){
        case 'load':
            this.loadConfig();
            break;
		case 'update':
			this.updateConfig();
			break;
	}
};

//1.2 VPN handle
handleSocket.prototype.handleVpn = function(){
	switch(this.req.action){
		case 'load':
			this.loadVpn();
			break;
	}
};

handleSocket.prototype.handleVpnAdd = function(){
	switch(this.req.action){
		case 'load':
			this.loadVpnAdd();
			break;
		case 'add':
			this.addVpnAdd();
			break;
	}
}

//2 Modules actions calls

//2.1 Config
handleSocket.prototype.loadConfig = function(){
    this.loadTemplate('config').then((html)=>{
        this.req.config = this.config;
        this.req.html = html;
        this.socket.emit('res',this.req);
    }).catch((error)=>{
        this.req.error = error;
        this.e.error('config',0,error);
        this.socket.emit('res',this.req);
    });
};

handleSocket.prototype.updateConfig = function(){
    if(!this.req.config._id) {
        this.config.save(this.req.config).then((saved)=>{
            this.req.success = true;
            this.req.config = saved;
            this.e.info('config',0);
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
handleSocket.prototype.loadVpn = function(){
	this.loadTemplate('vpn').then((html)=>{
		this.req.html=html;
		const vpn = require('./brs_modules/brs_vpn.js');
		Vpn = new vpn();
		Vpn.load(this.req.which).then((all)=>{
			this.req.vpns=all;
			this.socket.emit('res',this.req);
		}).catch((error)=>{
			this.req.error = error;
			this.e.error('vpn',1,error);
			this.socket.emit('res',this.req);
		});
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',0,error);
		this.socket.emit('res',this.req);
	});
};

handleSocket.prototype.loadVpnAdd = function(){
	this.loadTemplate('vpnAdd').then((html)=>{
		this.req.html=html;
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',2,error);
		this.socket.emit('res',this.req);
	});
}

handleSocket.prototype.addVpnAdd= function() {
	const vpn = require('./brs_modules/brs_vpn.js');
	Vpn = new vpn();
	Vpn.name = this.req.vpn_name;
	Vpn.add().then((saved)=>{
		this.req.success = true;
		this.req.vpn = saved;
		this.e.info('vpn',0);
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',3,error);
		this.socket.emit('res',this.req);
	});
};

module.exports = handleSocket;
