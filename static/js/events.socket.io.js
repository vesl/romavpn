window.onload = function(){

socket = io();
alerts.initVue();

//HOME
vues.load.menu();
vues.call.vpn.list();

//RESPONSE ROUTING
socket.on('res',function(res){
	console.log(res);
	if(res.AppNotReady) {
        vues.menu.display = false;
        main.AppNotReady = true;
        vues.call.config();
    } else {
        if(main.AppNotReady)handleConfig(res);
        else if(res.module && res.action) {
			switch(res.module) {
                case 'config':
					handleConfig(res);
					break;
			}
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
		case 'update':
			vues.handle.config(res);
			break;
	}
}