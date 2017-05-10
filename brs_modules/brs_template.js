const fs = require('fs');

function template(){
	this.path = './static/html/';
}

template.prototype.loadHTML = function(template) {
	return new Promise((res,rej)=>{
		this.template = template;
		fs.readFile(this.path+this.template+'.html','utf-8', (error,data)=>{
			if(error) rej(error);
			else if(data) res(data);
			else rej({templateLoadHTMLreturnNothing:true});
		});
	});
}

module.exports=template;