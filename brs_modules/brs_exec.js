const log = require('./brs_log.js');
const exec = require('child_process').exec;


exports.exec = (cmd) => {
	return new Promise(function(resolve,reject) {
		const process=exec(cmd, (error,stdout,stderr) => {
			return new Promise( function(resolve,reject) {
				if(error) reject(stderr);
				else resolve(stdout);
			}).then(function(stdout){resolve(stdout);
			}).catch(function(stderr){reject(stderr);});
		});
	});
}
