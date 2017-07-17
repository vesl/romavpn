vues.call.vpnList = function(which){
	which = which || {};
	socket.emit('req',{module:'vpnList',action:'load',which:which});
};

vues.load.vpnList = function(res){
	main.cleanHTML();
	main.insertHTML(res.html);
	vues.vpnList = new Vue({
		el: '#vpnList',
		data : {
			novpn : 'There is no VPN configured yet',
			vpns : res.vpns,
		},
		methods : {
			callAddVpn : function(){
				vues.call.vpnAdd();
			},
			callEditOvpn : function(parent){
				vues.call.ovpn(parent);
			},
			controlVpn : function(id,action){
				vues.call.vpnControl(id,action);
			},
			callSubnetList : function(parent){
				vues.call.subnetList(parent);
			}
		}
	});
	vues.vpnList.vpns.forEach(function(vpn){
		vues.call.vpn({_id:vpn._id},'EDetails');	
	});
	$('#vpnList').on('EDetails',function(e,loaded){
		$.grep(vues.vpnList.vpns,function(vpn,index){
			if(loaded.which._id == vpn._id) Vue.set(vues.vpnList.vpns,index,$.extend(vues.vpnList.vpns[index],loaded));
		});
	});
	$('#vpnList').on('EControl',function(e,control){
		$.grep(vues.vpnList.vpns,function(vpn,index){
			if(control.which._id == vpn._id) Vue.set(vues.vpnList.vpns,index,$.extend(vues.vpnList.vpns[index],control));
		});
	});
};