import {ModelInterface} from "../newdoo-addon.js";
const module_name='helpdesk';
var HELPDESK_TICKET=new ModelInterface(module_name+'_ticket');
	HELPDESK_TICKET.fields.push({name:'title',label:'Title',type:'varchar',initial:'string.empty'});
	HELPDESK_TICKET.fields.push({name:'description',label:'Description',type:'text',initial:'string.empty',nolabel:true,widget:'ticketjournal',formposition:'footer'});
	HELPDESK_TICKET.fields.push({name:'expected',label:'Expected',type:'date',edit_groups:['god']});
	HELPDESK_TICKET.fields.push({name:'status',label:'Status',type:'selection',selection:{'new':'New','interactive':'Informazioni mancanti','assigned':'Assegnato','testing1':'Prove in corso','closed':'Completato'},initial:'new',widget:'user_friendly_status'});
	HELPDESK_TICKET.fields.push({name:'tool',label:'Argomento',type:'selection',selection:{'computer':'Computer','email':'Mail e PEC','telefonia':'Telefonia','other':'Altro','software':'Programmi aziendali'},initial:'computer'});
	HELPDESK_TICKET.fields.push({name:'priority',label:'Priority',type:'selection',selection:{'low':'Bassa','mid':'Media','high':'Alta'},initial:'mid'});
	HELPDESK_TICKET.formorder=['status','modified:user_friendly_modified','title','tool','priority','expected','description'];
	HELPDESK_TICKET.treeorder=['title','created','tool','status','priority','expected','modified'];
	HELPDESK_TICKET.treeorder_god=['created_by','title','created','tool','status','priority','expected','modified'];
	HELPDESK_TICKET.widgets.user_friendly_status=function(model_name,field_name,view_mode,editable){
		if(view_mode=='tree'){return "<!--OO{NEWDOO.models['helpdesk_ticket'].widgets._user_friendly_status(this[%ARRIDX%])}OO-->";}
		else{return NEWDOO.widgets.selection(model_name,field_name,view_mode,editable);}
	};HELPDESK_TICKET.widgets._user_friendly_status=function(doc){let s=doc.status
		if(s=='new'){return 'Nuovo'}if(s=='assigned'){return 'In lavorazione'}if(s=='testing1'){return 'In lavorazione'}
		if(s=='testing2'){return 'In lavorazione'}if(s=='closed'){return 'Completato'}if(s=='interactive'){return 'Info mancanti'}
		return s;
	};HELPDESK_TICKET.widgets.user_friendly_modified=function(model_name,field_name,view_mode,editable){
		if(view_mode=='tree'){return NEWDOO.widgets.date(model_name,field_name,view_mode,editable);}
		else{return "<!--OO{NEWDOO.models['helpdesk_ticket'].widgets._user_friendly_modified(this)}OO-->";}
	};HELPDESK_TICKET.widgets._user_friendly_modified=function(doc){
		return '<label style="font-weight:bold">'+NEWDOO.models.helpdesk_ticket.widgets._user_friendly_status(doc)+'</label>&nbsp;'+
		doc.modified.toLocaleString()+' - '+doc.modified_by;
	};
	HELPDESK_TICKET.widgets.ticketjournal=function(model_name,field_name,view_mode,editable,value){let out=false;
		if(editable){out='<hr/>Non inserire <b>MAI</b> due attività (ad esempio per due utenti) nella stessa richiesta.<br/><textarea name="'+field_name+'" placeholder="Digita una nuova risposta..." id="hd-details-reply-text" class="form-control-sm"></textarea>';}
		if(view_mode=='form'){out=out+'<!--OO{this.'+field_name+'}OO--><hr/><!--OO{this.created.toLocaleString()}OO--> - <!--OO{this.created_by}OO--> - Creato';}
		else{out=out+'<!--OO{this[%ARRIDX%].'+field_name+'}OO--><hr/><!--OO{this[%ARRIDX%].created.toLocaleString()}OO--> - <!--OO{this[%ARRIDX%].created_by}OO--> - Creato';}
		return out;
	};
export {HELPDESK_TICKET}
