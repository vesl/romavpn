var vues = {};

//1 Load - Create vue

vues.load = {};

vues.load.menu = function(){
	vues.menu = new Vue({
		el : '#menu',
		data : {
			display:false,
			buttons : ['VPNS','SUBNETS','HOSTS','CONFIGURATION']
		}
	});
}

vues.load.configuration = function(template) {
	main.insertHTML(template.html);
	vues.configuration = new Vue({
		el : '#configuration',
		data : {
			message : 'You need to configure application before use it',
			errors : [],
			configurations : {
				app_path : {
					title:'Application path',
					name:'app_path',
					placeholder:'/var/www',
					description:'Path to folder romavpn',
					value:''
				},
				vpn_network : {
					title:'VPNs network',
					name:'vpn_network',
					placeholder:'10.1.0.0',
					description:'Network to connect all VPN to RomaVPN',
					value:''
				},
				vpn_netmask : {
					title:'VPNs netmask',
					name:'vpn_netmask',
					placeholder:'255.255.255.0',
					description:'Netmask of VPNs network',
					value:''
				},
				vpn_gateway : {
					title:'VPNs gateway',
					name:'vpn_gateway',
					placeholder:'10.1.0.254',
					description:'Gateway to connect all VPN to remote VPN servers',
					value:''
				},
				vpn_dns : {
					title:'VPNs DNS',
					name:'vpn_dns',
					placeholder:'8.8.8.8',
					description:'DNS to resolve remote VPN servers names',
					value:''
				}
			}
		},
		methods : {
			sendConfiguration : function(){
				this.errors = [];
				socket.emit('req',{
					module:'config',
					action:'create',
					config:{
						app_path:this.configurations.app_path.value,
						vpn_network:this.configurations.vpn_network.value,
						vpn_netmask:this.configurations.vpn_netmask.value,
						vpn_gateway:this.configurations.vpn_gateway.value,
						vpn_dns:this.configurations.vpn_dns.value,
					}
				});
			}
		}
	});
};

//2 Handle - Once client did action, handle response from server

vues.handle = {};

vues.handle.configuration = function(res){
	if(res.error) {
		vue = vues.configuration;
		if(res.error.appPath) vue.errors.push('Application path must be set and path have to exists on the server');
		if(res.error.vpnNetwork) vue.errors.push('VPN network must be set');
		if(res.error.vpnNetmask) vue.errors.push('VPN netmask must be set');
		if(res.error.vpnGateway) vue.errors.push('VPN gateway must be set (ip of br0)');
		if(res.error.vpnDns) vue.errors.push('VPN DNS must be set');
		if(res.error.invalidSubnet) vue.errors.push('Couple network / netmask is a wrong subnet');
		if(res.error.subnetNotSaved) vue.errors.push('Database error subnet not saved');
		if(res.error.configNotSaved) vue.errors.push('Database error config not saved');
	}
};