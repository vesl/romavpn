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

vpn.prototype.checkAdd = function(){
	return new Promise((res,rej)=>{
		db = new mongo();
		db.connect().then(()=>{
			db.findOne('vpn',{name:this.name}).then(()=>{
				rej({alreadyExists:true});
			}).catch((notexists)=>{
				res(true);	
			});
		}).catch((error)=>{rej(error);});
	});
};

vpn.prototype.add = function(){
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
		Lxc.add().then(()=>{
			this.lxc = Lxc.id;
			res();
		}).catch((error)=>{rej(error);});
	});
};

module.exports=vpn;