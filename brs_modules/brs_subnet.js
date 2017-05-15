const ip = require('ip');
const mongo = require('./brs_mongo.js');

function subnet(){
	this.id = false;
	this.name = false;
	this.network = false;
	this.netmask = false;
	this.booked = '{}';
}

subnet.prototype.load = function(query){
	return new Promise((res,rej)=>{
		ret = {};
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('subnet',query).then((found)=>{
				this.id = found._id;
				this.name = found.name;
				this.network = found.network;
				this.netmask = found.netmask;
				this.booked = JSON.parse(found.booked);
				this.subnet = ip.subnet(this.network,this.netmask);
				res(found);
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

subnet.prototype.save = function() {
	return new Promise((res,rej)=>{
		ret = {};
		if(!this.name) {
			ret.nameEmpty=true;
			rej(ret);
		}
		try {
			this.subnet = ip.subnet(this.network,this.netmask);
			this.booked = JSON.stringify({broadcast:this.subnet.broadcastAddress});
		} catch(error){
			ret.invalidSubnet=true;
			rej(ret);
		}
		if(!ret.invalidSubnet){
			db = new mongo();
			db.connect().then(()=>{
				db.save('subnet',{
					name : this.name,
					network : this.network,
					netmask : this.netmask,
					booked : this.booked,
					subnet : this.subnet,
				}).then((saved)=>{
					res(saved);
				}).catch((error)=>{
					ret.subnetNotSaved=true;
					ret.error = error;
					rej(ret);
				});
			}).catch((error)=>{rej(error);});
		}
	});
};

subnet.prototype.book = function(host,book){
	return new Promise((res,rej)=>{
		book = book || false;
		ret = {};
		current = ip.toLong(this.network)+1;
		while(this.subnet.contains(ip.fromLong(current))){
			free = true;
			for(book in this.booked){
				if(ip.fromLong(current) == this.booked[book]) {
					free = false;
					break;
				}
			}
			if(free == true) return res(ip.fromLong(current));
			else current++;
		}
		ret.subnetFull = true;
		rej(ret);
	});
}

module.exports=subnet;