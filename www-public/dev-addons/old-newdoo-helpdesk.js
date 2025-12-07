import {AddonInterface,ModelInterface} from "./newdoo-addon.js";
const module_name='helpdesk';
var HELPDESK_TICKET=new ModelInterface(module_name+'_ticket');
	HELPDESK_TICKET.fields.push({name:'title',label:'Title',type:'varchar',initial:'string.empty'});
	HELPDESK_TICKET.fields.push({name:'description',label:'Description',type:'text',initial:'string.empty',nolabel:true,widget:'journal',formposition:'footer'});
	HELPDESK_TICKET.fields.push({name:'expected',label:'Expected',type:'date',edit_groups:['god']});
	HELPDESK_TICKET.fields.push({name:'status',label:'Status',type:'selection',selection:{'new':'New','interactive':'Informazioni mancanti','assigned':'Assegnato','testing1':'Prove in corso','closed':'Completato'},initial:'new',widget:'user_friendly_status'});
	HELPDESK_TICKET.fields.push({name:'tool',label:'Argomento',type:'selection',selection:{'computer':'Computer','email':'Mail e PEC','telefonia':'Telefonia','other':'Altro','software':'Programmi aziendali'},initial:'computer'});
	HELPDESK_TICKET.fields.push({name:'priority',label:'Priority',type:'selection',selection:{'low':'Bassa','mid':'Media','high':'Alta'},initial:'mid'});
	HELPDESK_TICKET.treeorder=['title','created','tool','status','priority','expected','modified'];
	HELPDESK_TICKET.treeorder_god=['created_by','title','created','tool','status','priority','expected','modified'];
	HELPDESK_TICKET.widgets.user_friendly_status=function(model_name,field_name,view_mode,editable){
		if(view_mode=='tree'){return "<!--JS{FIREDESK.models['helpdesk_ticket'].widgets._user_friendly_status(this[%ARRIDX%])}JS-->";}
		else{return FIREDESK.widgets.selection(model_name,field_name,view_mode,editable);}
	};HELPDESK_TICKET.widgets._user_friendly_status=function(doc){let s=doc.status
		if(s=='new'){return 'Nuovo'}if(s=='assigned'){return 'In lavorazione'}if(s=='testing1'){return 'In lavorazione'}
		if(s=='testing2'){return 'In lavorazione'}if(s=='closed'){return 'Completato'}if(s=='interactive'){return 'Info mancanti'}
		return s;
	};HELPDESK_TICKET.widgets.user_friendly_modified=function(model_name,field_name,view_mode,editable){
		if(view_mode=='tree'){return FIREDESK.widgets.date(model_name,field_name,view_mode,editable);}
		else{return "<!--JS{FIREDESK.models['helpdesk_ticket'].widgets._user_friendly_modified(this)}JS-->";}
	};HELPDESK_TICKET.widgets._user_friendly_modified=function(doc){
		return '<label style="font-weight:bold">'+FIREDESK.models.helpdesk_ticket.widgets._user_friendly_status(doc)+'</label>&nbsp;'+
		doc.modified_date.toLocaleString()+' - '+doc.modified_by;
	};
	HELPDESK_TICKET.formorder=['status','modified:user_friendly_modified','title','tool','priority','expected','description'];
/*	HELPDESK_TICKET.views.form=`<button onclick="FIREDESK.update_results('helpdesk_ticket');" class="btn btn-sm">&lt;&lt;--</button> <button JS-onclick="'X.HD.save_ticket()'" class="btn btn-sm">SALVA</button>
	<br/><br/><label>Stato</label><select id="hd-details-status-select" name="status" readonly="readonly" class="god_only form-control-sm">
		<option value="new">Nuovo</option>
		<option value="interactive">Informazioni mancanti</option>
		<option value="assigned">Assegnato</option>
		<option value="testing1">Prove in corso</option>
		<option value="closed">Completato</option>
	</select> <label style="font-weight:bold"><!--JS{FIREDESK.models.helpdesk_ticket.widgets._user_friendly_status(this)}JS--></label>&nbsp;<!--JS{this.modified.toLocaleString()}JS--> - <!--JS{this.modified_by}JS--> 
	<br/><label>Titolo:</label><input JS-value="this.title" type="text" placeholder="Title..." id="hd-details-title-input" class="form-control-sm"/>
	<label>Argomento:</label><select id="hd-details-tool-select" class="form-control-sm">
		<option value="computer">Computer</option>
		<option value="email">Mail e PEC</option>
		<option value="telefonia">Telefonia</option>
		<option value="other">Altro</option>
		<option value="software">Programmi aziendali</option>
	</select>
	<br/><label>Priorità:</label><select id="hd-details-priority-select" class="form-control-sm">
		<option value="low">Bassa</option><option value="mid">Media</option><option value="high">Alta</option>
	</select>
	<label>Prevista:</label><input class="god_only form-control-sm" id="hd-details-expected" JS-value="let x='';if(this.expected){x=this.expected.toISOString().split('T')[0];x}" type="date" readonly="readonly"/><!--JS{let x='';if(this.expected){x=this.modified.toTimeString()}x}JS-->
	<br/>
	<!--JS{FIREDESK.attachments_html(this.attachments);}JS-->
	<br/><textarea placeholder="Digita una nuova risposta..." style="width: 100%;" id="hd-details-reply-text" class="form-control-sm"></textarea><br/>
	<!--JS{this.description}JS-->
	<hr/><!--JS{this.created.toLocaleString()}JS--> - <!--JS{this.created_by}JS--> - Creato
	<!--LOAD{
		let S=it3.$$('hd-details-tool-select');
		for(let x=0;x<S.options.length;x++){if('<!--JS{this.tool}JS-->'==S.options[x].value){S.selectedIndex=x;break;}}
		S=it3.$$('hd-details-priority-select');
		for(let x=0;x<S.options.length;x++){if('<!--JS{this.priority}JS-->'==S.options[x].value){S.selectedIndex=x;break;}}
		S=it3.$$('hd-details-status-select');
		for(let x=0;x<S.options.length;x++){if('<!--JS{this.status}JS-->'==S.options[x].value){S.selectedIndex=x;break;}}
		setTimeout("document.querySelectorAll('.god_only').forEach(function(elm){elm.style.display='';elm.removeAttribute('readonly')});",500);
	}LOAD-->`;
*/
var addon=new AddonInterface(module_name);addon.models.push(HELPDESK_TICKET);
export {addon}
