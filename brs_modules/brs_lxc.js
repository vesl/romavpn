const config=require('../config.js').lxc;
const mongo=require('./brs_mongo.js');
const exec=require('./brs_exec.js').exec;
const subnet=require('./brs_subnet');

function lxc(args) {
	return new Promise((resolve,reject)=>{
		this.name=args.name;
		this.load().then((loaded)=>{
			resolve(loaded);
		}).catch((error)=>{
			reject(error);
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
			db.save('lxc',{name:name}).then((doc)=>{
				this.id=doc._id;
				resolve(doc);
			}).catch((error)=>{
				log.err('brs_lxc',1,error);
				reject(error);
			});
		}).catch((error)=>{reject(error);});
	});
};

lxc.prototype.info = function() {
	return new Promise((resolve,reject) => {
		exec('lxc-info -n '+this.name).then((stdout) => {
			resolve(stdout);
		}).catch((stderr) => {
			reject(stderr);
		});
	});
};

lxc.prototype.create = function() {
	cmd = '/usr/bin/lxc-create -n '+this.name+' -t romavpn -- --ip '+this.ip+' --subnet '+this.subnet+' --gateway '+this.gateway+' --dns '+this.dns+' --share '+this.share;
};

lxc.prototype.start = function() {
	//exec(args);
};

lxc.prototype.destroy = function() {
	//exec(args);
};

lxc.prototype.stop = function() {
	//exec(args);
};

module.exports = lxc;
