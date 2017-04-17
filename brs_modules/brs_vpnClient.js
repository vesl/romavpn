const lxc = require('./brs_lxc.js');
const subnet = require('./brs_subnet.js');
const mongo = require('./brs_mongo.js');

function vpnClient(name) {
	return new Promise((resolve,reject)=>{
		this.name=name;
		this.load().then((vpn)=>{			
			resolve(vpn);
		}).catch((error)=>{			
			reject(error);
		});
	});
}

vpnClient.prototype.load = function() {
	return new Promise((resolve,reject)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('vpnClient',{name:this.name}).then((doc)=>{
				resolve(doc);
			}).catch((error) => {				
				reject(error);
			});
		}).catch((error)=>{
			reject(error);
		});
	});
};

vpnClient.prototype.save = function() {
	return new Promise((resolve,reject)=>{
		db = new mongo();
		db.connect().then(()=>{
		})
	});
}


module.exports = vpnClient;