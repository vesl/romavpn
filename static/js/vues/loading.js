vues.load.loading = function(){
	vues.loading = new Vue({
		el : '#loading',
		data : {
			message : 'Loading',
			enable : false
		}
	});
};