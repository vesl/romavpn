const log = require('./brs_log.js');

const exec = require('child_process').spawn;

const sortcmd = (cmd) => {
	ret=[];
	const args=cmd.split(' ');
	const bin=args.splice(0,1)[0];
	if (args.length == 0) args=[];
	args.forEach(function(arg){
		ret.push(arg.trim());
	});
	return {bin:bin,args:args};
}

exports.exec = (cmd,cf_out,cf_err,cf_close) => {

	cmd=sortcmd(cmd);
	const process=exec(cmd.bin,cmd.args);

	process.stdout.on('data',(data) => {
		log.info('brs_exec',1,cmd.bin+cmd.args);
		cf_out(data.toString());
	});
	process.stderr.on('data',(data) => {
		log.err('brs_exec',2,cmd.bin+cmd.args);
		cf_err(data.toString());
	});
	process.on('close',(data) => {
		log.info('brs_exec',3,cmd.bin+cmd.args);
		cf_close(data.toString());
	});
}
