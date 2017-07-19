vues.call.hostAdd = function(parent){
    socket.emit('req',{module:'hostAdd',action:'load',parent:parent});
};

vues.load.hostAdd = function(res) {
    main.cleanHTML();
	main.insertHTML(res.html);
	vues.hostAdd = new Vue({
		el: '#hostAdd',
		data : {
			errors : [],
			parent : res.parent,
			host_name : '',
			host_ip : '',
		},
		methods : {
			add : function(){
				vues.loading.message = "Creating Host and storing in database";
				vues.loading.enable = true;
				this.errors=[];
				socket.emit('req',{
					module:'hostAdd',
					action:'add',
					parent:this.parent,
					host_name : this.host_name,
					host_ip : this.host_ip,
				});
			}
		}
	});
};

vues.handle.hostAdd = function(res){
	vues.loading.enable = false;
	if(res.error) {
		if(res.error.hostNotSaved) vues.hostAdd.errors.push('Name and ip should be unique');
		if(res.error.unableToBookIp) {
			if(res.error.unableToBookIp.invalidIp) vues.hostAdd.errors.push('Invalid ip');
			if(res.error.unableToBookIp.ipNotInSubnet) vues.hostAdd.errors.push('ip not in subnet');	
		}
	} else vues.call.hostList(res.parent);
};
