const logfile = require('../config.js').logfile;

const fs = require('fs');

const write = (log) => {
	fs.writeFile(logfile,log,function(err){
		console.log('File '+logfile+' missing');
	});
}

const log = (c,n,m,level) => {
	return level+' '+n+' '+messages.query(n,messages[c])+' : '+m;
}

exports.err = (c,n,m) => {
	write(log(c,n,m,'CRITICAL'));
	exit('Critical error.');
}

exports.warning = (c,n,m) => {
	write(log(c,n,m,'WARNING'));
}

exports.info = (c,n,m) => {
	write(log(c,n,m,'INFO'));
}

const messages = {};
message.query = (n,a) => {
	a.forEach(function(err){
		if(err[0] == n) return err[1];
	});
}
messages.brs_exec=[
	[0,'No argument'],
	[1,'Command succesfully executed'],
	[2,'Error during command exec'],
	[3,'Command finished']
];