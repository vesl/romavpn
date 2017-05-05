window.onload = function(){

socket = io();
main.initVue();
alerts.initVue();

//HOME
const req = {module:'vpn',action:'list',which:{},target:'main'};
socket.emit('request',req);

//RESPONSE ROUTING
socket.on('response',function(res){
	console.log(res);
	if(res.module == 'vpn') vpn.handleSocket(res);
});

socket.on('e',function(res){
	alerts.handle(res);
});

}