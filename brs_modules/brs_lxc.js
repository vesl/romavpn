const mongo = require('./brs_mongo.js');
const subnet = require('./brs_subnet.js');
const exec = require('./brs_exec.js');


function lxc(){
	this.parent = '';
	this.ip = '';
	this.netmask = '';
	this.gateway = '';
	this.dns = '';
    this.share = '';
    this.state = 0;
}

lxc.prototype.add = function(){
	return new Promise((res,rej)=>{
		ret = {};
		Subnet = new subnet();
		Subnet.load({name:'default_lxc_subnet'}).then(()=>{
			Subnet.book(this.parent).then((ip)=>{
				this.ip = ip;
				db = new mongo();
                db.connect().then(()=>{
                    db.save('lxc',{
                    	parent : this.parent,
                    	state : this.state
                    }).then((saved)=>{
                        this.id = saved._id;
                        ret.lxc = this;
                        res(ret);
                    }).catch((error)=>{
                        ret.error = error;
                        rej(ret);
                    });
                }).catch((error)=>{rej(error);});
			}).catch((error)=>{
				ret.ipNotBooked = true;
				ret.error = error;
				rej(ret);
			});
		}).catch((error)=>{
			ret.subnetNotLoad = true;
			ret.error = error;
			rej(ret);
		});
	});
};

lxc.prototype.load = function(){
	return new Promise((res,rej)=>{
		ret = {};
		this.loadConfig().then(()=>{
			db = new mongo();
			db.connect().then(()=>{
				db.findOne('lxc',{_id:this.id}).then((found)=>{
					this.ip = found.ip;
					this.parent = found.parent;
					this.loadIp().then(()=>{
						res(this);
					}).catch((error)=>{
						ret.ipNotFound = true;
						ret.error = error;
						rej(ret);
					});
				}).catch((error)=>{
					ret.lxcNotLoaded = true;
					ret.error = error;
					rej(ret);
				});
			}).catch((error)=>{rej(error);});
		}).catch((error)=>{rej(error);});
	});
};

lxc.prototype.loadConfig = function(){
	const config = require('./brs_config.js');
	ret = {};
	Config = new config();
	Config.load().then(()=>{
		this.netmask = Config.vpn_netmask;
		this.gateway = Config.vpn_gateway;
		this.dns = Config.vpn_dns;
		this.share = Config.app_path+'/lxc_share';
	}).catch((error)=>{
		rej(error);		
	});
};

lxc.prototype.loadIp = function(){
	return new Promise((res,rej)=>{
		ret = {};
		Subnet = new subnet();
		Subnet.load({name:'default_lxc_subnet'}).then(()=>{
			for(var parent in Subnet.booked){
				if(parent === this.parent) return res(Subnet.booked[parent]);
			}
			ret.ipNotFound = true;
			ret.error = Subnet.booked;
			rej(ret);
		}).catch((error)=>{
			ret.subnetNotLoad = true;
			ret.error = error;
			rej(ret);	
		});
	});
};

lxc.prototype.create = function(){
};

module.exports = lxc;