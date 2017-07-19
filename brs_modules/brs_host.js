const mongo = require('./brs_mongo.js');
const exec = require('./brs_exec.js').exec;

function host(){
	this.id = false;
	this.name = false;
	this.ip = false;
	this.parent = false;
}

host.prototype.load = function(query){
	return new Promise((res,rej)=>{
		ret = {};
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('host',query).then((found)=>{
				this.id = found._id;
				this.name = found.name;
				this.parent = found.parent;
				this.ip = found.ip;
				res(this);
			}).catch((error)=>{
				ret.error;
				rej(ret);
			});
		}).catch((error)=>{
			ret.error=error;
			rej(ret);
		});
	});
};

host.prototype.list = function(which){
	return new Promise((res,rej)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findAll('host',which).then((list)=>{
				res(list);
			}).catch((error)=>{rej({cantListHost:error})});
		}).catch((error)=>{rej(error)});
	});
};

host.prototype.check = function(){
	return new Promise((res,rej)=>{
		//parent contains current ip 
		res(true);
	});
};

host.prototype.save = function() {
	return new Promise((res,rej)=>{
		this.check().then(()=>{
			this.book().then((book)=>{
				db = new mongo();
				db.connect().then(()=>{
					db.save('host',{
						name : this.name,
						ip : this.ip,
						parent : this.parent,
					}).then((saved)=>{
						this.dns().then(()=>{
							res(saved);
						}).catch((error)=>{rej(error)});
					}).catch((error)=>{console.log(error);rej({hostNotSaved:error})});
				}).catch((error)=>{rej(error);});
			}).catch((error)=>{rej(error)});
		}).catch((error)=>{rej(error)});
	});
};

host.prototype.book = function(){
	return new Promise((res,rej)=>{
		const subnet = require('./brs_subnet.js');
		var Subnet = new subnet();
		Subnet.load({name:this.parent}).then(()=>{
			Subnet.book(this.name,this.ip).then(()=>{
				res(true);
			}).catch((error)=>{rej({unableToBookIp:error})});				
		}).catch((error)=>{rej({cantLoadSubnet})})
	});
};

host.prototype.dns = function(){
	return new Promise((res,rej)=>{
		const config = require('./brs_config.js');
		Config = new config();
		Config.load().then(()=>{
			const fs = require('fs');
			const exec = require('./brs_exec.js').exec;
			const path = Config.app_path+"/db.hosts";
			fs.appendFile(path,this.name+'	IN	A	'+this.ip+'\n',(error)=>{
				if (error) return rej({cantWriteDnsRecord:error});
				else {
					exec('/etc/init.d/bind9 restart').then(()=>{
						res(true);
					}).catch((error)=>{
						rej({failedToRestartBind:true});
					});
				}
			});		
		}).catch((error)=>rej({configPathNotLoad:error}));
	});
};

module.exports=host;