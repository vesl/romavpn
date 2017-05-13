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

main.insertHTML = function(html) {
	$('#main').append(html);
};

main.cleanHTML = function() {
	$('#main').html('');
};