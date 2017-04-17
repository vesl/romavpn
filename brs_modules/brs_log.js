const logfile = require('../config.js').log.file;

const fs = require('fs');

const write = (log) => {
	fs.appendFile(logfile,log+'\n',function(err){
		if(err) console.log('File '+logfile+' missing');
	});
}

const log = (c,n,m,level) => {
	const d = new Date().toUTCString();
	return d+' -- '+level+' '+c+' '+n+' '+messages.query(n,messages[c])+' : '+m;
}

exports.err = (c,n,m) => {
	write(log(c,n,m,'CRITICAL'));
}

exports.warning = (c,n,m) => {
	write(log(c,n,m,'WARNING'));
}

exports.info = (c,n,m) => {
	write(log(c,n,m,'INFO'));
}

const messages = {};
messages.query = (n,a) => {
	msg='';
	if (a == undefined) {
		log('brs_log',0,'','CRITICAL');
		return false;
	}
	a.forEach(function(err){
		if(err[0] == n) msg=err[1];
	});
	return msg;
}

messages.app=[
	[0,'Home page not found'],
	[1,'Js file not found'],
];

messages.brs_log=[
	[0,'this log category does not exist.'],
];

messages.brs_exec=[
	[0,'Command succesfully executed'],
	[1,'Error during command exec'],
];

messages.brs_mongo=[
	[0,'Connexion to database failed'],
];

messages.brs_subnet=[
	[0,'Invalid netmask'],
	[1,'Cant save subnet'],
	[2,'Cant find a subnet'],
	[3,'Ip out of subnet'],
	[4,'Cant book ip'],
	[5,'Cant remove subnet'],
	[6,'This subnet already exists'],
	[7,'This ip already booked']
];