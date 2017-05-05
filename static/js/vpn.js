const vpn = {};

vpn.handleSocket = function(res) {
	if(res.action=='list' && res.target == 'main') vpn.main.list(res.vpns);
};

vpn.main = {};

vpn.main.actions = function(){
	main.vue.actions = true;
	main.vue.create = 'Create a VPN';
	main.vue.createClick = function(){
		vpn.main.add();
	};	
};

vpn.main.list = function(vpns) {
	main.cleanVue();
	vpn.main.actions();
	if(vpns.length == 0) main.vue.content = 'No VPN created yet click on the button above to start.';
};

vpn.main.add = function(){
	main.cleanVue();
	main.vue.content = 'Add a VPN client (openvpn only at the moment)';
	vpn.main.actions();
	vpn_form = new form();
	vpn_form.label({
		for_: 'vpn-add-name',
		childContent:'Name'
	});
	vpn_form.input({
		type: 'text',
		placeholder: 'enter the vpn name',
		name: 'vpn-add-name',
	});
	vpn_form.button({
		class: 'button button-primary',
		childContent: 'Create',
		click : function(){
			socket.emit('request',{
				module:'vpn',
				action:'create',
				name:$('input[name=vpn-add-name').value
			});
		}
	});
	main.html(vpn_form.form,'form-add-vpn',true);
};