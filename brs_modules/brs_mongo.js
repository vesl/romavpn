const config = require('../config.js').mongo;
const log = require('./brs_log.js');
const mongoose = require('mongoose');

var schemas = {};
schemas.subnet = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		unique : true
	},
	network: {
		type : String,
		required : true,
		unique : true
	},
  	netmask: {
  		type : String,
  		required : true
  	},
    gateway: {
        type : String,
    },
    dns : {
        type : String,
    },
  	booked: {
  		type : Array,
  	}
});

schemas.lxc = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true,
    },
    ip : {
        type : String,
        required : true,
        unique : true,
    },
});

schemas.vpn = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		unique : true
	},
});

function mongo() {
	this.db=false;
}

mongo.prototype.connect = function () {
	return new Promise((resolve,reject) => {
		this.db=mongoose.createConnection(config.uri,(error)=>{
			if(error) reject(error);
			else resolve(this.db);
		});
	});
}

mongo.prototype.save = function(schema,values){
	return new Promise((resolve,reject) => {
		const model = this.db.model(schema,schemas[schema]);
		model.create(values,(err,doc) => {
			if(err) reject(err);
			else if(doc) resolve(doc);
		});
	});
}

mongo.prototype.findOne = function(schema,query){
	return new Promise((resolve,reject) => {
		const model = this.db.model(schema,schemas[schema]);
		model.findOne(query).exec((error,doc) => {
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
