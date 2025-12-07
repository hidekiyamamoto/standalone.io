var ModelInterface=function(name){this.virtual=false;
	this.name=name;this.display_name=name;this.attachments_mode='cascade';this.fields=[
		{name:'created',label:'Created',type:'date',nolabel:true},
		{name:'modified',label:'Modified',type:'date',nolabel:true},
		{name:'created_by',label:'Created by',type:'varchar'},
		{name:'modified_by',label:'Modified by',type:'varchar'},
		{name:'active',label:'Active',type:'boolean',/*widget:'toggle_button',widget_options:{setTrue:'Unarchive',setFalse:'Archive'},*/initial:true}
	];this.widgets={};this.views={'meta':'id: <!--JS{this.id}JS--><br/>Created <!--JS{this.created}JS--> by <!--JS{this.created_by}JS--> <br/>Modified <!--JS{this.modified}JS--> by <!--JS{this.modified_by}JS-->'};
};ModelInterface.prototype={
	get_field:function(k){for(let x in this.fields){if(this.fields[x].name==k){return this.fields[x]}}return false;},
	makenew:async function(_no_open,_overrides){
		let doc=await NEWDOO.storage.create(this.name,_overrides);
		if(!_no_open){NEWDOO.open_document(doc,NEWDOO.get_view(this.name,'form'),this.name)}
	},
	archive:async function(id){return NEWDOO.storage.deactivate(this.name,id);},
	unarchive:async function(id){return NEWDOO.storage.activate(this.name,id);},
	remove:async function(id){return NEWDOO.storage.remove(this.name,id);}
};
var AddonInterface=function(name){this.name=name;this.models=[];this.actions=[];this.menu=[];this.widgets={};this.init=false};
AddonInterface.prototype={
	addModel:function(model){this.models.push(model);},
	intall:function(){t},
	uninstall:function(){}
};
export {ModelInterface,AddonInterface};