const mongo = require('./brs_mongo.js');

function ovpn(){
	this._id = false;
	this.parent = false;
	this.remote = '';
	this.port = '';
	this.proto = '';
	this.dev = '';
	this.ping = '';
	this.verb = '';
	this.mute = '';
	this.cacert = '';
	this.cert = '';
	this.key = '';
	this.pull = '';
	this.tls = '';
	this.comp = '';
}

ovpn.prototype.load = function(){
	return new Promise((res,rej)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('ovpn',{parent:this.parent}).then((found)=>{
				this._id = found._id;
				this.remote = found.remote;
				this.port = found.port;
				this.proto = found.proto;
				this.dev = found.dev;
				this.ping = found.ping;
				this.verb = found.verb;
				this.mute = found.mute;
				this.cacert = found.cacert;
				this.cert = found.cert;
				this.key = found.key;
				this.pull = found.pull;
				this.tls = found.tls;
				this.comp = found.comp;
				res(this);
			}).catch((error)=>{res(this)});
		}).catch((error)=>{rej(error);});
	});
};

ovpn.prototype.check = function(){
	ret = {};
	if(this.remote === '')	ret.remote = true;
	if(this.port === '') ret.port = true;
	if(this.proto === '') ret.proto = true;
	if(this.dev === '') ret.dev = true;
	if(this.ping === '') ret.ping = true;
	if(this.verb === '') ret.verb = true;
	if(this.mute === '') ret.mute = true;
	if(this.cacert === '') ret.cacert = true;
	if(this.cert === '') ret.cert = true;
	if(this.key === '') ret.key = true;
	if(Object.keys(ret).length === 0) return true;
	else return ret;
};

ovpn.prototype.save = function(config){
	return new Promise((res,rej)=>{
		
		this.remote = config.remote;
		this.port = config.remote;
		this.proto = config.proto;
		this.dev = config.dev;
		this.ping = config.ping;
		this.verb = config.verb;
		this.mute = config.mute;
		this.cacert = config.cacert;
		this.cert = config.cert;
		this.key = config.key;
		this.pull = config.pull;
		this.tls = config.tls;
		this.comp = config.comp;
		
		check = this.check();
		if(check !== true) rej(check);
		else {
			db = new mongo();
			db.connect().then(()=>{
				db.save('ovpn',{
					parent: this.parent,
					remote: this.remote,
					port: this.port,
					proto:this.proto,
					dev: this.dev,
					ping: this.ping,
					verb: this.verb,
					mute: this.mute,
					cacert: this.cacert,
					cert: this.cert,
					key: this.key,
					pull: this.pull,
					tls: this.tls,
					comp: this.comp
				}).then((saved)=>{
					res(saved);
				}).catch((error)=>{
					rej({ovpnNotSaved:error})
				});
			}).catch((error)=>{rej(error);});
		}
	});
};

ovpn.prototype.update = function(config){
	return new Promise((res,rej)=>{
		query = {};
		for(var key in config) {
			if(this.hasOwnProperty(key) && config[key] != this[key]) {
				query[key] = this[key] = config[key];
			}
		}
		db = new mongo();
		db.connect().then(()=>{
			db.update('ovpn',query).then((updated)=>{
				this.exportConfiguration().then(()=>{
					res(updated);
				}).catch((error)=>rej({confNotExport:error}));
			}).catch((error)=>{rej({ovpnNotUpdated:error});});
		}).catch((error)=>{rej(error);});
	});	
};

ovpn.prototype.exportConfiguration = function(){
	return new Promise((res,rej)=>{
		const config = require('./brs_config.js');
		Config = new config();
		Config.load().then(()=>{
			const fs = require('fs');
			const path = Config.app_path+"romavpn/lxc_share/";
			var content = "remote "+this.remote+"\nport "+this.port+"\nproto "+this.proto+"\ndev "+this.dev+"\nping "+this.ping+"\nverb "+this.verb+"\nmute "+this.mute+"\ncacert "+this.parent+"CA.crt\ncert "+this.parent+".crt\nkey "+this.parent+".key";
			if(this.pull === true) content += "\npull";
			if(this.tls === true) content += "\ntls-client";
			if(this.comp === true ) content += "\ncomp-lzo";
			fs.writeFile(path+this.parent+".ovpn",content,(error)=>{
				if (error) return rej({cantWriteConf:error});
			});
			fs.writeFile(path+this.parent+"CA.crt",this.cacert,(error)=>{
				if (error) return rej({cantWriteCacert:error});	
			});
			fs.writeFile(path+this.parent+".crt",this.cert,(error)=>{
				if (error) return rej({cantWriteCert:error});	
			});
			fs.writeFile(path+this.parent+".key",this.key,(error)=>{
				if (error) return rej({cantWriteKey:error});	
			});
			res(Config);
		}).catch((error)=>rej({configPathNotLoad:error}));
	});
};

module.exports = ovpn;