const exec=require('./brs_modules/brs_exec.js').exec;


function out(data){
	console.log('OUT');
	console.log(data);
}
function err(data){
	console.log('ERR');
	console.log(data);
}
function finish(data){
	console.log('FINISH');
	console.log(data);
}
test=exec('ls -l /etc',out,err,finish);
