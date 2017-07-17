const mongoose = require('mongoose');

var schemas = {};
schemas.subnet = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		unique : true,
	},
	network: {
		type : String,
		required : true,
	},
	parent : {
		type : String,
		required : true,
	},
  	netmask: {
  		type : String,
  		required : true,
  	},
  	netmap : {
  		type : String,
  		unique : true,
  	},
  	booked: {
  		type : String,
  	}
});

schemas.lxc = new mongoose.Schema({
    state : {
        type : Number,
        required : true,
    },
    parent : {
    	type : String,
    	required: true,
    }
}, { toObject: { virtuals: true }, toJSON: { virtuals: true }});

schemas.lxc.virtual('statePrintable').get(function(){
	var ret;
	switch(this.state){
		case 0:
			ret = 'Need configuration';
			break;
		case 1:
			ret = 'Stopped';
			break;
		case 2:
			ret = 'Started';
			break;
		default:
			ret = 'Unknown';
	}
	return ret;
});

schemas.vpn = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		unique : true
	},
});

schemas.config = new mongoose.Schema({
	app_path : {
		type : String,
		required : true,
		unique : true,
	},
	vpn_subnet : {
		type : mongoose.Schema.Types.ObjectId,
		required : true,
		unique : true,
	},
	vpn_gateway : {
		type : String,
		required : true,
		unique : true,
	},
	vpn_dns : {
		type : String,
		required : true,
		unique : true,
	},
});

schemas.ovpn = new mongoose.Schema({
	parent : {
		type : String,
		required : true,
		unique : true
	},
	remote : {
		type : String,
		required : true,
	},
	port : {
		type : String,
		required : true,
	},
	proto : {
		type : String,
		required : true,
	},
	pull : {
		type : Boolean,
		required : true,
	},
	dev : {
		type : String,
		required : true,
	},
	ping : {
		type : String,
		required : true,
	},
	comp : {
		type : Boolean,
		required : true,
	},
	verb : {
		type : String,
		required : true,
	},
	mute : {
		type : String,
		required : true,
	},
	tls : {
		type : Boolean,
		required : true,
	},
	cacert : {
		type : String,
		required : true,
	},
	cert : {
		type : String,
		required : true,
	},
	key : {
		type : String,
		required : true,
	}
});

function mongo() {
	this.db=false;
}

mongo.prototype.connect = function () {
	return new Promise((resolve,reject) => {
		try {
			this.db=mongoose.createConnection('mongodb://localhost/romavpndev');
			resolve(true);
		} catch(error) {
			reject(error);
		}
	});
}

mongo.prototype.save = function(schema,values){
	return new Promise((res,rej) => {
		const model = this.db.model(schema,schemas[schema]);
		model.create(values,(err,doc) =>{
			if(err) rej(err);
			else if(doc) res(doc);
			else rej(false);
		});
	});
}

mongo.prototype.findOne = function(schema,query){
	return new Promise((resolve,reject) => {
		const model = this.db.model(schema,schemas[schema]);
		model.findOne(query).exec((error,doc) => {
			if(error) reject(error);
			else if(doc || doc === null) resolve(doc);
			else reject(false);
		});
	});
}

mongo.prototype.findAll = function(schema,query){
	return new Promise((resolve,reject) => {
		const model = this.db.model(schema,schemas[schema]);
		model.find(query).exec((error,doc) => {
			if(error) reject(error);
			else if(doc) resolve(doc);
			else reject(false);
		});
	});
}

mongo.prototype.update = function(schema,query,where){
	return new Promise((resolve,reject)=>{
		const model = this.db.model(schema,schemas[schema]);
		model.update(where,query).exec((error,doc)=>{
			if(error) reject(error);
			else if(doc) resolve(doc);
			else reject(false);
		});
	});
}

mongo.prototype.remove = function(schema,query){
	return new Promise((resolve,reject)=>{
		const model = this.db.model(schema,schemas[schema]);
		model.remove(query).exec((error,result)=>{
			if(error) reject(error);
			else if(result.result.n < 1) reject(result);
			else reject(true);
		});
	});
}

module.exports = mongo;
