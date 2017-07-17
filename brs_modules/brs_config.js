const mongo = require('./brs_mongo.js');
const subnet = require('./brs_subnet.js');

function config () {
	this._id = false;
	this.app_path = '';
	this.vpn_subnet = '';
	this.vpn_gateway = '';
	this.vpn_dns = '';
}

config.prototype.load = function(){
	return new Promise((res,rej)=>{
		ret = {};
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('config',{}).then((config)=>{
				this._id = config._id;
				this.app_path = config.app_path;
				this.vpn_subnet = config.vpn_subnet;
				this.vpn_gateway = config.vpn_gateway;
				this.vpn_dns = config.vpn_dns;
				Subnet = new subnet();
				Subnet.load({_id:this.vpn_subnet}).then((found)=>{
					this.vpn_network = Subnet.network;
					this.vpn_netmask = Subnet.netmask;
					res(this);
				}).catch((error)=>{
					ret.subnetNotFound = true;
					ret.error = error;
					rej(ret);
				});
			}).catch((error)=>{
				ret.AppNotReady = true;
				ret.error = error;
				rej(ret);
			});
		}).catch((error)=>{rej(error);});
	});
};

config.prototype.check = function(){
	ret = {};
	const fs = require('fs');
	if(!fs.existsSync(this.app_path)) ret.appPath=true;
	if(this.vpn_network === '') ret.vpnNetwork=true;
	if(this.vpn_netmask === '') ret.vpnNetmask=true;
	if(this.vpn_gateway === '') ret.vpnGateway=true;
	if(this.vpn_dns === '') ret.vpnDns=true;
	if(Object.keys(ret).length === 0) return true;
	else return ret;
};

config.prototype.save = function(config){
	return new Promise((res,rej)=>{
		ret = {};

		this.app_path = config.app_path;
		this.vpn_network = config.vpn_network;
		this.vpn_netmask = config.vpn_netmask;
		this.vpn_gateway = config.vpn_gateway;
		this.vpn_dns = config.vpn_dns;
		
		check = this.check();
		if(check !== true) rej(check);
		else {
			const subnet = require('./brs_subnet.js');
			Subnet = new subnet();
			Subnet.name = 'default_lxc_subnet';
			Subnet.parent = Subnet.name;
			Subnet.network = this.vpn_network;
			Subnet.netmask = this.vpn_netmask;
			Subnet.save().then((saved)=>{
				this.vpn_subnet = saved._id;
				db = new mongo();
				db.connect().then(()=>{
					db.save('config',{
						app_path : this.app_path,
						vpn_subnet : this.vpn_subnet,
						vpn_gateway : this.vpn_gateway,
						vpn_dns : this.vpn_dns,
					}).then((saved)=>{
						res(saved);
					}).catch((error)=>{
						ret.configNotSaved = true;
						ret.error = error;
						rej(ret);
					});
				}).catch((error)=>{rej(error);});
			}).catch((error)=>{rej(error);});
		}
	});
};

config.prototype.update = function(config){
	return new Promise((res,rej)=>{
		query = {};
		for(var key in config) {
			if(this.hasOwnProperty(key) && config[key] != this[key]) {
				query[key] = this[key] = config[key];
			}
		}
		db = new mongo();
		db.connect().then(()=>{
			db.update('config',query,{}).then((updated)=>{
				res(updated);
			}).catch((error)=>{rej({configNotUpdated:error})});
		}).catch((error)=>{rej(error)});
	});
}

module.exports=config;
