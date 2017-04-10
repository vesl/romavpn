const logfile = require('../config.js').logfile;

const fs = require('fs');

const write = (log) => {
	fs.writeFile(logfile,log,function(err){
		console.log('File '+logfile+' missing');
	});
}

const log = (level,detail) => {
	stack = new Error.stack();
	return level+' '+detail+' '+stack;
}

exports.err = (detail) => {
	write(log(detail,'CRITICAL'));
	exit('Critical error.');
}

exports.warning = (detail) => {
	write(log(detail,'WARNING'));
}

exports.info = (detail) => {
	write(log(detail,'INFO'));
}