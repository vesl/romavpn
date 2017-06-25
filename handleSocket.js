const e = require('./brs_modules/brs_e.js');

function handleSocket(req,socket,config) {
	this.req = req;
	this.socket = socket;
	this.config = config;
	this.allowedModules = ['config','vpn','vpnAdd','vpnList','ovpn'];
	this.allowedActions = ['load','update','add','list'];
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
		case 'vpnList':
			this.handleVpnList();
			break;
		case 'vpnAdd':
			this.handleVpnAdd();
			break;
		case 'ovpn':
			this.handleOvpn();
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
handleSocket.prototype.handleVpnList = function(){
	switch(this.req.action){
		case 'load':
			this.loadVpnList();
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

handleSocket.prototype.handleVpn = function(){
	switch(this.req.action){
		case 'load':
			this.loadVpn();
			break;
	}
};

//1.3 OVPN handle
handleSocket.prototype.handleOvpn = function(){
	switch(this.req.action){
		case 'load':
			this.loadOvpn();
			break;
		case 'update':
			this.updateOvpn();
			break;
	}	
};

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
handleSocket.prototype.loadVpnList = function(){
	this.loadTemplate('vpnList').then((html)=>{
		this.req.html=html;
		const vpn = require('./brs_modules/brs_vpn.js');
		Vpn = new vpn();
		Vpn.list(this.req.which).then((list)=>{
			this.req.vpns=list;
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
};

handleSocket.prototype.loadVpn = function(){
	const vpn = require('./brs_modules/brs_vpn.js');
	if(this.req.Etarget === false) {
	 //this.loadTemplate('vpn').then((html)=>{
	}
	Vpn = new vpn();
	Vpn._id = this.req.which._id;
	Vpn.load().then((found)=>{
		this.req.loaded = found;
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',4,error);
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

//2.3 OVPN

handleSocket.prototype.loadOvpn = function(){
	this.loadTemplate('ovpn').then((html)=>{
		this.req.html = html;
		const ovpn = require('./brs_modules/brs_ovpn.js');
		Ovpn = new ovpn();
		Ovpn.parent = this.req.parent;
		Ovpn.load().then((found)=>{
			this.req.ovpn = found;
			this.socket.emit('res',this.req);
		}).catch((error)=>rej({ovpnNotFound:error}));
	}).catch((error)=>{
        this.req.error = error;
        this.e.error('ovpn',0,error);
        this.socket.emit('res',this.req);			
	});
};

handleSocket.prototype.updateOvpn = function(){
	 const ovpn = require('./brs_modules/brs_ovpn.js');
	 Ovpn = new ovpn();
	 Ovpn.parent = this.req.parent;
	 if(this.req._id === false) {
	 	Ovpn.save(this.req.config).then((saved)=>{
	 		this.req.ovpn = saved;
	 		this.e.info('ovpn',0);
	 		this.socket.emit('res',saved);
	 	}).catch((error)=>{
	 		this.req.error = error;
	 		this.e.error('ovpn',1,error);
	 		this.socket.emit('res',this.req);
	 	});
	} else {
		Ovpn.load().then(()=>{
			Ovpn.update(this.req.config).then((updated)=>{
				this.req.ovpn = updated;
		 		this.e.info('ovpn',1);
		 		this.socket.emit('res',updated);	
			}).catch((error)=>{
		 		this.req.error = error;
		 		this.e.error('ovpn',2,error);
		 		this.socket.emit('res',this.req);				
			});
		}).catch((error)=>{
			this.req.error = error;
		 	this.e.error('ovpn',2,error);
		 	this.socket.emit('res',this.req);
		});
	}
};

module.exports = handleSocket;
