window.onload = function(){

socket = io();
alerts.initVue();

//HOME
vues.load.loading();
vues.load.menu();

socket.on('appReady',function(ready){
	if(ready === false) {
		vues.menu.display = false;
		vues.call.config();
	} 
	else vues.call.vpnList({});
});

//RESPONSE ROUTING
socket.on('res',function(res){
	console.log(res);
    if(res.module && res.action) {
		switch(res.module) {
            case 'config':
				handleConfig(res);
				break;
			case 'vpnList':
				handleVpnList(res);
				break;
			case 'vpnAdd':
				handleVpnAdd(res);
				break;
			case 'vpn':
				handleVpn(res);
				break;
			case 'ovpn':
				handleOvpn(res);
				break;
			case 'vpnControl':
				handleVpn(res);
				break;
			case 'subnetList':
				handleSubnetList(res);
				break;
			case 'subnetAdd':
				handleSubnetAdd(res);
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

function handleVpnList(res){
	switch(res.action){
		case 'load':
			vues.load.vpnList(res);
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

function handleVpn(res){
	if(res.Etarget) {
		switch(res.Etarget){
			case 'EDetails':
				$('#vpnList').trigger(res.Etarget,res);
				break;
			case 'EControl':
				$('#vpnList').trigger(res.Etarget,res);
				break;
		}
	}
}

function handleOvpn(res){
	switch(res.action) {
		case 'load':
			vues.load.ovpn(res);
			break;
		case 'update':
			vues.handle.ovpn(res);
			break;
	}
}

function handleSubnetList(res){
	switch(res.action){
		case 'load':
			vues.load.subnetList(res);
			break;
	}
}

function handleSubnetAdd(res){
	switch(res.action){
		case 'load':
			vues.load.subnetAdd(res);
			break;
		case 'add':
			vues.handle.subnetAdd(res);
			break;
	}
}