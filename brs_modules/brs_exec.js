const log = require('./brs_log.js');

const exec = require('child_process').spawn;

const sortargs = (cmd) => {
	ret=[];
	args=cmd.split(' ');
	args.splice(0,1);
	if (args.length == 0) return false;
	args.forEach(function(arg){
		ret.push(arg.trim());
	});
	return ret;
}

exports.exec = (cmd,cf_out,cf_err,cf_close) => {
	if(!args=sortargs(cmd)) {
		log.info('brs_exec',0,cmd);
		args='';
	}
	process=exec(cmd+' '+args);
	process.stdout.on('data',(data) => {
		log.info('brs_exec',1,cmd);
		cf_out(data);
	});
	process.stderr.on('data',(data) => {
		log.err('brs_exec',2,cmd);
		cf_err(data);
	});
	process.stdout.on('data',(data) => {
		log.info('brs_exec',3,cmd);
		cf_out(data);
	});
}
