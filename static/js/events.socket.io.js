window.onload = function(){

socket = io();
alerts.initVue();

//HOME
vues.load.menu();
const req = {module:'vpn',action:'list',which:{},target:'main'};
socket.emit('req',req);

//RESPONSE ROUTING
socket.on('res',function(res){
	console.log(res);
	template = false;
	if(res.AppNotReady)  template = 'configuration';
	else {
		vues.menu.display=true;
		if(res.module && res.action) {
			switch(res.module) {
				case 'template':
					handleTemplate(res);
					break;
				case 'config':
					handleConfig(res);
			}
		}
	}
	main.loadTemplate(template);
});

socket.on('e',function(res){
	alerts.handle(res);
});

}

function handleTemplate(res){
	switch(res.action){
		case 'load':
			main.displayTemplate(res);
			break;
	}
}

function handleConfig(res){
	switch(res.action){
		case 'create':
			vues.handle.configuration(res);
			break;
	}
}