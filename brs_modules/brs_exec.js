const exec = require('child_process').exec;


exports.exec = (cmd) => {
	return new Promise(function(res,rej) {
		const process=exec(cmd, (error,stdout,stderr) => {
			return new Promise( function(res,rej) {
				if(error) rej(stderr);
				else res(stdout);
			}).then(function(stdout){res(stdout);
			}).catch(function(stderr){rej(stderr);});
		});
	});
}