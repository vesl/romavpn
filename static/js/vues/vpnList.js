vues.call.vpnList = function(which){
	vues.loading.message = 'Loading vpns';
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
				console.log(parent);
				vues.call.ovpn(parent);
			}
		}
	});
	vues.vpnList.vpns.forEach(function(vpn){
		vues.call.vpn({_id:vpn._id},'EDetails');	
	});
	$('#vpnList').on('EDetails',function(e,loaded){
		$.grep(vues.vpnList.vpns,function(vpn,index){
			if(loaded.which._id == vpn._id) vues.vpnList.vpns.splice(index,1,$.extend(vues.vpnList.vpns[index],loaded));
		});
	});
};