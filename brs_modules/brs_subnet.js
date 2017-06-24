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

subnet.prototype.update = function(query){
    return new Promise((res,rej)=>{
        ret = {};
        db = new mongo();
        db.connect().then(()=>{
            db.update('subnet',query,{_id:this.id}).then(()=>{
                ret.subnetUpdated = true;
                res(ret);
            }).catch((error)=>{
                ret.subnetNotUpdated = true;
                ret.error = error;
                rej(ret);
            });
        }).catch((error)=>{rej(error);});
    });
};

subnet.prototype.book = function(host,book){
	return new Promise((res,rej)=>{
        ret = {};
		if(!book){
            current = ip.toLong(this.network)+1;
            while(this.subnet.contains(ip.fromLong(current))){
                free = true;
                for(book in this.booked){
                    if(ip.fromLong(current) == this.booked[book]) {
                        free = false;
                        break;
                    }
                }
                if(free === true) {
					this.booked[host] = ip.fromLong(current);
					break;
                }
                else current++;
            }
            if(this.booked[host]) {
                this.update({booked : JSON.stringify(this.booked)}).then(()=>{
    					res(this.booked[host]);
                }).catch((error)=>{rej(error);});
            }
            else {
            	ret.subnetFull = true;
            	rej(ret);
            }
        } else {
            try {
                this.subnet.contains(book);
                for(host in this.booked) {
                    if(book == this.booked[host]){
                        ret.ipAlreadyBooked = true;
                        ret.host = host;
                        return rej(ret);
                    }
                }
                this.booked[host] = book;
                this.update({booked : JSON.stringify(this.booked)}).then(()=>{
                    return res(book);
                }).catch((error)=>{rej(error);});
            } catch(error) {
                ret.invalidIp = true;
                ret.error = book;
                rej(ret);
            }
        }
	});
}

module.exports=subnet;