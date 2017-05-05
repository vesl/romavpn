function form(){
	this.form = $('<p>');
};

form.prototype.setattr = function(elem,o){
	forbid = ['childContent','click'];
	$.each(o,function(i,v){
		if(forbid.indexOf(i) == -1){
			attr = {}
			attr[i] = v;
			elem.attr(attr);
		}
	});
};

form.prototype.label = function(o){
	label = $('<label>');
	this.setattr(label,o);
	label.append(o.childContent);
	this.form.append(label);
};

form.prototype.input = function(o){
	input = $('<input>');
	this.setattr(input,o);
	this.form.append(input);
};

form.prototype.button = function(o){
	button = $('<button>');
	this.setattr(button,o);
	button.click(function(){
		o.click();
	});
	button.append(o.childContent);
	p = $('<p>');
	p.append(button);
	this.form.append(p);
};