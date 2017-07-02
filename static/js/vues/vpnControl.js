vues.call.vpnControl = function(id,action){
	socket.emit('req',{module:'vpnControl',action:action,which:{_id:id},Etarget:'EControl'});
};

vues.load.vpnControl = function(res){
};