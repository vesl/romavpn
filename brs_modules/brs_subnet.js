const ip = require('ip');
const log = require('./brs_log.js');
const mongo = require('./brs_mongo.js');

function subnet(args) {
	return new Promise((resolve,reject)=>{
		this.name = args.name;
		this.network = args.network || false;
		this.netmask = args.netmask || false;
		this.gateway = args.gateway || false;
		this.dns = args.gateway || false;
		this.booked = args.booked || [];
		this.load({name:args.name}).then((loaded)=>{
			resolve(loaded);	
		}).catch((notfound)=>{
			try { 
				this.subnet = ip.subnet(this.network,this.netmask);
			} catch(e) {
				this.subnet = false;
			}
			reject(this);
		});
	});
}

subnet.prototype.save = function() {
	return new Promise((resolve,reject) => {
		if(this.id) {
			log.err('brs_subnet',6,this.id);
			reject(this.id);
		} else {
			db = new mongo();
			db.connect().then(()=>{
				db.save('subnet',{name:this.name,network:this.network,netmask:this.netmask,gateway:this.gateway,dns:this.dns,booked:this.booked}).then((doc)=>{
					this.id=doc._id;
					resolve(doc);
				}).catch((error)=>{
					log.err('brs_subnet',1,error);
					reject(error.name);
				});
			}).catch((error)=>{reject(error);});
		}
	});
};

subnet.prototype.load = function() {
	return new Promise((resolve,reject) => {
		db = new mongo();
		db.connect().then(() => {
			db.findOne('subnet',{name:this.name}).then((doc)=>{
				this.id=doc._id;
				this.name=doc.name;
				this.network=doc.network;
				this.netmask=doc.netmask;
				this.subnet=ip.subnet(this.network,this.netmask);
				this.booked=doc.booked;
				resolve(this);
			}).catch((error)=>{
				log.err('brs_subnet',2,this.name);
				reject(error.name);
			});
		}).catch((error)=>{reject(error);});
	});
};

subnet.prototype.free = function (ipfree) {
	var ipfree = ipfree || false;
	if(!ipfree){
		current = ip.toLong(this.network)+1;
		while(this.subnet.contains(ip.fromLong(current))){
			if (this.booked.indexOf(ip.fromLong(current)) == -1 && ip.fromLong(current) != this.gateway && ip.fromLong(current) != this.dns) return ip.fromLong(current);
			current++;
		}
		return false;
	} else {
		if(this.booked.indexOf(ipfree) != -1) {
			log.err('brs_subnet',7,ipfree);
			return false;
		} else { return true; }
	}
};

subnet.prototype.book = function (ipbook) {
	return new Promise((resolve,reject)=>{
		if(!this.free(ipbook)) reject(false);
		else {
			try {
				this.subnet.contains(ipbook);
				this.booked.push(ipbook);
				db = new mongo();
				db.connect().then(()=>{
					db.update('subnet',{booked:this.booked},{_id:this.id}).then((doc)=>{
						resolve(doc);
					}).catch((error)=>{
						log.err('brs_subnet',4,error);
						reject(error);
					});
				}).catch((error)=>{reject(error);});
			} catch(error) {
				log.err('brs_subnet',3,error);
				reject(error);
			}
		}
	});
};

subnet.prototype.unbook = function(ipunbook) {
	return new Promise((resolve,reject)=>{
		index = this.booked.indexOf(ipunbook);
		if(index == -1) reject('not booked');
		else {
			this.booked.splice(index,1);
			db = new mongo();
			db.connect().then(()=>{
				db.update('subnet',{booked:this.booked},{_id:this.id}).then((doc)=>{
					resolve(doc);
				}).catch((error)=>{
					log.err('brs_subnet',7,error);
					reject(error);
				});
			}).catch((error)=>{reject(error);});
		}
	});
};

subnet.prototype.remove = function() {
	return new Promise((resolve,reject)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.remove('subnet',{_id:this.id}).then(()=>{
				resolve(true);
			}).catch((error)=>{
				log.err('brs_subnet',5,error);
				reject(error);
			})
		}).catch((error)=>{reject(error);});
	});
};

module.exports = subnet;
