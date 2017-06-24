vues.call.ovpn = function(){
    socket.emit('req',{module:'ovpn',action:'load'});
};

vues.load.ovpn = function(res) {
    main.cleanHTML();
	main.insertHTML(res.html);
    
	vues.ovpn = new Vue({
		el : '#ovpn',
		data : {
			errors : [],
			config : {
				remote : {
					title:'Remote server',
					name:'remote',
					placeholder:'x.x.x.x',
					description:'Remote openvpn server\'s ip',
					value: res.ovpn.remote
				},
			},
		},
		methods : {
			update : function(){
				this.errors = [];
				socket.emit('req',{
					module:'ovpn',
					action:'update',
					which:'test',
					config:{
						remote:this.ovpn.config.remote
					}
				});
			}
		}
	});
};

vues.handle.config = function(res){
	if(res.error) {
		if(res.error.remote) vues.ovpn.errors.push('Remote server have to be set');
	} else if(res.success){
		vues.menu.display = true;
        vues.call.ovpn({});
    }
};
