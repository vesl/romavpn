const mongo = require('./brs_mongo.js');
const subnet = require('./brs_subnet.js');

function lxc(){
	this.name = '';
	this.ip = '';
}

lxc.prototype.add = function(){
	return new Promise((res,rej)=>{
		ret = {};
		Subnet = new subnet();
		Subnet.load({name:'default_lxc_subnet'}).then(()=>{
			Subnet.book(this.name).then((ip)=>{
				console.log(ip);
				this.ip = ip;
				res(this);
			}).catch((error)=>{
				ret.ipNotBooked = true;
				ret.error = error;
				rej(ret);
			});
		}).catch((error)=>{
			ret.subnetNotLoad = true;
			ret.error = error;
			rej(ret);
		});
	});
};

module.exports = lxc;