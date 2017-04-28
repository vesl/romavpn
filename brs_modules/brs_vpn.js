const lxc = require('./brs_lxc.js');
const subnet = require('./brs_subnet.js');
const mongo = require('./brs_mongo.js');
const ovpn = require('./brs_ovpn.js');

function vpn(args) {
	return new Promise((resolve,reject)=>{
        
		this.name=args.name;
        
		this.load().then((loaded)=>{resolve(loaded);
		}).catch((notexists)=>{
            reject(this);
		});
        
	});
}

vpn.prototype.load = function() {
	return new Promise((resolve,reject)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('vpn',{name:this.name}).then((found)=>{
                this.id=found._id;
                this.loadLxc.then(()=>{
                    this.loadOvpn.then(()=>{
                        resolve(this);
                    }).catch((error)=>{reject(error)});
                }).catch((error)=>{reject(error)});
			}).catch((error) => {
                log.err('brs_vpn',0,this.name);
				reject(error);
			});
		}).catch((error)=>{
			reject(error);
		});
	});
};

vpn.prototype.save = function() {
    return new Promise((resolve,reject)=>{
        if(this.id){
            log.err('brs_vpn',2,this.id);
            reject(this.id);
        } else {
            db = new mongo();
            db.connect().then(()=>{
                db.save('vpn',{name:this.name}).then((saved)=>{
                    this.id=saved._id;
                    resolve(this);
                }).catch((error)=>{
                    log.err('vpn',3,error.message);
                    reject(error.name);
                });
            });
        }
    });
};

vpn.prototype.loadLxc = function() {
    return new Promise((resolve,reject)=>{
        new lxc({name:this.name}).then((vpn_lxc)=>{
            this.lxc=vpn_lxc;
            resolve(this.lxc);
        }).catch((error)=>{
            log.err('vpn',1,this.lxc);
            reject(error);
        });
    });
};

vpn.prototype.createLxc = function() {
    return new Promise((resolve,reject)=>{
        new lxc({name:this.name}).then((exists)=>{
            log.err('vpn',4,this.lxc);
            reject(this.lxc);
        }).catch((vpn_lxc)=>{
            vpn_lxc.save().then(()=>{
                this.lxc=vpn_lxc;
                resolve(this.lxc);
            }).catch((error)=>{reject(error);});
        });
    });
};

vpn.prototype.removeLxc = function() {
    return new Promise((resolve,reject)=>{
        this.lxc.remove().then(()=>{
            resolve(this);
        }).catch((error)=>{
            log.err('vpn',5,this.name);
            reject(error);
        });
    });
};

vpn.prototype.loadOvpn = function() {
    return new Promise((resolve,reject)=>{
    });
};

vpn.prototype.createOvpn = function() {
    return new Promise((resolve,reject)=>{
        
    });
};

vpn.prototype.start = function () {
    return new Promise((resolve,reject) =>{
        this.lxc.start().then(()=>{
            resolve(true);
        }).catch((error)=>{reject(error)});
    });
};

vpn.prototype.stop = function () {
    return new Promise((resolve,reject) =>{
        this.lxc.stop().then(()=>{
            resolve(true);
        }).catch((error)=>{reject(error)});
    });
};

vpn.prototype.remove = function() {
    return new Promise((resolve,reject)=>{
        db = new mongo();
        db.connect().then(()=>{
            db.remove('vpn',{_id:this.id}).then(()=>{
                resolve(this);
            }).catch((error)=>{
                log.err('vpn',6,this.name);
                reject(err);
            });
        }).catch((error)=>{reject(error);});
    });
};

module.exports = vpn;