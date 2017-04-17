const ip = require('ip');
const log = require('./brs_log.js');
const mongo = require('./brs_mongo.js');

function subnet(args) {
	return new Promise((resolve,reject)=>{
		this.load({name:args.name}).then((loaded)=>{
			resolve(loaded);	
		}).catch((notfound)=>{
			this.name = args.name;
			this.network = args.network;
			this.netmask = args.netmask;
			try { 
				this.subnet = ip.subnet(this.network,this.netmask);
			} catch(e) {
				this.subnet = false;
			}
			this.booked = args.booked || [];
			reject(this);
		});
	});
}

subnet.prototype.save = function() {
	return new Promise((resolve,reject) => {
		if(this.id) {
			log.err('brs_subnet',6,this.id);
			reject(false);
		} else {
			db = new mongo();
			db.connect().then(()=>{
				db.save('subnet',{name:this.name,network:this.network,netmask:this.netmask,booked:this.booked}).then((doc)=>{
					resolve(doc);
				}).catch((error)=>{
					log.err('brs_subnet',1,error);
					reject(error.name);
				});
			}).catch((error)=>{reject(error);});
		}
	});
};

subnet.prototype.load = function(query) {
	return new Promise((resolve,reject) => {
		db = new mongo();
		db.connect().then(() => {
			db.findOne('subnet',query).then((doc)=>{
				this.id=doc._id;
				this.name=doc.name;
				this.network=doc.network;
				this.netmask=doc.netmask;
				this.subnet=ip.subnet(this.network,this.netmask);
				this.booked=doc.booked;
				resolve(this);
			}).catch((error)=>{
				log.err('brs_subnet',2,error);
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
			if (this.booked.indexOf(ip.fromLong(current)) == -1) return ip.fromLong(current);
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
					db.update('subnet',{booked:this.booked},{name:this.name}).then((doc)=>{
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
				db.update('subnet',{booked:this.booked},{name:this.name}).then((doc)=>{
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
			db.remove('subnet',{name:this.name}).then(()=>{
				resolve(true);
			}).catch((error)=>{
				log.err('brs_subnet',5,error);
				reject(error);
			})
		}).catch((error)=>{reject(error);});
	});
};

module.exports = subnet;
