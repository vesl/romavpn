const mongo = require('./brs_mongo.js');
const subnet = require('./brs_subnet.js');
const exec = require('./brs_exec.js').exec;


function lxc(){
	this.parent = '';
	this.ip = '';
	this.netmask = '';
	this.gateway = '';
	this.dns = '';
    this.share = '';
    this.state = 0;
    this.statePrintable = false;
}

lxc.prototype.add = function(){
	return new Promise((res,rej)=>{
		ret = {};
		Subnet = new subnet();
		Subnet.load({name:'default_lxc_subnet'}).then(()=>{
			Subnet.book(this.parent).then((ip)=>{
				this.ip = ip;
				this.netmask = Subnet.netmask;
				db = new mongo();
                db.connect().then(()=>{
                    db.save('lxc',{
                    	parent : this.parent,
                    	state : this.state,
                    }).then((saved)=>{
                        this.id = saved._id;
                        this.create().then(()=>{
            				res(this);
                        }).catch((error)=>{rej({lxcNotCreated:error});});
                    }).catch((error)=>{rej({lxcNotSaved:error});});
                }).catch((error)=>{rej({dbc:error});});
			}).catch((error)=>{rej({ipNotBooked:error});});
		}).catch((error)=>{rej({subnetNotLoaded:error});});
	});
};

lxc.prototype.load = function(){
	return new Promise((res,rej)=>{
		this.loadConfig().then(()=>{
			db = new mongo();
			db.connect().then(()=>{
				db.findOne('lxc',{parent:this.parent}).then((found)=>{
					this.parent = found.parent;
					this.state = found.state;
					this.statePrintable = found.statePrintable;
					this.loadIp().then((ip)=>{
						this.ip = ip.addr;
						this.subnet = ip.subnet;
						res(this);
					}).catch((error)=>{rej({ipNotFound:error});});
				}).catch((error)=>{rej({lxcNotFound:error});});
			}).catch((error)=>{rej({dbc:error});});
		}).catch((error)=>{rej({configNotLoaded:error});});
	});
};

lxc.prototype.loadConfig = function(){
	return new Promise((res,rej)=>{
		const config = require('./brs_config.js');
			ret = {};
			Config = new config();
			Config.load().then(()=>{
				this.netmask = Config.vpn_netmask;
				this.gateway = Config.vpn_gateway;
				this.dns = Config.vpn_dns;
				this.share = Config.app_path+'/lxc_share';
				res();
			}).catch((error)=>{rej({configNotLoaded:error})});
	});
};

lxc.prototype.loadIp = function(){
	return new Promise((res,rej)=>{
		ret = {};
		Subnet = new subnet();
		Subnet.load({name:'default_lxc_subnet'}).then((found)=>{
			if(found.booked.hasOwnProperty(this.parent)===false) rej({ipNotFound:true});
			else {
				return res({
					addr:found.booked[this.parent],
					subnet:found.netmask
				});
			}
		}).catch((error)=>{rej({subnetNotLoad : error})});
	});
};

lxc.prototype.create = function(){
	return new Promise((res,rej)=>{
		this.loadConfig().then(()=>{
			command='/usr/bin/lxc-create -n '+this.parent+' -t romavpn -- --ip '+this.ip+' --netmask '+this.netmask+' --gateway '+this.gateway+' --dns '+this.dns+' --share '+this.share;
			console.log(command);
			exec(command).then((stdout)=>{
				res(stdout);
			}).catch((error)=>{rej({lxcNotCreated:error});});
		}).catch((error)=>{rej({configNotLoaded:error});});
	});
};

module.exports = lxc;