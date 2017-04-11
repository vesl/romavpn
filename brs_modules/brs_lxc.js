const config=require('../config.js');
const exec=require('./brs_exec.js');

function lxc(args) {
	this.name = args.name;
	this.ip = args.ip;
	this.subnet = config.lxc_subnet;
	this.gateway = config.lxc_gateway;
	this.share = config.lxc_share;
}

lxc.prototype.start = function start() {
  console.log(this);
};

module.exports = lxc;
