const mongo = require('./brs_mongo.js');
const lxc = require('./brs_lxc');

function vpn(){
	this.name = false;
	this.subnets = false;
	this.ovpn = false;
	this.lxc = false;
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
				this.lxc = saved.id;
                db = new mongo();
                db.connect().then(()=>{
                    db.save('vpn',{lxc:this.lxc}).then((saved)=>{
                        this.id = saved._id;
                        ret.vpn = this;
                        res(ret);
                    }).catch((error)=>{
                        ret.vpnNotSaved = true;
                        ret.error = error;
                        rej(ret);
                    });
                }).catch((error)=>{rej(error);});
			}).catch((error)=>{
				ret.lxcNotSaved = true;
				ret.error = error;
				rej(ret);
			});
		}
	});
};

module.exports=vpn;