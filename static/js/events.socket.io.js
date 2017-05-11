window.onload = function(){

socket = io();
alerts.initVue();

//HOME
vues.load.menu();
main.loadTemplate('vpnList');

//RESPONSE ROUTING
socket.on('res',function(res){
	console.log(res);
	template = false;
	if(res.AppNotReady) main.loadTemplate('configuration');
	else {
		vues.menu.display=true;
		if(res.module && res.action) {
			switch(res.module) {
				case 'template':
					handleTemplate(res);
					break;
				case 'config':
					handleConfig(res);
					break;
				case 'vpn':
					handleVpn(res);
					break;
			}
		}
	}
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

function handleVpn(res){
	switch(res.action){
		case 'list':
			$('#vpnList').trigger('vpnList',res);
			break;
	}
}