vues.call.subnetList = function(parent){
    socket.emit('req',{module:'subnetList',action:'load',parent:parent});
};

vues.load.subnetList = function(res) {
    main.cleanHTML();
	main.insertHTML(res.html);
	vues.subnetList = new Vue({
		el: '#subnetList',
		data : {
			nosubnet: 'There is no SUBNET configured yet',
			subnets : res.subnets,
			parent : res.parent,
		},
		methods : {
			callAddSubnet : function(parent){
				vues.call.subnetAdd(parent);
			},
			callHostList : function(name){
				vues.call.hostList(name);
			}
		}
	});
};

vues.handle.subnetList = function(res){
	if(res.error) {

	} else {

    }
};
