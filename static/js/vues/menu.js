vues.load.menu = function(){
	vues.menu = new Vue({
		el : '#menu',
		data : {
			display: true,
			buttons : ['vpnList','subnets','hosts','config']
		},
		methods : {
			call : function(module){
				vues.call[module]();
			}
		}
	});
};