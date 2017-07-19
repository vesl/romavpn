const e = require('./brs_modules/brs_e.js');

function handleSocket(req,socket,config) {
	this.req = req;
	this.socket = socket;
	this.config = config;
	this.allowedModules = ['config','vpn','vpnAdd','vpnList','ovpn','vpnControl','subnetList','subnetAdd','hostList','hostAdd'];
	this.allowedActions = ['load','update','add','list','start','stop','restart'];
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
		case 'vpnControl':
			this.handleVpnControl();
			break;
		case 'subnetList':
			this.handleSubnetList();
			break;
		case 'subnetAdd':
			this.handleSubnetAdd();
			break;
		case 'hostList':
			this.handleHostList();
			break;
		case 'hostAdd':
			this.handleHostAdd();
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

handleSocket.prototype.handleVpnControl = function(){
	switch(this.req.action){
		case 'start':
			this.startVpn();
			break;
		case 'stop':
			this.stopVpn();
			break;
		case 'restart':
			this.restartVpn();
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

//1.4 Subnet handle
handleSocket.prototype.handleSubnetList = function(){
	switch(this.req.action){
		case 'load':
			this.loadSubnetList();
			break;
	}	
};
handleSocket.prototype.handleSubnetAdd = function(){
	switch(this.req.action){
		case 'load':
			this.loadSubnetAdd();
			break;
		case 'add':
			this.addSubnetAdd();
			break;
	}	
};

//1.5 Host handle
handleSocket.prototype.handleHostList = function(){
	switch(this.req.action){
		case 'load':
			this.loadHostList();
			break;
	}	
};

handleSocket.prototype.handleHostAdd = function(){
	switch(this.req.action){
		case 'load':
			this.loadHostAdd();
			break;
		case 'add':
			this.addHostAdd();
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
    if(this.req._id === false) {
        this.config.save(this.req.config).then((saved)=>{
            this.req.config = saved;
            this.e.info('config',0);
            this.socket.emit('res',this.req);
        }).catch((error)=>{
			this.req.error = error;
			this.e.error('config',1,error);
			this.socket.emit('res',this.req);
        });
    } else {
		this.config.update(this.req.config).then((updated)=>{
			this.req.config = updated;
			this.e.info('config',1);
			this.socket.emit('res',this.req);
		}).catch((error)=>{
			this.req.error = error;
			this.e.error('config',2);
			this.socket.emit('res',this.req)
		});
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
		console.log(error);
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
	Vpn.save().then((saved)=>{
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

handleSocket.prototype.startVpn=function(){
	const vpn = require('./brs_modules/brs_vpn.js');
	Vpn = new vpn();
	Vpn._id = this.req.which._id;
	Vpn.load().then((found)=>{
		if(found.lxc.state == 1) {
			found.lxc.start().then(()=>{
				this.req.loaded = found;
				this.socket.emit('res',this.req);
				this.e.info('vpn',1);
			}).catch((error)=>{
				this.req.error = error;
				this.e.error('vpn',5,error);
				this.socket.emit('res',this.req);
			});
		}
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',4,error);
		this.socket.emit('res',this.req);
	});
};

handleSocket.prototype.stopVpn=function(){
	const vpn = require('./brs_modules/brs_vpn.js');
	Vpn = new vpn();
	Vpn._id = this.req.which._id;
	Vpn.load().then((found)=>{
		if(found.lxc.state > 1) {
			found.lxc.stop().then(()=>{
				this.req.loaded = found;
				this.socket.emit('res',this.req);
				this.e.info('vpn',2);
			}).catch((error)=>{
				this.req.error = error;
				this.e.error('vpn',6,error);
				this.socket.emit('res',this.req);
			});
		}
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',4,error);
		this.socket.emit('res',this.req);
	});	
};

handleSocket.prototype.restartVpn=function(){
	const vpn = require('./brs_modules/brs_vpn.js');
	Vpn = new vpn();
	Vpn._id = this.req.which._id;
	Vpn.load().then((found)=>{
		if(found.lxc.state > 1) {
			found.lxc.restart().then(()=>{
				this.req.loaded = found;
				this.socket.emit('res',this.req);
				this.e.info('vpn',3);
			}).catch((error)=>{
				this.req.error = error;
				this.e.error('vpn',7,error);
				this.socket.emit('res',this.req);
			});
		}
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('vpn',4,error);
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
	 Ovpn.load().then((found)=>{
	 	if(found._id !== false) {
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
	 	} else {
		 	Ovpn.save(this.req.config).then((saved)=>{
		 		this.req.ovpn = saved;
		 		this.e.info('ovpn',0);
		 		this.socket.emit('res',saved);
		 	}).catch((error)=>{
		 		this.req.error = error;
		 		this.e.error('ovpn',1,error);
		 		this.socket.emit('res',this.req);
			});
	 	}
	}).catch((error)=>{ovpnConfNotSaved:error});
};

//2.4 subnet
handleSocket.prototype.loadSubnetList = function(){
	this.loadTemplate('subnetList').then((html)=>{
		this.req.html = html;	
		const subnet = require('./brs_modules/brs_subnet.js');
		var Subnet = new subnet();
		Subnet.list({parent:this.req.parent}).then((list)=>{
			this.req.subnets = list;
			this.socket.emit('res',this.req);
		}).catch((error)=>{
			this.req.error = error;
			this.e.error('subnet',0,error);
			this.socket.emit('res',this.req);
		});
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('subnet',1,error);
		this.socket.emit('res',this.req);
	});
};

handleSocket.prototype.loadSubnetAdd = function(){
	this.loadTemplate('subnetAdd').then((html)=>{
		this.req.html = html;
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('subnet',2,error);
		this.socket.emit('res',this.req);
	});
};

handleSocket.prototype.addSubnetAdd= function() {
	const subnet = require('./brs_modules/brs_subnet.js');
	Subnet = new subnet();
	Subnet.parent = this.req.parent;
	Subnet.name = this.req.subnet_name;
	Subnet.network = this.req.subnet_network;
	Subnet.netmask = this.req.subnet_netmask;
	Subnet.netmap = this.req.subnet_netmap;
	Subnet.save().then((saved)=>{
		this.req.success = true;
		this.req.subnet = saved;
		this.e.info('subnet',0);
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('subnet',3,error);
		this.socket.emit('res',this.req);
	});
};


//2.5 host

handleSocket.prototype.loadHostList = function(){
	this.loadTemplate('hostList').then((html)=>{
		this.req.html = html;	
		const host = require('./brs_modules/brs_host.js');
		var Host = new host();
		Host.list({parent:this.req.parent}).then((list)=>{
			this.req.hosts = list;
			this.socket.emit('res',this.req);
		}).catch((error)=>{
			this.req.error = error;
			this.e.error('host',0,error);
			this.socket.emit('res',this.req);
		});
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('host',1,error);
		this.socket.emit('res',this.req);
	});
};

handleSocket.prototype.loadHostAdd = function(){
	this.loadTemplate('hostAdd').then((html)=>{
		this.req.html = html;
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('host',2,error);
		this.socket.emit('res',this.req);
	});
};

handleSocket.prototype.addHostAdd = function(){
	const host = require('./brs_modules/brs_host');
	var Host = new host();
	Host.parent = this.req.parent;
	Host.ip = this.req.host_ip;
	Host.name = this.req.host_name;
	Host.save().then((saved)=>{
		this.req.success = true;
		this.req.host = saved;
		this.e.info('host',0);
		this.socket.emit('res',this.req);
	}).catch((error)=>{
		this.req.error = error;
		this.e.error('host',3,error);
		this.socket.emit('res',this.req);
	});	
};

module.exports = handleSocket;
