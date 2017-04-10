const exec=require('./brs_modules/brs_exec.js').exec;

test=exec('ls -l /etc');

console.log(test);
