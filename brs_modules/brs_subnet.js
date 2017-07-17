const ip = require('ip');
const mongo = require('./brs_mongo.js');

function subnet(){
	this.id = false;
	this.name = false;
	this.network = false;
	this.netmask = false;
	this.netmap = false;
	this.parent = false;
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
				this.parent = found.parent;
				this.network = found.network;
				this.netmask = found.netmask;
				this.netmap = found.netmap;
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

subnet.prototype.list = function(which){
	return new Promise((res,rej)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findAll('subnet',which).then((list)=>{
				res(list);
			}).catch((error)=>{cantListSubnet:error})
		}).catch((error)=>{rej(error)});
	});
};

subnet.prototype.save = function() {
	return new Promise((res,rej)=>{
		ret = {};
		if(!this.name) return rej({nameEmpty:true});
		try {
			this.subnet = ip.subnet(this.network,this.netmask);
			this.booked = JSON.stringify({broadcast:this.subnet.broadcastAddress});
		} catch(error){rej({invalidSubnet:true});}
		if(!ret.invalidSubnet){
			db = new mongo();
			db.connect().then(()=>{
				db.save('subnet',{
					name : this.name,
					network : this.network,
					netmask : this.netmask,
					booked : this.booked,
					subnet : this.subnet,
					netmap : this.netmap,
					parent : this.parent,
				}).then((saved)=>{
					res(saved);
				}).catch((error)=>{rej({subnetNotSaved:true})});
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
            else rej({subnetFull:true});
        } else {
            try {
                this.subnet.contains(book);
                for(host in this.booked) {
                    if(book == this.booked[host]) return rej({ipAlreadyBooked:true});
                }
                this.booked[host] = book;
                this.update({booked : JSON.stringify(this.booked)}).then(()=>{
                    return res(book);
                }).catch((error)=>{rej(error);});
            } catch(error) {rej({invalidIp:true});}
        }
	});
}

module.exports=subnet;