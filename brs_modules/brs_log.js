const logfile = require('../config.js').log.file;

const fs = require('fs');

const write = (log) => {
	fs.appendFile(logfile,log+'\n\r',function(err){
		if(err) console.log('File '+logfile+' missing');
	});
}

const log = (c,n,m,level) => {
	const d = new Date().toUTCString();
	return d+' -- '+level+' '+n+' '+messages.query(n,messages[c])+' : '+m;
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
	a.forEach(function(err){
		if(err[0] == n) msg=err[1];
	});
	return msg;
}
messages.brs_exec=[
	[0,''],
	[1,'Command succesfully executed'],
	[2,'Error during command exec'],
	[3,'Command finished']
];
