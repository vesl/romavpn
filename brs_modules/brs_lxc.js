const config=require('../config.js').lxc;
const mongo=require('./brs_mongo.js');
const exec=require('./brs_exec.js').exec;
const subnet=require('./brs_subnet.js');
const log=require('./brs_log.js');

function lxc(args) {
	return new Promise((resolve,reject)=>{
		this.name=args.name;
	        this.ip=false;
        	this.loadSubnet().then(()=>{
            		this.load().then((loaded)=>{resolve(loaded);}).catch((error)=>{reject(this);});
        	}).catch((error)=>{
                this.subnet=false;
                reject(this);
            });
	});
}

lxc.prototype.load = function() {
	return new Promise((resolve,reject)=>{
		db=new mongo();
		db.connect().then(()=>{
			db.findOne('lxc',{name:this.name}).then((found)=>{
				this.id=found._id;
				this.name=found.name;
                		this.ip=found.ip;
                		this.share=config.share;
				this.getState().then(()=>{resolve(this);}).catch(()=>{reject(this);});
			}).catch((error)=>{
				log.err('brs_lxc',0,this.name);
				reject(error);
			});
		}).catch((error)=>{reject(error);});
	});
};

lxc.prototype.save = function() {
	return new Promise((resolve,reject)=>{
		if(this.ip == false) {
			log.err('brs_lxc',8,this.ip);
			reject(this.ip);
		} else if (this.id) {
			log.err('brs_lxc',9,this.id);
			reject(this.id);
		} else {
			db=new mongo();
			db.connect().then(()=>{
				db.save('lxc',{name:this.name,ip:this.ip}).then((doc)=>{
					this.id=doc._id;
					resolve(doc);
				}).catch((error)=>{
					log.err('brs_lxc',1,error);
					reject(error);
				});
			}).catch((error)=>{reject(error);});
		}
	});
};

lxc.prototype.loadSubnet = function() {
    return new Promise((resolve,reject)=>{
        new subnet({name:'lxc_subnet'}).then((lxc_subnet)=>{
            this.subnet=lxc_subnet;
            resolve(this.subnet);
        }).catch((error)=>{
            log.err('brs_lxc',2,'lxc_subnet');
            reject(error);
        });
    });
}

lxc.prototype.setIp = function() {
    return new Promise((resolve,reject)=>{
        ip=this.subnet.free();
        if(!ip) {
            log.err('brs_lxc',3,ip);
            reject(false);
        } else {
            this.subnet.book(ip).then(()=>{
		this.ip=ip;
		resolve(ip);
            }).catch((error)=>{reject(error);});
        }
    });
};


lxc.prototype.getState = function() {
	this.state=false;
	return new Promise((resolve,reject)=>{
		cmd = '/usr/bin/lxc-info -n '+this.name;
		exec(cmd).then((out)=>{
			if(out.match(/State/)) {
				if(out.match(/STOPPED/)) {
					this.state=1;
					resolve(this.state);
				} else if(out.match(/RUNNING/)) {
					this.state=2;
					resolve(this.state);
				}
			}		
		}).catch((error)=>{
			if(error.match(/doesn't exist/)) {
				this.state=0;
				resolve(this.state);
			}
			else reject(error);
		});
	});
}

lxc.prototype.create = function() {
    return new Promise((resolve,reject)=>{
	if(this.state == 0) {
        	cmd = '/usr/bin/lxc-create -n '+this.name+' -t romavpn -- --ip '+this.ip+' --netmask '+this.subnet.netmask+' --gateway '+this.subnet.gateway+' --dns '+this.subnet.dns+' --share '+this.share;
        	exec(cmd).then(()=>{
			this.getState().then((state)=>{
				if(state==1) resolve(state);
				else reject(state);
			}).catch((e)=>{reject(e);});
		}).catch((error)=>{
            		log.err('brs_lxc',4,error);
            		reject(false);
        	});
	} else {
		log.err('brs_lxc',9,this.state);
		reject(this.state);
	}
    });
};

lxc.prototype.start = function() {
	return new Promise((resolve,reject)=>{
	if(this.state == 1) {
        	cmd = '/usr/bin/lxc-start -d -n '+this.name;
        	exec(cmd).then(()=>{
			this.getState().then((state)=>{
				if(state == 2) resolve(state);
				else reject(state);
			}).catch((e)=>{reject(e);});
		}).catch((error)=>{
            		log.err('brs_lxc',5,error);
            		reject(false);
        	});
	} else {
		log.err('brs_lxc',10,this.state);
		reject(this.state);
	}
    });
};

lxc.prototype.stop = function() {
	return new Promise((resolve,reject)=>{
	if(this.state == 2) {
	        cmd = '/usr/bin/lxc-stop -n '+this.name;
	        exec(cmd).then(()=>{
			this.getState().then((state)=>{
				if(state == 1) resolve(state);
				else reject(state);
			}).catch((error)=>{
	        		log.err('brs_lxc',7,error);
	        		reject(false);
			});
	        });
	} else {
		log.err('brs_lxc',11,this.state);
		reject(this.state);
	}
	});
};

lxc.prototype.destroy = function() {
	return new Promise((resolve,reject)=>{
	if(this.state == 1) {
        	cmd = '/usr/bin/lxc-destroy -n '+this.name;
        	exec(cmd).then(()=>{
			this.getState().then((state)=>{
				if(state == 0) resolve(state);
				else reject(state);
			}).catch((error)=>{
        	    		log.err('brs_lxc',6,error);
        	    		reject(false);
        		});
		});
	} else {
		log.err('brs_lxc',12,this.state);
		reject(this.state);
	}
    });
};

module.exports = lxc;
