const config=require('../config.js').lxc;
const exec=require('./brs_exec.js').exec;

function lxc(args) {
	this.name = args.name;
	this.ip = args.ip;
	this.subnet = config.subnet;
	this.gateway = config.gateway;
	this.dns = config.dns;
	this.share = config.share;
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
		cf_close: function(){
			console.log('Lxc container created');
		}
	}
	exec(args);
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
		cf_close: function (data) {
			console.log('Lxc container started');
		}
	}
	exec(args);
}

lxc.prototype.destroy = function() {
	args = {
		cmd : '/usr/bin/lxc-destroy -n '+this.name,
		cf_out: function(data){
			console.log(data);
		},
		cf_err: function(data){
			console.log(data);
		},
		cf_close: function(data){
			console.log('Lxc container destroyed');
		}
	}
	exec(args);
}

lxc.prototype.stop = function() {
	args = {
		cmd : '/usr/bin/lxc-stop -n '+this.name,
		cf_out: function(data){
			console.log(data);
		},
		cf_err: function(data){
			console.log(data);
		},
		cf_close: function(data){
			console.log('Lxc container stopped');
		}
	}
	exec(args);
}

lxc.prototype.info = function() {
	args = {
		cmd : '/usr/bin/lxc-info -n '+this.name,
		cf_out: function(data){
			line=data.split('\n')[1];
			if(/State:/.exec(line)) {
				if (/STOPPED/.exec(line)) console.log('STOPPED');
				else console.log('STARTED');
			}
		},
		cf_err: function(data){
			console.log(data);
		},
		cf_close: function(data){
			console.log(data);
		}
	}
	exec(args);
}


module.exports = lxc;
