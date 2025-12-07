import {AddonInterface,ModelInterface} from "./newdoo-addon.js";
const module_name='base';
var BASE_MODEL=new ModelInterface(module_name+'_model');
	BASE_MODEL.fields.push({name:'name',label:'Name',type:'varchar',initial:'string.empty'});
	//HELPDESK_TICKET.treeorder=['title','created','status','priority','expected','modified'];
	//HELPDESK_TICKET.treeorder_god=['created_by','title','created','status','priority','expected','modified'];
	BASE_MODEL.widgets.tree.user_friendly_status=function(view_mode,s){if(s=='new'){return 'Nuovo'}if(s=='assigned'){return 'In lavorazione'}
			if(s=='testing1'){return 'In lavorazione'}if(s=='testing2'){return 'In lavorazione'}
			if(s=='closed'){return 'Completato'}if(s=='interactive'){return 'Info mancanti'}
			return s;};
	BASE_MODEL.views.form=`<button onclick="NEWDOO.update_results('helpdesk_ticket');" class="btn btn-sm">&lt;&lt;--</button> <button JS-onclick="'X.HD.save_ticket()'" class="btn btn-sm">SALVA</button>
	<label>Titolo:</label><input JS-value="this.title" type="text" placeholder="Title..." id="hd-details-title-input" class="form-control-sm"/>`;

var BASE_ADDON=new AddonInterface(module_name+'_addon');
	BASE_ADDON.fields.push({name:'name',label:'Name',type:'varchar',initial:'string.empty'});
	BASE_ADDON.fields.push({name:'installed',label:'Installed',type:'boolean',initial:false,widget:''});
	BASE_ADDON.fields.push({name:'description',label:'Installed',type:'boolean',initial:false,widget:'html'});
	//HELPDESK_TICKET.treeorder=['title','created','status','priority','expected','modified'];
	//HELPDESK_TICKET.treeorder_god=['created_by','title','created','status','priority','expected','modified'];
	BASE_ADDON.widgets.tree.user_friendly_status=function(view_mode,s){
		
	};
	BASE_MODEL.views.form=`<button onclick="NEWDOO.update_results('helpdesk_ticket');" class="btn btn-sm">&lt;&lt;--</button> <button JS-onclick="'X.HD.save_ticket()'" class="btn btn-sm">SALVA</button>
	<label>Titolo:</label><input JS-value="this.title" type="text" placeholder="Title..." id="hd-details-title-input" class="form-control-sm"/>`;
	
var BASE_STORAGEENGINE=new ModelInterface(module_name+'_storageengine');
	BASE_STORAGEENGINE.fields.push({name:'name',label:'Name',type:'varchar',initial:'string.empty'});
	BASE_STORAGEENGINE.fields.push({name:'installed',label:'Installed',type:'boolean',initial:false});
	BASE_STORAGEENGINE.fields.push({name:'code',label:'Installed',type:'text',initial:false});
	BASE_STORAGEENGINE.fields.push({name:'description',label:'Installed',type:'boolean',initial:false,widget:'html'});
	
var BASE_STORAGECONFIG=new ModelInterface(module_name+'_storageconfig');
	BASE_STORAGECONFIG.fields.push({name:'name',label:'Name',type:'varchar',initial:'string.empty'});
	BASE_STORAGECONFIG.fields.push({name:'type',label:'Type',type:'boolean',initial:false,widget:''});
	BASE_STORAGECONFIG.fields.push({name:'description',label:'Installed',type:'boolean',initial:false,widget:'html'});

var addon=new AddonInterface(module_name);
addon.addModel(BASE_STORAGEENGINE);
addon.addModel(BASE_STORAGECONFIG);
export {addon}