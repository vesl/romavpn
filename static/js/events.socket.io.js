window.onload = function(){

socket = io();
alerts.initVue();

//HOME
vues.load.menu();

socket.on('appReady',function(ready){
	if(ready == false) {
		vues.menu.display = false;
		vues.call.config();
	} 
	else vues.call.vpn({});
});

//RESPONSE ROUTING
socket.on('res',function(res){
	console.log(res);
    if(res.module && res.action) {
		switch(res.module) {
            case 'config':
				handleConfig(res);
				break;
			case 'vpn':
				handleVpn(res);
				break;
			case 'vpnAdd':
				handleVpnAdd(res);
				break;
		}
	}
});

socket.on('e',function(res){
	alerts.handle(res);
});

}

function handleConfig(res){
	switch(res.action){
        case 'load':
            vues.load.config(res);
            break;
		case 'update':
			vues.handle.config(res);
			break;
	}
}

function handleVpn(res){
	switch(res.action){
		case 'load':
			vues.load.vpn(res);
			break;
	}
}

function handleVpnAdd(res){
	switch(res.action){
		case 'load':
			vues.load.vpnAdd(res);
			break;
		case 'add':
			vues.handle.vpnAdd(res);
	}
}