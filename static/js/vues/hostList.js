vues.call.hostList = function(parent){
    socket.emit('req',{module:'hostList',action:'load',parent:parent});
};

vues.load.hostList = function(res) {
    main.cleanHTML();
	main.insertHTML(res.html);
	vues.hostList = new Vue({
		el: '#hostList',
		data : {
			nohost: 'There is no HOST configured yet',
			hosts : res.hosts,
			parent : res.parent,
		},
		methods : {
			callAddHost : function(parent){
				vues.call.hostAdd(parent);
			},
		}
	});
};

vues.handle.hostList = function(res){
	if(res.error) {

	} else {

    }
};
