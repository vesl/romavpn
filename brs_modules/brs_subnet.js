const ip = require('ip');
const mongo = require('./brs_mongo.js');
const exec = require('./brs_exec.js').exec;

function subnet(){
	this.id = false;
	this.name = false;
	this.network = false;
	this.netmask = false;
	this.netmap = '';
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
				this.subnet = (this.netmap === "false" || this.netmap.length === 0 ) ? ip.subnet(this.network,this.netmask) : ip.subnet(this.netmap,this.netmask);
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

subnet.prototype.check = function(){
	return new Promise((res,rej)=>{
		if(this.name.length === 0) return rej({emptyName:true});
		db = new mongo();
		db.connect().then(()=>{
			try {
				this.subnet = (this.netmap.length > 0)  ? ip.subnet(this.netmap,this.netmask) : ip.subnet(this.network,this.netmask);
				this.booked = JSON.stringify({broadcast:this.subnet.broadcastAddress});
			} catch(error){
				return rej({invalidNetworks:error});
			}
			if (this.netmap.length === 0) {
				db.findAll('subnet',{network:this.network}).then((subnets)=>{ 
					if(subnets.length > 0) return rej({subnetAlreadyUsed : subnets});
					else res(true);
				}).catch((error)=>{ return rej({cantCheckSubnets:error})});
			} else {
				db.findAll('subnet',{netmap:this.netmap}).then((netmaps)=>{
					if(netmaps.length > 0) return rej({netmapAlreadyUsed : netmaps});
					else res(true);
				}).catch((error)=>{ return rej({cantCheckNetmaps:error})});
			}
		}).catch((error)=>{ return rej({dbError:error})});
	});
};

subnet.prototype.save = function() {
	return new Promise((res,rej)=>{
		this.check().then((ok)=>{
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
					if(this.netmap.length > 0) {
						this.nat().then(()=>{
							res(saved);	
						}).catch((error)=>{console.log(error);rej({unableToNat:error})});
					} else res(saved);	
				}).catch((error)=>{rej({subnetNotSaved:error})});
			}).catch((error)=>{rej(error);});
		}).catch((error)=>{rej(error)});
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
        free = true;
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
			this.contains(book).then((ok)=>{
				free=true;
				for(hostBook in this.booked) {
					if(book == this.booked[hostBook]) {
						free = false;
						break;
					}
				}
				if(free === true){
					this.booked[host] = book;
					this.update({booked : JSON.stringify(this.booked)}).then(()=>{
						res(book);
					}).catch((error)=>{rej(error);});
				} else rej({ipAlreadyBooked:true});
			}).catch((error)=>{rej(error)});
        }
	});
};

subnet.prototype.contains = function(ip){
	return new Promise((res,rej)=>{
		try {
			contains = this.subnet.contains(ip);
			if(contains === false) rej({ipNotInSubnet:true});
			else res(true);
		} catch(error) {
			rej({invalidIp:error});
		}
	});
};

subnet.prototype.route = function(query,gateway,action){
	return new Promise((res,rej)=>{
		this.list(query).then((subnets)=>{
			subnets.forEach((subnet)=>{
				if(subnet.netmap.length > 0) subnet.network = subnet.netmap;
				cmd = '/sbin/ip route '+action+' '+subnet.network+'/'+subnet.netmask+' via '+gateway;	
				exec(cmd).then(()=>{
					res(cmd);
				}).catch((error)=>{rej({couldNotAddRoutes:error})});
			});
		}).catch((error)=>{rej({cantListSubnets:error})});
	});
};

subnet.prototype.nat = function(){
	return new Promise((res,rej)=>{
		const config = require('./brs_config.js');
		Config = new config();
		Config.load().then(()=>{
			const fs = require('fs');
			const path = Config.app_path+"/lxc_share/";
			fs.appendFile(path+this.parent+"UP.sh",'/sbin/iptables -t nat -I PREROUTING -d '+this.netmap+'/'+this.netmask+' -j NETMAP --to '+this.network+'/'+this.netmask+'\n',(error)=>{
				if (error) return rej({cantWriteNetmap:error});
				else res(true);
			});		
		}).catch((error)=>rej({configPathNotLoad:error}));
	});
};

module.exports=subnet;
