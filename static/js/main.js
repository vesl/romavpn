const main = {};

main.initVue = function(){
	main.vue = new Vue({
		el : '#main',
		data : {
			actions : '',
			create : '',
			content : 'Loading content.',
		},
		methods : {
			createClick : false,
		}
	});
};

main.cleanVue = function(){
	main.vue.actions = '';
	main.vue.create = '';
	main.vue.content = 'Loading content.';
	main.vue.createClick = false;
};

main.html = function(html,name,uniq){
	uniq = uniq || false;
	if (main.vue.content == 'Loading content.') main.vue.content = '';
	if(uniq == true) $('#'+name).remove();
	$('#main').append($('<div>').attr('id',name).append(html));
};