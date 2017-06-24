vues.call.vpn = function(which,Etarget){
	Etarget = Etarget || false;
	socket.emit('req',{module:'vpn',action:'load',which:which,Etarget:Etarget});
};

vues.load.vpn = function(res){
};