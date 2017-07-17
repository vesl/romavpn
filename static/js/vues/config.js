vues.call.config = function(){
    socket.emit('req',{module:'config',action:'load'});
};

vues.load.config = function(res) {
    main.cleanHTML();
	main.insertHTML(res.html);
    
	vues.config = new Vue({
		el : '#config',
		data : {
			errors : [],
			configs : {
				app_path : {
					title:'Application path',
					name:'app_path',
					placeholder:'/var/www',
					description:'Path to folder romavpn',
					value: res.config.app_path
				},
				vpn_network : {
					title:'VPNs network',
					name:'vpn_network',
					placeholder:'10.1.0.0',
					description:'Network to connect all VPN to RomaVPN',
					value: res.config.vpn_network
				},
				vpn_netmask : {
					title:'VPNs netmask',
					name:'vpn_netmask',
					placeholder:'255.255.255.0',
					description:'Netmask of VPNs network',
					value: res.config.vpn_netmask
				},
				vpn_gateway : {
					title:'VPNs gateway',
					name:'vpn_gateway',
					placeholder:'10.1.0.254',
					description:'Gateway to connect all VPN to remote VPN servers',
					value: res.config.vpn_gateway
				},
				vpn_dns : {
					title:'VPNs DNS',
					name:'vpn_dns',
					placeholder:'8.8.8.8',
					description:'DNS to resolve remote VPN servers names',
					value: res.config.vpn_dns
				},
			}
		},
		methods : {
			update : function(){
				req = {
					module:'config',
					action:'update',
					_id:res.config._id,
					config: {
						app_path:this.configs.app_path.value,
						vpn_network:this.configs.vpn_network.value,
						vpn_netmask:this.configs.vpn_netmask.value,
						vpn_gateway:this.configs.vpn_gateway.value,
						vpn_dns:this.configs.vpn_dns.value,
					}
				};
				this.errors = [];
				socket.emit('req',req);
			}
		}
	});
};

vues.handle.config = function(res){
	if(res.error) {
		if(res.error.appPath) vues.config.errors.push('Application path must be set and path have to exists on the server');
		if(res.error.vpnNetwork) vues.config.errors.push('VPN network must be set');
		if(res.error.vpnNetmask) vues.config.errors.push('VPN netmask must be set');
		if(res.error.vpnGateway) vues.config.errors.push('VPN gateway must be set (ip of br0)');
		if(res.error.vpnDns) vues.config.errors.push('VPN DNS must be set');
		if(res.error.invalidSubnet) vues.config.errors.push('Couple network / netmask is a wrong subnet');
		if(res.error.subnetNotSaved) vues.config.errors.push('Database error subnet not saved');
		if(res.error.configNotSaved) vues.config.errors.push('Database error config not saved');
	} else {
		vues.menu.display = true;
        vues.call.vpnList({});
    }
};
