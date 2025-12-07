import {AddonInterface,ModelInterface} from "../newdoo-addon.js";
const module_name='website';
var FRAGMENT=new ModelInterface(module_name+'_fragment');FRAGMENT.attachments_mode=false;
	FRAGMENT.fields.push({name:'group',label:'Group',type:'varchar',initial:'string.empty'});
	FRAGMENT.fields.push({name:'lang',label:'Language',type:'selection',selection:{'eng':'eng','ita':'ita','deu':'deu','fra':'fra','spa':'spa'}});
	FRAGMENT.fields.push({name:'fragmentid',label:'id',type:'varchar',compute:'compute_id'});
	FRAGMENT.fields.push({name:'content',label:'Content',type:'text',initial:'string.empty',widget:'content',save_fn:'content_save',formposition:'tab-Content',nolabel:true});
	FRAGMENT.fields.push({name:'preview',label:'Content',type:'text',compute:'compute_preview',initial:'string.empty',formposition:'none',nolabel:true});
	FRAGMENT.fields.push({name:'size',label:'Size',type:'text',compute:'compute_size',initial:'string.empty',formposition:'none',nolabel:true});
	FRAGMENT.compute_id=function(doc){return doc.id};
	FRAGMENT.compute_size=function(doc){if(!doc.content){return 0}if(doc.content.length){return doc.content.length;}else{return typeof doc.content}};
	FRAGMENT.compute_preview=function(doc){if(!doc.content){return 0}if(doc.content.length){
		if(doc.content.length>92){return NEWDOO.UTILS.htmlentities(doc.content.substr(0,92))+'...[...]';}
		else{return NEWDOO.UTILS.htmlentities(doc.content);}}else{return doc.content}};
	FRAGMENT.get_display_name=function(doc){return doc.group+doc.lang};
	FRAGMENT.treeorder=['group','lang','fragmentid','preview','size','modified','modified_by'];
	FRAGMENT.formorder=['group','lang','fragmentid','content'];

var FRAGMENT_GROUP=new ModelInterface(module_name+'_fragment_group');FRAGMENT_GROUP.attachments_mode=false;FRAGMENT_GROUP.virtual=true;
	FRAGMENT_GROUP.fields.push({name:'group',label:'Group',type:'varchar',readonly:true,initial:'string.empty'});
	FRAGMENT_GROUP.fields.push({name:'fragments',label:'Fragments',type:'one2many',comodel:'website_page',column1:'group',compute:"get_fragments",formposition:'tab-pages',ondelete:'setnull'});
	FRAGMENT_GROUP.get_fragments=async function(doc){if(!doc.group){return []}
		return await NEWDOO.storage.query('website_fragment',['group','==',doc.group]);
	};
	FRAGMENT_GROUP.get_display_name=function(doc){return doc.group};
	FRAGMENT_GROUP.treeorder=['group','modified','modified_by'];
	FRAGMENT_GROUP.formorder=['group','fragments'];
	
var SITE=new ModelInterface(module_name+'_site');
	SITE.attachments_mode=false;
	SITE.fields.push({name:'title',label:'Title',type:'varchar',initial:'string.empty'});
	SITE.fields.push({name:'bindings',label:'Bindings',type:'varchar',initial:'string.empty'});
	SITE.fields.push({name:'head',label:'head',type:'text',initial:'string.empty',formposition:'tab-head',nolabel:true});
	SITE.fields.push({name:'header',label:'header',type:'text',initial:'string.empty',widget:'content',save_fn:'content_save',formposition:'tab-header',nolabel:true});
	SITE.fields.push({name:'footer',label:'footer',type:'text',initial:'string.empty',widget:'content',save_fn:'content_save',formposition:'tab-footer',nolabel:true});
	SITE.fields.push({name:'pages',label:'Pages',type:'one2many',comodel:'website_page',column1:'site',formposition:'tab-pages',ondelete:'setnull'});
	/**/
	SITE.treeorder=['title','bindings','modified','modified_by'];
	SITE.formorder=['title','bindings','head','header','footer','pages'];

var PAGE=new ModelInterface(module_name+'_page');
	PAGE.attachments_mode=false;
	PAGE.fields.push({name:'name',label:'Name',type:'varchar',formposition:'main'});
	PAGE.fields.push({name:'site',label:'Site',type:'many2one',comodel:'website_site'});
	PAGE.fields.push({name:'url',label:'Url',type:'varchar'});
	PAGE.fields.push({name:'use_header',label:'Use Header',type:'boolean'});
	PAGE.fields.push({name:'use_footer',label:'Use Footer',type:'boolean'});
	PAGE.fields.push({name:'structure',label:'Structure',type:'text',initial:'string.empty',widget:'content',save_fn:'content_save',formposition:'tab-Structure',nolabel:true});
	PAGE.treeorder=['name','site','url','use_header','use_footer','modified','modified_by'];
	PAGE.formorder=['name','site','url','use_header','use_footer','structure'];
	
var POST=new ModelInterface(module_name+'_post');
	POST.attachments_mode=false;
	POST.no_attachments=true;
	POST.fields.push({name:'name',label:'Name',type:'varchar',formposition:'main'});
	POST.fields.push({name:'group',label:'Site',type:'varchar'});	
	POST.fields.push({name:'languages',label:'Language',type:'one2many',comodel:'website_post_language',column1:'post',formposition:'tab-Languages'});
	//POST.fields.push({name:'structure',label:'Structure',type:'text',initial:'string.empty',formposition:'tab-Structure',nolabel:true});
	POST.treeorder=['group','name','modified','modified_by'];
	POST.formorder=['group','name','languages'];
	

var POST_LANGUAGE=new ModelInterface(module_name+'_post_language');
	POST_LANGUAGE.attachments_mode=false;
	POST_LANGUAGE.fields.push({name:'post',label:'Post',type:'many2one',comodel:'website_post',formposition:'main',readonly:true});
	POST_LANGUAGE.fields.push({name:'lang',label:'Language',type:'selection',selection:{'eng':'eng','ita':'ita','deu':'deu','fra':'fra','spa':'spa'}});
	POST_LANGUAGE.fields.push({name:'url',label:'SEO Url',type:'varchar'});
	//POST_LANGUAGE.fields.push({name:'tab_title',label:'Tab Title',type:'varchar',initial:'string.empty'});
	POST_LANGUAGE.treeorder=['post','lang','url','modified','modified_by'];
	POST_LANGUAGE.formorder=['post','lang','url'];
	
export {FRAGMENT,SITE,PAGE,FRAGMENT_GROUP,POST,POST_LANGUAGE}
