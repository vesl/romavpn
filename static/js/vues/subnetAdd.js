vues.call.subnetAdd = function(parent){
    socket.emit('req',{module:'subnetAdd',action:'load',parent:parent});
};

vues.load.subnetAdd = function(res) {
    main.cleanHTML();
	main.insertHTML(res.html);
	vues.subnetAdd = new Vue({
		el: '#subnetAdd',
		data : {
			errors : [],
			parent : res.parent,
			subnet_name : '',
			subnet_network : '',
			subnet_netmap : '',
			subnet_netmask : '',
			isNetmap : false,
		},
		methods : {
			add : function(){
				vues.loading.message = "Creating Subnet and storing it on database";
				vues.loading.enable = true;
				this.errors=[];
				socket.emit('req',{
					module:'subnetAdd',
					action:'add',
					parent:this.parent,
					subnet_name : this.subnet_name,
					subnet_network : this.subnet_network,
					subnet_netmask : this.subnet_netmask,
					subnet_netmap : this.subnet_netmap,
				});
			}
		}
	});
};

vues.handle.subnetAdd = function(res){
	vues.loading.enable = false;
	if(res.error) {
		if(res.error.validationError){
			if(res.error.validationError.alreadyExists) vues.subnetAdd.errors.push('This subnet already exists');
		}
		if(res.error.err) vues.subneAdd.errors.push('Couldnt create LXC container');
	} else vues.call.subnetList(res.parent);
};
