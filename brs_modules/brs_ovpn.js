const mongo=require('./brs_modules/brs_mongo.js');
const config=require('./config.js').lxc;
const fs=require('fs');

function ovpn(args){
    return new Promise((resolve,reject)=>{
        
        this.name=args.name;
        this.remote=args.remote || false;
        this.port=args.port || false;
        this.pull=args.pull || false;
        this.dev=args.dev || false;
        this.ping=args.ping || false;
        this.complzo=args.complzo || false;
        this.verb=args.verb || false;
        this.mute=args.mute || false;
        this.tlsclient=args.tlsclient || false;
        this.cacert=args.cacert || false;
        this.cert=args.cert || false;
        
        this.load().then((loaded)=>{
            resolve(loaded);
        }).catch((notexists)=>{
            reject(this);
        });
        
    });
}

ovpn.prototype.load = function() {
    return new Promise((resolve,reject)=>{
        db = new mongo();
        db.connect().then(()=>{
            db.findOne('ovpn',{name:this.name}).then((found)=>{
                this.id=found._id;
                this.remote=found.remote;
                this.port=found.port;
                this.proto=found.proto;
                this.pull=found.pull;
                this.dev=found.dev;
                this.ping=found.ping;
                this.complzo=found.complzo;
                this.verb=found.verb;
                this.mute=found.mute;
                this.tlsclient=found.tlsclient;
                this.pkcs12=found.pkcs12;
                this.share=config.share;
            }).catch((error)=>{
                log.err('ovpn',0,this.name);
                reject(error);
            });
        }).catch((error)=>{reject(error);});
    });
};

ovpn.prototype.setConfig(query) {
    return new Promise((resolve,reject)=>{
        db = new mongo();
        db.connect.then(()=>{
            db.update('ovpn',query,{_id:this.id}).then(()=>{
                resolve(true);
            }).catch((error)=>{reject(error)});
        }).catch((error)=>{reject(error);});
    });
};

ovpn.prototype.setRemote = function (remote) {
    return new Promise((resolve,reject)=>{
        this.setConfig({remote:remote}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',1,remote);
            reject(error);
        });
    });
};

ovpn.prototype.setPort = function (port) {
    return new Promise((resolve,reject)=>{
        this.setConfig({port:port}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',2,port);
            reject(error);
        });
    });
};

ovpn.prototype.setProto = function (proto) {
    return new Promise((resolve,reject)=>{
        this.setConfig({proto:proto}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',3,proto);
            reject(error);
        });
    });
};

ovpn.prototype.setPull = function (pull) {
    return new Promise((resolve,reject)=>{
        this.setConfig({pull:pull}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',4,pull);
            reject(error);
        });
    });
};

ovpn.prototype.setDev = function (dev) {
    return new Promise((resolve,reject)=>{
        this.setConfig({dev:dev}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',5,dev);
            reject(error);
        });
    });
};

ovpn.prototype.setPing = function (ping) {
    return new Promise((resolve,reject)=>{
        this.setConfig({ping:ping}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',6,ping);
            reject(error);
        });
    });
};

ovpn.prototype.setComplzo = function (complzo) {
    return new Promise((resolve,reject)=>{
        this.setConfig({complzo:complzo}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',7,complzo);
            reject(error);
        });
    });
};

ovpn.prototype.setVerb = function (verb) {
    return new Promise((resolve,reject)=>{
        this.setConfig({verb:verb}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',8,verb);
            reject(error);
        });
    });
};

ovpn.prototype.setMute = function (mute) {
    return new Promise((resolve,reject)=>{
        this.setConfig({mute:mute}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',9,mute);
            reject(error);
        });
    });
};

ovpn.prototype.setClient = function (tlsclient) {
    return new Promise((resolve,reject)=>{
        this.setConfig({tlsclient:tlsclient}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',10,tlsclient);
            reject(error);
        });
    });
};

ovpn.prototype.setCacert = function (cacert) {
    return new Promise((resolve,reject)=>{
        this.setConfig({cacert:cacert}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',11,cacert);
            reject(error);
        });
    });
};

ovpn.prototype.setCert = function (cert) {
    return new Promise((resolve,reject)=>{
        this.setConfig({cacert:cert}).then(()=>{resolve(true)}).catch((error)=>{
            log.err('ovpn',12,cert);
            reject(error);
        });
    });
};

ovpn.prototype.writeStartupScript = function() {
    return new Promise((resolve,reject)=>{
        cmd = '/usr/sbin/openvpn';
        cmd+= '--remote '+this.remote;
        cmd+= ' --port '+this.port;
        cmd+= ' --dev '+this.dev;
        cmd+= ' --ping '+this.ping;
        cmd+= ' --verb '+this.verb;
        cmd+= ' --mute '+this.mute;
        cmd+= ' --cacert '+this.cacert;
        cmd+= ' --cert '+this.cert;
        if(pull) cmd+= ' --pull';
        if(complzo) cmd+= ' --complzo';
        if(tlsclient) cmd+= ' --tls-client';
        fs.writeFile(this.share,'#!/bin/bash\r\n'+cmd,(error)=>{
            log.err('ovpn',13,error);
            reject(error);
        },()=>{resolve(true)});
    });
};

module.exports=ovpn;
