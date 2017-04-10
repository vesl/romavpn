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

exports.exec = (cmd) => {
	return sortargs(cmd);
}
