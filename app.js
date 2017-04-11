const lxc = require('./brs_modules/brs_lxc');


test= new lxc({name:'test',ip:'10.0.0.249'});
console.log(test);
test.info();
