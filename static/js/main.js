var main = {};

main.vues = {};

main.loadTemplate = function(template){
	if(template == false) return;
	req = {
		module : 'template',
		action : 'load',
		template : template,
	}
	socket.emit('req',req);
};

main.displayTemplate = function(res) {
	if(!res.template) return;
	switch(res.template) {
		case 'firstConfiguration':
			vues.load.firstConfiguration(res);
			break;
	}
};

main.insertHTML = function(html) {
	$('#main').append(html);
};

main.cleanHTML = function() {
	$('#main').html('');
};