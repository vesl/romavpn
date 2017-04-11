const config=require('../config.js');
const exec=require('./brs_exec.js');

function lxc(args) {
	this.name = args.name;
	this.ip = args.ip;
	this.subnet = config.lxc_subnet;
	this.gateway = config.lxc_gateway;
	this.dns = config.lxc_dns;
	this.share = config.lxc_share;
}

lxc.prototype.start = function start() {
  console.log(this);
};

lxc.prototype.create = function() {
	args = {
		cmd:'/usr/bin/lxc-create -n '+this.name+' -t romavpn -- --ip '+this.ip+' --subnet '+this.subnet+' --gateway '+this.gateway+' --dns '+this.dns+' --share '+this.share,
		cf_out: function(data){
			console.log(data);
		},
		cf_err: function(data){
			console.log(data);
		},
		cf_finish: function(){
			console.log('Lxc container created');
		}
	}
}

lxc.prototype.start = function() {
	args = {
		cmd : '/usr/bin/lxc-start -n '+this.name,
		cf_out: function(data){
			console.log(data);
		},
		cf_err: function(data){
			console.log(data);
		},
		cf_finish: function (data) {
			console.log('Lxc container started');
		}
	}
}

module.exports = lxc;
