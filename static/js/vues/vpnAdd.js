vues.call.vpnAdd = function(){
	socket.emit('req',{module:'vpnAdd',action:'load'});
};

vues.load.vpnAdd = function(res){
	main.cleanHTML();
	main.insertHTML(res.html);

	vues.vpnAdd = new Vue({
		el: '#vpnAdd',
		data : {
			errors:[],
			vpn_name : ''
		},
		methods : {
			add : function(){
				vues.loading.message = "Creating VPN and storing it on database"
				vues.loading.enable = true;
				this.errors=[];
				socket.emit('req',{
					module:'vpnAdd',
					action:'add',
					vpn_name: this.vpn_name
				});
			}
		}
	});
};

vues.handle.vpnAdd = function(res){
	vues.loading.enable = false;
	if(res.error) {
		if(res.error.validationError){
			if(res.error.validationError.alreadyExists) vues.vpnAdd.errors.push('This VPN already exists');
		}
		if(res.error.lxcNotSaved){
			if(res.error.lxcNotSaved.lxcNotCreated) vues.vpnAdd.errors.push('Couldnt create LXC container');
			vues.vpnAdd.errors.push('Couldnt save LXC container');
		}
		if(res.error.vpnNotSaved) vues.vpnAdd.errors.push('Couldnt save VPN');
	} else vues.call.vpnList({});
};

