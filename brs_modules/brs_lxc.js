const config=require('../config.js').lxc;
const exec=require('./brs_exec.js').exec;
const subnet=require('./brs_subnet');

function lxc(args) {
	this.name = args.name;
	this.ip=args.ip;
	this.subnet = config.subnet;
	this.gateway = config.gateway;
	this.dns = config.dns;
	this.share = config.share;
}

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
