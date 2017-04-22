const config=require('../config.js').lxc;
const mongo=require('./brs_mongo.js');
const exec=require('./brs_exec.js').exec;
const subnet=require('./brs_subnet');

function lxc(args) {
	return new Promise((resolve,reject)=>{
		this.name=args.name;
        this.ip=false;
        this.loadSubnet().then(()=>{
            this.load().then((loaded)=>{
                resolve(loaded);
            }).catch((error)=>{
                reject(error);
            });
        }).catch((error)=>{reject(error);});
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
                this.share=config.share+this.name;
			}).catch((error)=>{
				log.err('brs_lxc',0,this.name);
				reject(error);
			});
		}).catch((error)=>{reject(error);});
	});
};

lxc.prototype.save = function() {
	return new Promise((resolve,reject)=>{
		db=new mongo();
		db.connect.then(()=>{
			db.save('lxc',{name:this.name,ip=this.ip}).then((doc)=>{
				this.id=doc._id;
				resolve(doc);
			}).catch((error)=>{
				log.err('brs_lxc',1,error);
				reject(error);
			});
		}).catch((error)=>{reject(error);});
	});
};

lxc.prototype.loadSubnet = function() {
    return new Promise((resolve,reject)=>{
        new subnet({name:'lxc_subnet'}).then((lxc_subnet)=>{
            this.subnet=lxc_subnet;
            resolve(this.subnet);
        }).catch((error)=>{
            log.err('brs_lxc',2,error);
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
            this.subnet.book(ip).then(()=>{resolve(ip);
            }).catch((error)=>{reject(error);});
        }
    });
};

lxc.prototype.create = function() {
    return new Promise((resolve,reject)=>{
        cmd = '/usr/bin/lxc-create -n '+this.name+' -t romavpn -- --ip '+this.ip+' --netmask '+this.subnet.netmask+' --gateway '+this.subnet.gateway+' --dns '+this.subnet.dns+' --share '+this.share;
        exec(cmd).then(()=>{resolve(true);}).catch((error)=>{
            log.err('brs_lxc',4,error);
            reject(false);
        });
    });
};

lxc.prototype.start = function() {
	return new Promise((resolve,reject)=>{
        cmd = '/usr/bin/lxc-start -n '+this.name;
        exec(cmd).then(()=>{resolve(true);}).catch((error)=>{
            log.err('brs_lxc',5,error);
            reject(false);
        });
    });
};

lxc.prototype.destroy = function() {
	return new Promise((resolve,reject)=>{
        cmd = '/usr/bin/lxc-destroy -n '+this.name;
        exec(cmd).then(()=>{resolve(true);}).catch((error)=>{
            log.err('brs_lxc',6,error);
            reject(false);
        });
    });
};

lxc.prototype.stop = function() {
	return new Promise((resolve,reject)=>{
        cmd = '/usr/bin/lxc-stop -n '+this.name;
        exec(cmd).then(()=>{resolve(true);}).catch((error)=>{
            log.err('brs_lxc',7,error);
            reject(false);
        });
    });
};

module.exports = lxc;
