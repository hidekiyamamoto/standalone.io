var ModelInterface=function(name){
	this.name=name;this.no_attachments=false;this.fields=[
		{name:'created',label:'Created',type:'date',nolabel:true},
		{name:'modified',label:'Modified',type:'date',nolabel:true},
		{name:'created_by',label:'Created by',type:'varchar'},
		{name:'modified_by',label:'Modified by',type:'varchar'},
		{name:'active',label:'Active',type:'boolean',/*widget:'toggle_button',widget_options:{setTrue:'Unarchive',setFalse:'Archive'},*/initial:true}
	];this.widgets={};this.views={'meta':'id: <!--JS{this.id}JS--><br/>Created <!--JS{this.created}JS--> by <!--JS{this.created_by}JS--> <br/>Modified <!--JS{this.modified}JS--> by <!--JS{this.modified_by}JS-->'};
};ModelInterface.prototype={
	makenew:async function(_no_open,_overrides){
		let doc={created:new Date(),modified:new Date(),created_by:window.EMAIL,modified_by:window.EMAIL,active:true}
		for(let f=0;f<this.fields.length;f++){
			if(!doc[this.fields[f].name]){
				if(this.fields[f].initial){let i='';if(this.fields[f].initial=='string.empty'){i=''}else{i=this.fields[f].initial;}
					if(typeof i=='function'){doc[this.fields[f].name]=i(doc);}
					else if(i.indexOf){if(i.indexOf('JS!')==0){
						doc[this.fields[f].name]=eval(i.replace('JS!',''));;
					}	}
					if(!doc[this.fields[f].name]){doc[this.fields[f].name]=i;}
		}	}	}
		for(let k in _overrides){doc[k]=_overrides[k];}
		doc=await FIREDESK.writeDocument(this.name,doc);
		if(!_no_open){FIREDESK.open_document(doc,FIREDESK.get_view(this.name,'form'),this.name)}
	},
	get_field:function(k){for(let x in this.fields){if(this.fields[x].name==k){return this.fields[x]}}return false;},
	archive:async function(id){return FIREDESK.setInactive(this.name,id);},
	unarchive:async function(id){return FIREDESK.setActive(this.name,id);},
	remove:async function(id){return FIREDESK.deleteDocument(this.name,id);}
};
var AddonInterface=function(name){this.name=name;this.models=[];};
AddonInterface.prototype={
	install:function(){
		console.log('installed');
	},
	uninstall:function(){
		console.log('uninstalled');
	}
};
export {ModelInterface,AddonInterface};