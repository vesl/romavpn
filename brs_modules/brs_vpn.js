const mongo = require('./brs_mongo.js');
const lxc = require('./brs_lxc');

function vpn(){
	this.name = false;
	this.subnets = false;
	this.ovpn = false;
	this.lxc = false;
	this.config = false;
}

vpn.prototype.load = function(which){
	return new Promise((res,rej)=>{
		ret = {};
		db = new mongo();
		db.connect().then(()=>{
			db.findAll('vpn',which).then((all)=>{
				res(all);
			}).catch((error)=>{
				ret.error = error;
				rej(ret);
			});
		}).catch((error)=>{rej(error);});
	});
};

vpn.prototype.check = function(){
	return true;
};

vpn.prototype.add = function(){
	return new Promise((res,rej)=>{
		ret = {};
		check = this.check();
		if(check == false) {
			ret.error = check;
			rej(ret);
		} else {
			Lxc = new lxc();
			Lxc.name = this.name;
			Lxc.add().then((saved)=>{
				ret.lxc = saved;
				res(ret);
			}).catch((error)=>{
				ret.lxcNotSaved = true;
				ret.error = error;
				rej(ret);
			});
		}
	});
};

module.exports=vpn;