vues.call.ovpn = function(parent){
    socket.emit('req',{module:'ovpn',action:'load',parent:parent});
};

vues.load.ovpn = function(res) {
    main.cleanHTML();
	main.insertHTML(res.html);
    
	vues.ovpn = new Vue({
		el : '#ovpn',
		data : {
			errors : [],
			parent : res.ovpn.parent,
			configs : {
				remote : {
					title:'Remote server',
					name:'remote',
					placeholder:'vpn.remote-site.com',
					description:'Remote openvpn server\'s ip or hostname',
					value: res.ovpn.remote
				},
				port : {
					title:'Port',
					name:'port',
					placeholder:'1194',
					description:'Remote openvpn server\'s port',
					value: res.ovpn.port
				},
				proto : {
					title:'Protocol',
					name:'proto',
					placeholder:'tcp / udp',
					description:'Remote openvpn server\'s protocol',
					value: res.ovpn.proto
				},
				dev : {
					title:'Device type',
					name:'dev',
					placeholder:'tun / tap',
					description:'Remote openvpn server\'s device type',
					value: res.ovpn.dev
				},
				ping : {
					title:'Ping',
					name:'ping',
					placeholder:'10',
					description:'Ping frequency in seconds',
					value: res.ovpn.ping
				},
				verb : {
					title:'Logs verbosity',
					name:'verb',
					placeholder:'4',
					description:'Verbosity of logs on lxc container',
					value: res.ovpn.verb
				},
				mute : {
					title:'Logs mute',
					name:'mute',
					placeholder:'10',
					description:'Mute logs message after n occurence',
					value: res.ovpn.mute
				},
				cacert : {
					title:'Cacert',
					name:'cacert',
					placeholder:'',
					description:'CA Certificate',
					value: res.ovpn.cacert,
					type : 'text'
				},
				cert : {
					title:'Cert',
					name:'cert',
					placeholder:'',
					description:'Client certificate',
					value: res.ovpn.cert,
					type : 'text'
				},
				key : {
					title:'Key',
					name:'key',
					placeholder:'',
					description:'Client key',
					value: res.ovpn.key,
					type : 'text'
				},
				pull : {
					title:'Pull',
					name:'pull',
					placeholder:'',
					description:'Pull informations from server (routes for example)',
					value: res.ovpn.pull,
					type : 'checkbox'
				},
				tls : {
					title:'TLS',
					name:'tls',
					placeholder:'',
					description:'TLS encryption',
					value: res.ovpn.tls,
					type : 'checkbox'
				},
				comp : {
					title:'Comp LZO',
					name:'comp',
					placeholder:'',
					description:'LZO compression',
					value: res.ovpn.comp,
					type : 'checkbox'
				},
			},
		},
		methods : {
			update : function(){
				this.errors = [];
				req = {
					module:'ovpn',
					action:'update',
					parent:this.parent,
					_id:res._id,
					config:{
						remote:this.configs.remote.value,
						port:this.configs.port.value,
						proto:this.configs.proto.value,
						dev:this.configs.dev.value,
						ping:this.configs.ping.value,
						verb:this.configs.verb.value,
						mute:this.configs.mute.value,
						cacert:this.configs.cacert.value,
						cert:this.configs.cert.value,
						key:this.configs.key.value,
						pull:this.configs.pull.value,
						tls:this.configs.tls.value,
						comp:this.configs.comp.value,
					}
				};
				socket.emit('req',req);
			}
		}
	});
};

vues.handle.ovpn = function(res){
	if(res.error) {
		if(res.error.remote) vues.ovpn.errors.push('Remote server have to be set');
		if(res.error.port) vues.ovpn.errors.push('Server\'s port have to be set');
		if(res.error.proto) vues.ovpn.errors.push('Protocol have to be set');
		if(res.error.dev) vues.ovpn.errors.push('Device type have to be set');
		if(res.error.ping) vues.ovpn.errors.push('Ping have to be set');
		if(res.error.verb) vues.ovpn.errors.push('Verbosity level have to be set');
		if(res.error.mute) vues.ovpn.errors.push('Mute have to be set');
		if(res.error.cacert) vues.ovpn.errors.push('Cacert have to be set');
		if(res.error.cert) vues.ovpn.errors.push('Cert have to be set');
		if(res.error.key) vues.ovpn.errors.push('Key have to be set');
	} else if(res.success) vues.call.vpn({});
};
