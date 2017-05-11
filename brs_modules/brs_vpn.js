const mongo = require('./brs_mongo.js');

function vpn(){

}

vpn.prototype.getAll = function(){
	return new Promise((res,rej)=>{
		ret = {};
		db = new mongo();
		db.connect().then(()=>{
			db.findAll('vpn',{}).then((all)=>{
				res(all);
			}).catch((error)=>{
				ret.listAllVpns = false;
				ret.error = error;
				rej(ret);
			});
		}).catch((error)=>{rej(error);});
	});
};

module.exports=vpn;