const mongo = require('./brs_mongo.js');
const lxc = require('./brs_lxc');
const ovpn = require('./brs_ovpn.js');

function vpn(){
	this._id = false;
	this.name = false;
	this.subnets = false;
	this.ovpn = false;
	this.lxc = false;
}

vpn.prototype.load = function(){
	if(this._id === false) return rej({idUnset:true});
	return new Promise((res,rej)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('vpn',{_id:this._id}).then((found)=>{
				this.name = found.name;
				Lxc = new lxc();
				Lxc.parent = this.name;
				Lxc.load().then((found)=>{
					this.lxc = found;
					Ovpn = new ovpn();
					Ovpn.parent = this.name;
					Ovpn.load().then((found)=>{
						if(found._id !== false) this.ovpn = found;
						else this.ovpn = false;
						res(this);
					}).catch((error)=>{rej(error)});
				}).catch((error)=>rej({lxcNotLoaded:error}));
			}).catch((notfound)=>rej({notExists:true}));
		}).catch((error)=>{rej(error);});
	});
};

vpn.prototype.list = function(which){
	return new Promise((res,rej)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findAll('vpn',which).then((list)=>{
				res(list);
			}).catch((error)=>{rej({cantListVpn:error})});
		}).catch((error)=>{rej(error);});
	});
};

vpn.prototype.checkAdd = function(){
	return new Promise((res,rej)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('vpn',{name:this.name}).then((found)=>{
				if(found._id !== false) rej({alreadyExists:true});
				else res(true);
			}).catch((notexists)=>{res(true);});
		}).catch((error)=>{rej(error);});
	});
};

vpn.prototype.save = function(){
	return new Promise((res,rej)=>{
		ret = {};
		this.checkAdd().then(()=>{
			this.addLxc().then(()=>{
				db = new mongo();
		        db.connect().then(()=>{
		        	db.save('vpn',{name:this.name,lxc:this.lxc}).then((saved)=>{
		        		this.id = saved._id;
		        	    ret.vpn = this;
		        	    res(ret);
		        	}).catch((error)=>{rej({vpnNotSaved:error});});
		    	}).catch((error)=>{rej({dbc:error});});
			}).catch((error)=>{rej({lxcNotSaved:error})});
		}).catch((error)=>{rej({validationError:error})});
	});
};

vpn.prototype.addLxc = function(){
	return new Promise((res,rej)=>{
		ret = {};
		Lxc = new lxc();
		Lxc.parent = this.name;
		Lxc.save().then(()=>{
			this.lxc = Lxc.id;
			res();
		}).catch((error)=>{rej(error);});
	});
};

module.exports=vpn;