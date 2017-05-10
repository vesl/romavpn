const alerts = {};

alerts.initVue = function(){
	alerts.vue = new Vue({
		el : '#alerts',
		data : {
			type : '',
			alert : '',
			n : '',
			more : '',
			error : false,
			info : false,
			module : false,
		}
	});
}

alerts.handle = function(o){
	
	if (o.type == 'ERROR') {
		alerts.vue.type = 'Error',
		alerts.vue.number = o.n,
		alerts.vue.error = true;
	} else if (o.type == 'INFO') {
		alerts.vue.type = 'Info',
		alerts.vue.info = true;
	}
	alerts.vue.module = o.module;
	alerts.vue.alert = o.message;
	console.log(o);

	setTimeout(function(){
		alerts.vue.alert='';
		alerts.vue.number = '',
		alerts.vue.type = '',
		alerts.vue.info=false;
		alerts.vue.error=false;
		alerts.vue.module = '';
		alerts.vue.alert = '';
	},3000);
};