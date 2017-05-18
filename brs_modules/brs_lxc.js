const mongo = require('./brs_mongo.js');
const subnet = require('./brs_subnet.js');

function lxc(){
	this.parent = '';
	this.ip = '';
    this.state = -1;
}

lxc.prototype.add = function(){
	return new Promise((res,rej)=>{
		ret = {};
		Subnet = new subnet();
		Subnet.load({name:'default_lxc_subnet'}).then(()=>{
			Subnet.book(this.parent).then((ip)=>{
				this.ip = ip;
				db = new mongo();
                db.connect().then(()=>{
                    db.save('lxc',{state : this.state;}).then((saved)=>{
                        ret.id = saved._id;
                        res(ret);
                    }).catch((error)=>{
                        ret.error = error;
                        rej(ret);
                    });
                }).catch((error)=>{rej(error);});
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