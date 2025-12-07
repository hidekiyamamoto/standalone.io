// Import the functions you need from the SDKs you need
import { getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries 
import {getDatabase, ref as refRT,onChildAdded,get as getRT,set as setRT} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";
import {getStorage,ref as refST,uploadBytes,getDownloadURL,deleteObject} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-storage.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-firestore.js";
const provider = new GoogleAuthProvider();
var app=false;
var auth = false;
var analytics=false;var multisourcemode=true;
import {STORAGE_FIREBASE} from "./addons/storage-firebase.js";
import {STORAGE_LOCAL} from "./addons/storage-local.js";
import {it4} from "./it4.js";
const all_htmlentities={/*" ":"&nbsp;",*/
	"'":"&apos;","<":"&lt;",">":"&gt;","¡":"&iexcl;","¢":"&cent;","£":"&pound;","¤":"&curren;","¥":"&yen;","¦":"&brvbar;","§":"&sect;",
	"¨":"&uml;","©":"&copy;","ª":"&ordf;","«":"&laquo;","¬":"&not;","®":"&reg;","¯":"&macr;","°":"&deg;","±":"&plusmn;","²":"&sup2;","³":"&sup3;",
	"´":"&acute;","µ":"&micro;","¶":"&para;","·":"&middot;","¸":"&cedil;","¹":"&sup1;","º":"&ordm;","»":"&raquo;","¼":"&frac14;","½":"&frac12;",
	"¾":"&frac34;","¿":"&iquest;","À":"&Agrave;","Á":"&Aacute;","Â":"&Acirc;","Ã":"&Atilde;","Ä":"&Auml;","Å":"&Aring;","Æ":"&AElig;","Ç":"&Ccedil;",
	"È":"&Egrave;","É":"&Eacute;","Ê":"&Ecirc;","Ë":"&Euml;","Ì":"&Igrave;","Í":"&Iacute;","Î":"&Icirc;","Ï":"&Iuml;","Ð":"&ETH;","Ñ":"&Ntilde;",
	"Ò":"&Ograve;","Ó":"&Oacute;","Ô":"&Ocirc;","Õ":"&Otilde;","Ö":"&Ouml;","×":"&times;","Ø":"&Oslash;","Ù":"&Ugrave;","Ú":"&Uacute;","Û":"&Ucirc;",
	"Ü":"&Uuml;","Ý":"&Yacute;","Þ":"&THORN;","ß":"&szlig;","à":"&agrave;","á":"&aacute;","â":"&acirc;","ã":"&atilde;","ä":"&auml;","å":"&aring;",
	"æ":"&aelig;","ç":"&ccedil;","è":"&egrave;","é":"&eacute;","ê":"&ecirc;","ë":"&euml;","ì":"&igrave;","í":"&iacute;","î":"&icirc;","ï":"&iuml;",
	"ð":"&eth;","ñ":"&ntilde;","ò":"&ograve;","ó":"&oacute;","ô":"&ocirc;","õ":"&otilde;","ö":"&ouml;","÷":"&divide;","ø":"&oslash;","ù":"&ugrave;",
	"ú":"&uacute;","û":"&ucirc;","ü":"&uuml;","ý":"&yacute;","þ":"&thorn;","ÿ":"&yuml;","Œ":"&OElig;","œ":"&oelig;","Š":"&Scaron;","š":"&scaron;",
	"Ÿ":"&Yuml;","ƒ":"&fnof;","ˆ":"&circ;","˜":"&tilde;","Α":"&Alpha;","Β":"&Beta;","Γ":"&Gamma;","Δ":"&Delta;","Ε":"&Epsilon;","Ζ":"&Zeta;","Η":"&Eta;",
	"Θ":"&Theta;","Ι":"&Iota;","Κ":"&Kappa;","Λ":"&Lambda;","Μ":"&Mu;","Ν":"&Nu;","Ξ":"&Xi;","Ο":"&Omicron;","Π":"&Pi;","Ρ":"&Rho;","Σ":"&Sigma;",
	"Τ":"&Tau;","Υ":"&Upsilon;","Φ":"&Phi;","Χ":"&Chi;","Ψ":"&Psi;","Ω":"&Omega;","α":"&alpha;","β":"&beta;","γ":"&gamma;","δ":"&delta;","ε":"&epsilon;",
	"ζ":"&zeta;","η":"&eta;","θ":"&theta;","ι":"&iota;","κ":"&kappa;","λ":"&lambda;","μ":"&mu;","ν":"&nu;","ξ":"&xi;","ο":"&omicron;","π":"&pi;",
	"ρ":"&rho;","ς":"&sigmaf;","σ":"&sigma;","τ":"&tau;","υ":"&upsilon;","φ":"&phi;","χ":"&chi;","ψ":"&psi;","ω":"&omega;","ϑ":"&thetasym;","ϒ":"&Upsih;",
	"ϖ":"&piv;","–":"&ndash;","—":"&mdash;","‘":"&lsquo;","’":"&rsquo;","‚":"&sbquo;","“":"&ldquo;","”":"&rdquo;","„":"&bdquo;","†":"&dagger;","‡":"&Dagger;",
	"•":"&bull;","…":"&hellip;","‰":"&permil;","′":"&prime;","″":"&Prime;","‹":"&lsaquo;","›":"&rsaquo;","‾":"&oline;","⁄":"&frasl;","€":"&euro;",
	"™":"&trade;","←":"&larr;","↑":"&uarr;","→":"&rarr;","↓":"&darr;","↔":"&harr;","⇒":"&rArr;","⇔":"&hArr;","∀":"&forall;","∂":"&part;","∇":"&nabla;",
	"∏":"&prod;","∑":"&sum;","−":"&minus;","√":"&radic;","∞":"&infin;","∧":"&and;","∨":"&or;","∩":"&cap;","∪":"&cup;","∫":"&int;","∴":"&there4;",
	"≈":"&asymp;","≠":"&ne;","≡":"&equiv;","≤":"&le;","≥":"&ge;","⊥":"&perp;","◊":"&loz;","♠":"&spades;","♣":"&clubs;","♥":"&hearts;","♦":"&diams;"
};
var NEWDOO={render:new it4.RenderEngine('OO'),embedded:false,models:{},actions:{},addons:{},cstorage:STORAGE_FIREBASE,default_storage:STORAGE_FIREBASE,storages:{firebase:STORAGE_FIREBASE,'local':STORAGE_LOCAL},multisourcemode:true,
	init:async function(config){var _this=this;return new Promise(async function(resolve,reject){
		if(window.it3){/*console.log('it3 already present');*/}else{let s=document.createElement('script');s.setAttribute('src','https://cdn.jsdelivr.net/gh/hidekiyamamoto/it3/it3.min.js');document.head.appendChild(s);}
		app=initializeApp(config.auth);
		auth=getAuth();analytics=getAnalytics(app);
		_this.multisourcemode=config.multisourcemode||true;
		_this.embedded=config.embedded;
		for(let k=0;k<config.addons.length;k++){
			_this.addons[config.addons[k]]=(await import('./addons/'+config.addons[k]+'/'+config.addons[k]+'.js')).addon;
		}for(let k in _this.addons){
			for(let y in _this.addons[k].models){
				_this.addons[k].models[y].addon=_this.addons[k].name;
				_this.models[_this.addons[k].models[y].name]=_this.addons[k].models[y];
			}for(let y in _this.addons[k].actions){
				_this.actions[_this.addons[k].actions[y].key]=_this.addons[k].actions[y];
		}	}
		await _this.cstorage.init(config.storage);
		_this.index.init();
		_this._onAuthStateChanged();
		if(config.integrateFunction){try{config.integrateFunction();}catch(ex){setTimeout(config.integrateFunction,5000);}}
		resolve('ok');
	});},
	/* INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT AUTH */
	/* -------------------------------------------------------------------------------------------------------------------------------------- */
	/* AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH */
	_onAuthStateChanged:function(){onAuthStateChanged(auth,(user)=>{
		if(user){window.EMAIL=user.email;this.injectUI();
			if(!this.embedded){this.showUI();}
		}else{this.removeUI();
			let B=document.createElement('button');B.id='NEWDOO_LOGIN_BUTTON';
			B.innerHTML='ACCEDI';B.addEventListener('click',NEWDOO.googleSignin);
			document.body.appendChild(B);
	}});},
	googleSignin:function(){signInWithPopup(auth,provider).then((result)=>{
		// This gives you a Google Access Token. You can use it to access the Google API.
		var credential=GoogleAuthProvider.credentialFromResult(result);var token=credential.accessToken;var user = result.user;
		}).catch((error)=>{var errorCode=error.code;var errorMessage=error.message;var email=error.email;
		// The AuthCredential type that was used.
		var credential=GoogleAuthProvider.credentialFromError(error);
		console.log(errorMessage);
	});},
	googleSignout:function(){signOut(auth).then(()=>{console.log('signed out');}).catch((error)=>{console.log('Error signing out');});},
	/* AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH AUTH  */
	/* --------------------------------------------------------------------------------------------------------------------------------------- */
	/* STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE */
	index:{IDB:false,
		init:function(){
			let request=window.indexedDB.open('NEWDOOINDEX');
			request.onsuccess=function(ev){NEWDOO.index.IDB=ev.target.result;};
			request.onerror=function(error){console.log('Error opening local storage:'+request.error);};
			request.onupgradeneeded=function(ev){NEWDOO.index.IDB=ev.target.result;
				if(!NEWDOO.index.IDB.objectStoreNames['WORDINDEX']){
					let objectStore = NEWDOO.index.IDB.createObjectStore('WORDINDEX',{autoIncrement:false});
					objectStore.createIndex("model", "model", { unique: false });
					objectStore.createIndex("doc_id", "doc_id", { unique: true });
		}	};	},
		document:function(){
			//getindexes for document;
			//index document
			//find indexes to add -> run
			//find indexes to remove -> run
		},
		lookup:function(){
			let results=[];
			//lookup objectstore
		},
		lookupinverse:function(model_name,doc_id){
			
		}
	},
	lastcache:{lastmodel_name:false},
	storage:{
			_stripstrap:function(model_name,doc){
						let M=NEWDOO.models[model_name];let restores={};
						for(let f=0;f<M.fields.length;f++){
							if(M.fields[f].compute){restores[M.fields[f].name]=false}
							else if(M.fields[f].type=='one2many'){restores[M.fields[f].name]=false}
						}for(let r in restores){
							if(doc[r]===false){restores[r].name=false;delete doc[r];}
							else if(doc[r]===null){restores[r].name=null;delete doc[r];}
							else if(!doc[r]){delete restores[r].name;}
							else{restores[r].name=doc[r];delete doc[r];}
						}return {doc:doc,fill:restores};},
		_fillrelationfields:async function(M,doc,depth){if(!M.virtual){for(let f=0;f<M.fields.length;f++){if(!M.fields[f].compute){if(M.fields[f].type=='one2many'){
							doc[M.fields[f].name]=await this.query(M.fields[f].comodel,[M.fields[f].column1,'==',doc.id],depth-1);
						}else if(M.fields[f].type=='many2one'){if(doc[M.fields[f].name]){
							doc[M.fields[f].name]=await this.read(M.fields[f].comodel,doc[M.fields[f].name],depth-1);}
						}}}}return doc;},
		_computefields:function(M,doc){for(let f=0;f<M.fields.length;f++){if(M.fields[f].compute){
							doc[M.fields[f].name]=M[M.fields[f].compute](doc);
						}}return doc;},
				_refill:function(doc,fill){for(let k in fill){doc[k]=fill[k];}return doc},
			  activate:function(model_name,doc_id){return NEWDOO.cstorage.activate(model_name,doc_id);},
			deactivate:function(model_name,doc_id){return NEWDOO.cstorage.deactivate(model_name,doc_id);},
				  read:async function(model_name,doc_id,rel_depth){if(!rel_depth){if(rel_depth!=0){rel_depth=2}}let _this=this;return new Promise(async function(resolve,reject){
					  let doc=await NEWDOO.cstorage.read(model_name,doc_id);
					  if(rel_depth>0){doc=await _this._fillrelationfields(NEWDOO.models[model_name],doc,rel_depth);}
					  doc=_this._computefields(NEWDOO.models[model_name],doc);
					  resolve(doc);
				  });},
				remove:async function(model_name,doc_id){let doc=await this.read(model_name,doc_id,1);
						if(doc){let mode=NEWDOO.models[model_name].attachments_mode;
							if(mode){if(doc.attachments){if(doc.attachments.length>0){
								if(mode=='cascade'){
									for(let a in doc.attachments){NEWDOO.cstorage.removeattachment(doc.attachments[a].ref);}
									return NEWDOO.cstorage.remove(model_name,doc_id);
								}else if(mode=='restrict'){
									console.log("Cannote delete a document with attachments because model "+model_name+" has attachment_mode set to restrict");
									return false;
							}}}}
							/*todo: controlla le rel*/
						}return NEWDOO.cstorage.remove(model_name,doc_id);},
				backup:async function(){
					let BK={};let TT=[];
					for(let m in NEWDOO.models){if(!NEWDOO.models[m].virtual){
						TT=await NEWDOO.cstorage.query(NEWDOO.models[m].name,false,true);
						BK[NEWDOO.models[m].name]=TT||[];
					}}
					it3.downloadbig(JSON.stringify(BK),'backup.json');
				},
				 query:async function(model_name,ww,rel_depth,getall,getarch){if(!rel_depth){if(rel_depth!=0){rel_depth=2}}let _this=this;return new Promise(async function(resolve,reject){
						let TT=await NEWDOO.cstorage.query(model_name,ww,getall,getarch);
						let TTT=[];let doit=false;
						for(let t=0;t<TT.length;t++){doit=false;
							if(getarch){if(TT[t].active===false){doit=true}}
							else{if(TT[t].active||getall){doit=true}}
							if(doit){TTT.push(TT[t]);TTT[TTT.length-1]=NEWDOO.UTILS.fixdates(TTT[TTT.length-1]);}
						}
						let M=NEWDOO.models[model_name];
						for(let t=0;t<TTT.length;t++){
							if(rel_depth>0){TTT[t]=await _this._fillrelationfields(M,TTT[t],rel_depth);}
							TTT[t]=NEWDOO.storage._computefields(M,TTT[t]);
						}
						let mycompare=function(a,b){if(a.modified<b.modified){return 1;}else if(a.modified>b.modified){return -1;}return 0;};
						TTT.sort(mycompare);
						resolve(TTT);});},
				create:async function(model_name,_overrides){return new Promise(async function(resolve,reject){
						let M=NEWDOO.models[model_name];
						let doc={created:new Date(),modified:new Date(),created_by:window.EMAIL,modified_by:window.EMAIL,active:true}
						for(let f=0;f<M.fields.length;f++){
							if(!doc[M.fields[f].name]){
								
								if(M.fields[f].initial){let i='';if(M.fields[f].initial=='string.empty'){i=''}else{i=M.fields[f].initial;}
									if(typeof i=='function'){doc[M.fields[f].name]=i(doc);}
									else if(i.indexOf){if(i.indexOf('JS!')==0){
										doc[M.fields[f].name]=eval(i.replace('JS!',''));;
									}	}
									if(!doc[M.fields[f].name]){doc[M.fields[f].name]=i;}
						}	}	}
						if(_overrides){for(let k in _overrides){doc[k]=_overrides[k];}}
						let newid=await NEWDOO.cstorage.create(model_name,doc);
						doc.id=newid;resolve(doc);});},
//if(!_no_open){NEWDOO.open_document(doc,NEWDOO.get_view(this.name,'form'),this.name)}
					
				update:async function(model_name,model_data){return new Promise(async function(resolve,reject){
						let tid=model_data.id;delete model_data.id;let fill=NEWDOO.storage._stripstrap(model_name,model_data);
						model_data=fill.doc;fill=fill.fill;
						await NEWDOO.cstorage.update(model_name,tid,model_data);
						model_data.id=tid;model_data=NEWDOO.storage._refill(model_data,fill);
						resolve(model_data);});},
				 write:function(model_name,model_data){return new Promise(async function(resolve,reject){
						if(!(model_data.active||(model_data.active===false))){model_data.active=true;}
						model_data.modified=new Date();model_data.modified_by=window.EMAIL;
						let M=NEWDOO.models[model_name];
						for(let f=0;f<M.fields.length;f++){
							if(M.fields[f].compute){delete model_data[M.fields[f].name]}
							else if(M.fields[f].reference){delete model_data[M.fields[f].name]}
							else if(M.fields[f].type=='many2one'){
								if(model_data[M.fields[f].name]){if(model_data[M.fields[f].name].id){
									model_data[M.fields[f].name]=model_data[M.fields[f].name].id;
								}}
							}else if(M.fields[f].type=='one2many'){
								delete model_data[M.fields[f].name];
							}
						}
						if(model_data.id){model_data=await NEWDOO.storage.update(model_name,model_data);}
						else{model_data=await NEWDOO.storage.create(model_name,model_data);}
						resolve(model_data);});},
			attach2doc:function(model_name,doc_id,blob_obj,metadata){return new Promise(async function(resolve,reject){
						let myref=await NEWDOO.storage.addattachment(blob_obj,metadata);
						let mydoc=await NEWDOO.storage.read(model_name,doc_id);
						if(!mydoc.attachments){mydoc.attachments=[];}
						mydoc.attachments.push({ref:myref,name:metadata.name,mime:metadata.contentType});
						await NEWDOO.cstorage.write(model_name,mydoc);
						resolve('ok');});},
		 addattachment:function(blob_obj,metadata){return NEWDOO.cstorage.addattachment(blob_obj,metadata);},
	  removeattachment:function(ref){return NEWDOO.cstorage.removeattachment(ref);}
	},
	/* STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE */
	/* -------------------------------------------------------------------------------------------------------------------------------------- */
	/* UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI */
	UI_breadcumbs:[],skipcumb:false,
	UI_breadcumbs_push:function(s){if(this.skipcumb){this.skipcumb=false;}else{
		let p=this.UI_breadcumbs[this.UI_breadcumbs.length-1];
		if(p){let diff=false;
			for(let k in p){if(s[k]!=p[k]){diff=true;break;}}
			if(!diff){for(let k in s){if(s[k]!=p[k]){diff=true;break;}}}
			if(diff){this.UI_breadcumbs.push(s);}
		}else{this.UI_breadcumbs.push(s);}
	}},
	UI_goback:function(){let s=this.UI_breadcumbs.pop();
		if(this.UI_breadcumbs.length>0){s=this.UI_breadcumbs[this.UI_breadcumbs.length-1];}else{s=false}
		if(s){if(s.viewmode=='form'){this.skipcumb=true;this.open_document_from_id(s.model_name,s.id);}
			else if(s.viewmode=='tree'){this.skipcumb=true;this.UI_update_results(s.model_name);}
		}else{for(let k in NEWDOO.models){this.skipcumb=true;this.UI_update_results(k);break}}
	},
	isgod:function(){return ((EMAIL.indexOf('mtoti')==0)||(EMAIL.indexOf('hyama')==0)||(EMAIL.indexOf('hideki')==0)||(EMAIL.indexOf('salva')==0)||(EMAIL.indexOf('macchi')>-1)||(EMAIL.indexOf('n.val')>-1)||(EMAIL.indexOf('v.solinas')>-1));},
	injectUI:function(){let FDROOT=document.querySelector('.newdoo_root');if(FDROOT){console.log('NEWDOO ui already present')}else{
		FDROOT=it3.ins(document.body,'div',['class','newdoo_root'],this.basicUI);
		let system_menu=document.getElementById('settings-menu');
		system_menu.innerHTML='O'+this.menu_render(this.menu_system(),true);
		}},
	open_document_from_id:async function(model_name,document_id,template){let docdata=await this.storage.read(model_name,document_id);this.open_document(docdata,template,model_name);},
	open_document:function(document_data,template,_model_name){
		document.querySelector('#HD_results_target').classList.remove('hd_active');
		let elm = document.querySelector('#HD_details_target');elm.classList.add('hd_active');
		if(_model_name){this.lastcache[_model_name]=document_data;this.lastcache.lastmodel_name=_model_name;}
		if(!template){template=this.ui_make_form_template(_model_name,true);}
		this.UI_breadcumbs_push({model_name:_model_name,id:document_data.id,viewmode:'form'});
		NEWDOO.render.to(elm,template,document_data);},
	removeUI:function(){let FDROOT=document.querySelector('.newdoo_root');if(!FDROOT){console.log('NEWDOO ui already absent')}else{
		it3.clearchilds(FDROOT);FDROOT.parentElement.removeChild(FDROOT);}},
	showUI:function(_skipupdate){document.querySelector('.newdoo_root').classList.add('hd_active');if(_skipupdate){let i='';}else{NEWDOO.UI_update_results();}},
	hideUI:function(){document.querySelector('.newdoo_root').classList.remove('hd_active');},
	get_view:function(model_name,view_type,god,archmode){
		if(NEWDOO.models[model_name].views[view_type]){return NEWDOO.models[model_name].views[view_type]}
		return this['ui_make_'+view_type+'_template'](model_name);},
	UI_update_results:async function(model_name,archivemode,_docs){let TTT = _docs;let godly_powers=this.isgod();if(!model_name){
			model_name=this.lastcache.lastmodel_name;if(!model_name){for(let k in this.models){model_name=this.models[k].name;break}}
		}if(!model_name){console.log('No model name given to UI_update_results');}
		document.querySelector('#HD_results_target').classList.add('hd_active');
		document.querySelector('#HD_details_target').classList.remove('hd_active');
		if(!_docs){
		if(godly_powers){TTT=await this.storage.query(model_name,false,2,false,archivemode);}
		else{TTT=await this.storage.query(model_name,['created_by', '==', window.EMAIL],2,false,archivemode);}
		}
		//else{TTT=_docs[0];/*not understood why*/}
		if(TTT.empty){it3.$$('HD_results_target').innerHTML='<button onclick="this.models[\''+model_name+'\'].makenew()" class="btn btn-sm">Nuovo</button><br/>No Results'}
		else{
			this.UI_breadcumbs_push({model_name:model_name,viewmode:'tree'});let ss='';
			if(archivemode){ss=ss+'<button onclick="NEWDOO.UI_goback()" class="btn btn-sm btn-primary">&lt;&lt;--</button><br/><br/>'}
			else{ss=ss+`<button onclick="NEWDOO.models['`+model_name+`'].makenew()" class="btn btn-sm btn-primary">Nuovo</button><button
			onclick="NEWDOO.UI_update_results('`+model_name+`',true);" class="btn btn-sm btn-warning">archivio</button><br/><br/>`;}
			if(archivemode){ss=ss+ this.ui_make_tree_template(model_name,true,true);}
			else if(godly_powers){ss=ss+ this.ui_make_tree_template(model_name,true);}
			else{ss=ss+ this.ui_make_tree_template(model_name);}
			//it3.render(it3.$$('HD_results_target'),ss,{TT:TTT});
			NEWDOO.render.to(it3.$$('HD_results_target'),ss,{TT:TTT});
		}
	},
	UI_takescreenshot:async function(_model){_model=_model||this.lastcache.lastmodel_name;if(!_model){console.log('no model to attach screenshot to');return null;}
		if(this.lastcache[_model]){var _this=this;this.hideUI();await this.UI_save_document(false,_model,true);
			html2canvas(document.body).then(function(canvas){
				canvas.toBlob(async function(b){
					this.showUI(true);
					let screenshotname='Screenshot-'+new Date().toISOString().split('.')[0].replace(/-/g,'').replace(/:/g,'')+'.png';
					await this.storage.attach(_model,this.lastcache[_model].id,b,{name:screenshotname,size:b.size,contentType:b.type});
					this.open_document_from_id(_model,this.lastcache[_model].id);
	});});	}	},
	UI_uploadfile:async function(_model){_model=_model||this.lastcache.lastmodel_name;if(!_model){console.log('no model to attach file to');return null;}
		if(this.lastcache[_model]){
			let file=it3.$$('helpdesk_attachment_input').files[0];
			if(file){
				await this.UI_save_document(false,_model,true);
				await this.storage.attach2doc(_model,this.lastcache[_model].id,file,{name:file.name,size:file.size,contentType:file.type});
				this.open_document_from_id(_model,this.lastcache[_model].id);
	}	}	},
	UI_save_document:async function(ev,model_name,_do_not_close){if(ev){ev.stopPropagation();}
		let formElm=false;
		formElm=document.getElementsByClassName('newdoo-form')[0];
		let QS='?'+this.UI_serialize(formElm);
		let model=this.models[model_name];
		let DOC=this.lastcache[model_name];
		for(let f in model.fields){
			let v=it3.querystring(model.fields[f].name,QS);
			if(v){if(model.fields[f].widget){
					if(model.fields[f].save_fn){
						if(model[model.fields[f].save_fn]){
							DOC[model.fields[f].name]=model[model.fields[f].save_fn](model_name,model.fields[f].name,DOC,v);
						}else if(NEWDOO.addons[model.addon][model.fields[f].save_fn]){
							DOC[model.fields[f].name]=NEWDOO.addons[model.addon][model.fields[f].save_fn](model_name,model.fields[f].name,DOC,v);
						}
					}else if(model.fields[f].widget.indexOf('text')>-1){
						DOC[model.fields[f].name]=NEWDOO.UTILS.unhtmlentities(v).replace(/ /g,' ');
					}else if(model.fields[f].widget.indexOf('journal')>-1){
						DOC[model.fields[f].name]='<hr/>'+DOC.modified.toLocaleString()+' - '+window.EMAIL+' - '+this.models[model_name].widgets._user_friendly_status(DOC)+'<br/>'+v+DOC[model.fields[f].name];
					}else{DOC[model.fields[f].name]=v;}
				}else{
					if(v=='false'){v=false}
					DOC[model.fields[f].name]=v;
				}
		}	}
		await this.storage.write(model_name,DOC);
		if(_do_not_close){var i='';}else{this.lastcache[model_name]=false;this.UI_update_results(model_name);}
	},
	UI_collect:function(a,f){var n=[];for(var i=0;i<a.length;i++){var v=f(a[i]);if(v!=null){n.push(v);}}return n;},
	UI_serialize:function(f){var g=function(n){return f.getElementsByTagName(n)};
		var nv=function(e){if(e.name)return encodeURIComponent(e.name)+'='+encodeURIComponent(e.value);else return ''};
		var nvh=function(e){if(e.getAttribute('name'))return encodeURIComponent(e.getAttribute('name'))+'='+encodeURIComponent(e.innerHTML);else return ''};
		var c1=function(i){if((i.type!='radio'&&i.type!='checkbox')||i.checked){return nv(i)}else{return encodeURIComponent(i.name)+'=false'}};
		var i=this.UI_collect(g('input'),c1);var s=this.UI_collect(g('select'),nv);
		var t=this.UI_collect(g('textarea'),nv);
		let nnn=f.querySelectorAll('div.textarea');
		var tt=this.UI_collect(nnn,nvh);
		return i.concat(s).concat(t).concat(tt).join('&');},
	/* UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI UI */
	/* -------------------------------------------------------------------------------------------------------------------------------------- */
	/* MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU */
	menu:{root:{_key:'',_text:'',_title:'main menu'},items:[],itemsidx:{},
		render:function(elm){elm=elm||this.root;let s='';let pp=[];
			for(let i=0;i<this.items.length;i++){
				
			}
		},
		regen:function(){this.items=[];this.itemsidx={};
			//get from db || get from modules
			for(let a in NEWDOO.addons){
				this._regen_fill(NEWDOO.addons[a].menu);
			}
			//order by seq
			//nonrecursive gen
		},
		_regen_fill:function(mmm){for(let mm=0;mm<mmm.length;mm++){
			this.items.push({key:mmm[mm]._key,text:mmm[mm]._text,title:mmm[mm]._title,action:mmm[mm]._action,parent:mm[mm]._parent||'root',seq:mmm[mm]._seq||100,cc:[]});
			for(let m in mmm[mm].cc){this._regen_fill(mmm[mm].cc[m]);}
		}},
		
	},
	menu_system:function(){
		let mm=[];
		mm.push({action:'logout',values:[],text:'LOGOUT'});
		mm.push({action:'game1',values:[],text:'GAME1'});
		mm.push({action:'game2',values:[],text:'GAME2'});
		mm.push({action:'game3',values:[],text:'GAME3 - STARS'});
		mm.push({action:'settings',values:[],text:'Settings'});
		mm.push({action:'storageman',values:[],text:'Storage Manager'});
		mm.push({action:'backup2json',values:[],text:'Backup DB to file'});
		for(let m in NEWDOO.models){if(!NEWDOO.models[m].virtual){mm.push({action:'search',values:[NEWDOO.models[m].name],text:NEWDOO.models[m].display_name||NEWDOO.models[m].name});}}
		for(let a in NEWDOO.addons){
			for(let m=0;m<NEWDOO.addons[a].menu.length;m++){
				mm.push(NEWDOO.addons[a].menu[m]);
			}
		}
		return {cc:mm}
	},
	menu_run:function(ev,a,vv){if(ev){if(ev.stopPropagation){ev.stopPropagation();}}if(vv){vv=decodeURIComponent(vv);vv=JSON.parse(vv);}
		if(a=='logout'){
			NEWDOO.googleSignout();
		}else if(a=='game1'){
			document.location="https://anyspecificdomain.com/game.html?t=sortrandom1"
		}else if(a=='game2'){
			document.location="https://anyspecificdomain.com/game.html?t=sortrandom3"
		}else if(a=='game3'){
			document.location="https://anyspecificdomain.com/stars"
		}else if(a=='search'){
			this.UI_update_results(vv[0]);
		}else if(a=='form'){
			this.open_document_from_id(vv[0],vv[1]);
		}else if(a=='backup2json'){
			this.storage.backup();
		}else{
			if(NEWDOO.actions[a]){
				NEWDOO.actions[a].fn(vv);
			}else{
				console.log('unrecognized action '+a);
			}
	}	},
	menu_render:function(m,root){let out='';
		if(m){
			if(!root){
				if(m.action){out=out+`<li onclick="NEWDOO.menu_run(event,'`+m.action+`','`+encodeURIComponent(JSON.stringify(m.values||{}))+`')">`+m.text+'</li>';}
				else if(m.js){
				}else{out=out+`<li>`+m.text+'</li>';}
			}
			if(m.cc){out=out+'<ul>';
				for(let c=0;c<m.cc.length;c++){
					out=out+this.menu_render(m.cc[c]);
				}out=out+'</ul>';
			}
		}
		return out;
	},
	/* MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU MENU */
	/* -------------------------------------------------------------------------------------------------------------------------------------- */
	/* WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS */
	
	widgets:{
		'selection':function(model_name,field_name,view_mode,editable){let uid=it3.uid('h');let field=NEWDOO.models[model_name].get_field(field_name);
			let multi='<!--OO{NEWDOO.UTILS.get_selection_name(\''+model_name+'\',\''+field_name+'\',this[%ARRIDX%].'+field_name+')}OO-->';
			let single='<select id="'+uid+'" name="'+field_name+'" class="form-control-sm">';
			for(let o in field.selection){
				single=single+'<option value="'+o+'">'+field.selection[o]+'</option>';
			}single=single+'</select><!--LOAD{document.getElementById(\''+uid+'\').value=\'<!--OO{this.'+field_name+'}OO-->\';}LOAD-->';
			if(view_mode=='tree'){if(editable){return multi;}else{return multi;}}else if(view_mode=='form'){if(editable){return single;}else{return single;}}else{return false;}},
		'date':function(model_name,field_name,view_mode,editable){
			let multi='<!--OO{this[%ARRIDX%].'+field_name+'?this[%ARRIDX%].'+field_name+'.toLocaleString():\'-\'}OO-->';
			let single='<input type="date" class="form-control-sm" name="'+field_name+'" OO-value="let x=\'\';if(this.'+field_name+'){x=this.'+field_name+'.toISOString().split(\'T\')[0];x}" />';
			if(view_mode=='tree'){if(editable){return multi;}else{return multi;}}else if(view_mode=='form'){if(editable){return single;}else{return single;}}else{return false;}},
		'varchar':function(model_name,field_name,view_mode,editable){
			let multi='<!--OO{this[%ARRIDX%].'+field_name+'}OO-->';
			let single='<input type="text" class="form-control-sm" name="'+field_name+'" OO-value="this.'+field_name+'" />';
			if(view_mode=='tree'){if(editable){return multi;}else{return multi;}}
			else if(view_mode=='form'){
				if(editable){return single;}
				else{return single.substr(0,single.length-2).replace('class="','class="readonly ')+' readonly="readonly" />'}}
			else{return false;}},
		'text':function(model_name,field_name,view_mode,editable){
			let multi='<!--OO{this[%ARRIDX%].'+field_name+'}OO-->';
			let single='<textarea style="min-height:250px;" name="'+field_name+'" placeholder="..." class="form-control-sm"><!--OO{NEWDOO.UTILS.htmlentities(this.'+field_name+')}OO--></textarea>';
			if(view_mode=='tree'){if(editable){return multi;}else{return multi;}}else if(view_mode=='form'){if(editable){return single;}else{return single;}}else{return false;}},
		'journal':function(model_name,field_name,view_mode,editable){let out=false;
			if(editable){out='<hr/><textarea name="'+field_name+'" placeholder="Digita una nuova risposta..." class="form-control-sm"></textarea>';}
			if(view_mode=='form'){out=out+'<!--OO{this.'+field_name+'}OO--><hr/><!--OO{this.created.toLocaleString()}OO--> - <!--OO{this.created_by}OO--> - Creato';}
			else{out=out+'<!--OO{this[%ARRIDX%].'+field_name+'}OO--><hr/><!--OO{this[%ARRIDX%].created.toLocaleString()}OO--> - <!--OO{this[%ARRIDX%].created_by}OO--> - Creato';}
			return out;},
		'action':function(model_name,field_name,view_mode,editable){let field=NEWDOO.models[model_name].get_field(field_name);
			let multi='<button onclick="NEWDOO.models[\''+model_name+'\'].'+field_name+'" class="btn btn-sm"> <!--OO{this[%ARRIDX%].'+field.label+'}OO--> </button>';
			let single='<button onclick="NEWDOO.models[\''+model_name+'\'].'+field_name+'" class="btn btn-sm"> <!--OO{this.'+field.label+'}OO--> </button>';
			if(view_mode=='tree'){if(editable){return multi;}else{return multi;}}else if(view_mode=='form'){if(editable){return single;}else{return single;}}else{return false;}},
		'boolean':function(model_name,field_name,view_mode,editable){let field=NEWDOO.models[model_name].get_field(field_name);
			let multi='<!--OO{this[%ARRIDX%].'+field_name+'?\'yes\':\'no\'}OO-->';
			let single='<!--OO{let a=\'\';if(this.'+field_name+')a=\' checked="checked"\';#}OO--> />';
			single=single.replace('#',`'<input type="checkbox" name="`+field_name+`" OO-value="true"'+a`);
			if(view_mode=='tree'){if(editable){return multi;}else{return multi;}}else if(view_mode=='form'){if(editable){return single;}else{return single;}}else{return false;}},
		'one2many':function(model_name,field_name,view_mode,editable){let field=NEWDOO.models[model_name].get_field(field_name);
			let d=NEWDOO.ui_make_tree_template(field.comodel,false,false,[field.column1]);
			d=d.replace('<!--OO#TT','<!--OO#'+field_name);
			d=d.replace('TT#OO-->',field_name+'#OO-->');
			return d;
		},
		'many2one':function(model_name,field_name,view_mode,editable){let M=NEWDOO.models[model_name];let F=M.get_field(field_name);
			let multi=`<a href="#" OO-onclick="'it3.fix(event);NEWDOO.open_document_from_id(\\'`+F.comodel+`\\',\\''+this[%ARRIDX%].`+field_name+`.id+'\\')'"><!--OO{NEWDOO.UTILS.get_display_name(this[%ARRIDX%].`+field_name+`,NEWDOO.models['`+F.comodel+`'])}OO--></a>`;
			let single=`<a href="#" OO-onclick="'NEWDOO.open_document_from_id(\\'`+F.comodel+`\\',\\''+this.`+field_name+`.id+'\\')'"><!--OO{NEWDOO.UTILS.get_display_name(this.`+field_name+`,NEWDOO.models['`+F.comodel+`'])}OO--></a>`;
			if(view_mode=='tree'){if(editable){return multi;}else{return multi;}}else if(view_mode=='form'){if(editable){return single;}else{return single;}}else{return false;}},
		'binary':function(model_name,field_name,view_mode,editable){
			let base=`<!--OO{let a='';if(this.`+field_name+`){a='<a href="'+this.`+field_name+`.url+'">'+this.`+field_name+`.name+'</a>'}else{a=''}a}OO-->`;
			if(!editable){if(view_mode=='tree'){base=base.replace(/this\./g,'this[%ARRIDX%].');}}
			else{base=base.replace("'}else{","CESTINO todo'}else{");
				base=base.replace("else{a=''}","else{a='UPLOAD todo'}");
			}return base;
		}
	},
	ui_draw_field:function(model,field,view_mode,_widget){let html=false;
		if(field.invisible){return '';}else{_widget=_widget||field.widget;_widget=_widget||field.type;
			if(_widget){if(field.compute){field.readonly=true}
				if(model.widgets){if(model.widgets[_widget]){
					if(view_mode=='tree'){html=NEWDOO.models[model.name].widgets[_widget](model.name,field.name,view_mode,((view_mode=='form')?true:false));}
					else{html=NEWDOO.models[model.name].widgets[_widget](model.name,field.name,view_mode,((view_mode=='form')?true:false));}
				}}
				if(!html){
					let A=NEWDOO.addons[model.name.split('_')[0]];
					if(A.widgets){if(A.widgets[_widget]){
						if(view_mode=='tree'){html=A.widgets[_widget](model.name,field.name,view_mode,((view_mode=='form')?true:false));}
						else{html=A.widgets[_widget](model.name,field.name,view_mode,((view_mode=='form')?true:false));}
				}}}
				let WW=NEWDOO.widgets;
				if(!html){if(WW[_widget]){html=WW[_widget](model.name,field.name,view_mode,field.readonly?false:((view_mode=='form')?true:false))}}
			}if(!html){html='<!--OO{this[%ARRIDX%].'+field.name+'}OO-->';if(view_mode=='form'){html=html.replace(/\[%ARRIDX%\]/g,'');}}
			return html;
	}	},
	/* WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS WIDGETS */
	/* ---------------------------------------------------------------                                                         */
	/* TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW */
	ui_make_tree_template:function(model_name,god,archmode,removecols){let model=NEWDOO.models[model_name];if(!removecols){removecols=[];}
		let ss=`<table class="newdoo-sheet"><thead><tr>`;if(!model.treeorder_god){model.treeorder_god=model.treeorder}
		let hh=false;
		if(god){hh='';
			for(let f in model.treeorder_god){if(removecols.indexOf(model.treeorder_god[f])<0){hh=hh+'<th>'+model.get_field(model.treeorder_god[f]).label+'</th>'}}
		}else{if(model.treeorder){hh='';
			for(let f in model.treeorder){if(removecols.indexOf(model.treeorder[f])<0){hh=hh+'<th>'+model.get_field(model.treeorder[f]).label+'</th>'}}
		}}if(!hh){for(let f in model.fields){hh=hh+'<th>'+model.fields[f].label+'</th>'}}
		ss=ss+hh;
		if(god||archmode){ss=ss+'<th>&nbsp;</th>';}
		ss=ss+`</tr></thead><tbody><!--OO#TT{<tr OO-onclick="'NEWDOO.open_document_from_id(\\'`+model_name+`\\',\\''+this[%ARRIDX%].id+'\\');'">`;
		let bb=false;
		if(god){bb='';
			for(let f in model.treeorder_god){if(removecols.indexOf(model.treeorder_god[f])<0){bb=bb+'<td>'+this.ui_draw_field(model,model.get_field(model.treeorder_god[f]),'tree')+'</td>'}}
		}else{if(model.treeorder){bb='';
			for(let f in model.treeorder){if(removecols.indexOf(model.treeorder[f])<0){bb=bb+'<td>'+this.ui_draw_field(model,model.get_field(model.treeorder[f]),'tree')+'</td>'}}
		}}if(!bb){for(let f in model.fields){bb=bb+'<td>'+this.ui_draw_field(model,model.fields[f],'tree')+'</td>'}}
		ss=ss+bb;
		if(archmode){ss=ss+`<td><button onclick="event.stopPropagation();NEWDOO.models['`+model.name+`'].unarchive('<!--OO{this[%ARRIDX%].id}OO-->');let t=this.parentElement.parentElement;t.parentElement.removeChild(t);" class="btn btn-sm btn-secondary p-2">disarchivia</button>
							<button onclick="event.stopPropagation();NEWDOO.models['`+model.name+`'].remove('<!--OO{this[%ARRIDX%].id}OO-->');let t=this.parentElement.parentElement;t.parentElement.removeChild(t);" class="btn btn-sm btn-danger p-2">elimina</button></td>`;}
		else if(god){ss=ss+`<td>
							<button onclick="event.stopPropagation();NEWDOO.models['`+model.name+`'].archive('<!--OO{this[%ARRIDX%].id}OO-->');let t=this.parentElement.parentElement;t.parentElement.removeChild(t);" class="btn btn-sm btn-warning p-2">archivia</button></td>`;}
		ss=ss+`</tr>}TT#OO-->
		</tbody></table>`;
		return ss;
	},
	/* TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW TREE VIEW */
	/* ----------------------------------------------------------------------------------------------------------------------- */
	/* FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW */
	ui_basic_form_structure:['header','main','normal','footer'],
	ui_basic_form_structure_html:{
		'header':{before:'',after:''},'main':{before:'',after:''},
		'normal':{before:'<div class="newdoo-flex">',after:'</div>'},'footer':{before:'<!--OO{NEWDOO.attachments_html(this.attachments,\'%MODEL%\');}OO-->',after:''}
	},
	ui_make_form_template:function(model_name,god,archmode){let model=NEWDOO.models[model_name];let tmp;
		//tab-s-pagename(n)
		let formorder=false;
		if(model.formorder){formorder=model.formorder;}
		if(!formorder){formorder=[];for(let f in model.fields){formorder.push(model.fields[f].name);}}
		let structure=this.ui_basic_form_structure;
		let structure_html=this.ui_basic_form_structure_html;
		let out=[];for(let s in structure){out.push(structure_html[structure[s]].before.replace(/%MODEL%/g,model_name)||'');}
		for(let f in formorder){let ff=formorder[f];
			let ww=ff;if(ww.indexOf(':')>-1){ff=ww.split(':')[0];ww=ww.split(':')[1]}else{ww=false}
			let F=model.get_field(ff);if(!F.formposition){F.formposition='normal'}
			for (let s in structure){
				if(F.formposition==structure[s]){out[s]=out[s]+'<div>';
					if(structure[s]=='normal'){if(!F.nolabel){
						out[s]=out[s]+'<label for="'+F.name+'">'+F.label+'</label>';
					}}
					out[s]=out[s]+this.ui_draw_field(model,F,'form',ww);
					out[s]=out[s]+'</div>';
		}	}	}
		for (let s in structure){out[s]=out[s]+structure_html[structure[s]].after.replace(/%MODEL%/g,model_name)||'';}
		let tabs=[];let tabidx={};
		for(let f in formorder){let ff=formorder[f];
			let ww=ff;if(ww.indexOf(':')>-1){ff=ww.split(':')[0];ww=ww.split(':')[1]}else{ww=false}
			let F=model.get_field(ff);
			if(F.formposition.indexOf('tab-')==0){let t=F.formposition.substr(F.formposition.indexOf('-')+1);
				if(!tabidx[t]){tabidx[t]=tabs.length;tabs.push('');}
				tabs[tabidx[t]]=tabs[tabidx[t]]+this.ui_draw_field(model,F,'form',ww);
		}	}
		if(tabs.length>0){let tuid=it3.uid('tabs');tabs.unshift('<div id="'+tuid+'" class="newdoo-tabs">');tabs.push('</div>');
			for(let t in tabidx){tabidx[t]=tabidx[t]+1;let d='';if(tabidx[t]!=1){d=' style="display:none"'}
				tabs[0]=tabs[0]+'<button class="newdoo-tab-button btn btn-sm btn-primary" onclick="document.querySelectorAll(\'#'+tuid+'>.newdoo-tab\').forEach(elm=>elm.style.display=\'none\');document.getElementById(\''+tuid+tabidx[t]+'\').style.display=\'\'">'+t+'</button> ';
				tabs[tabidx[t]]='<div id="'+tuid+tabidx[t]+'" class="newdoo-tab"'+d+'>'+tabs[tabidx[t]]+'</div>'
		}	}
		out[out.length-2]=out[out.length-2]+tabs.join('');
		out[0]=out[0]+'<div class="newdoo-form"><button onclick="NEWDOO.UI_goback();" class="btn btn-sm btn-primary">&lt;&lt;--</button>';
		out[0]=out[0]+'	<button onclick="NEWDOO.UI_save_document(event,\''+model_name+'\')" class="btn btn-sm btn-danger">SALVA</button><br/><br/> <div class="newdoo-sheet">';
		out[out.length-1]=out[out.length-1]+'</div></div>';
		out[1]=out[1].replace(/form-control-sm/g,'form-control-lg');
		return out.join('');
	},
	/* FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW FORM VIEW */
	/* ----------------------------------------------------------------------------------------------------------------------- */
	/* ---------------------------------------------------------------                                                            */
	UTILS:{
		get_display_name:function(doc,_M){let n=false;if(doc){
			if(_M){if(_M.get_display_name){return _M.get_display_name(doc)}}
			if(doc.display_name){n=doc.display_name;}
			else if(doc.name){n=doc.name;}
			else if(doc.title){n=doc.title;}
			else{if(_M){
					for(let f=0;f<_M.fields.length;f++){
						if(_M.fields[f].formposition=='main'){
							if(doc[_M.fields[f].name]){if(!n){n=''}
								n=n+' '+doc[_M.fields[f].name];
					}	}	}
					n=n.trim();
					if(it3.inoe(n)){n=false}
				}
			}}
			if(!n){n=doc.id}
			if(!n){console.log(doc);return 'no doc'}
			return n;
		},
		get_selection_name:function(model_name,field_name,value){let s= NEWDOO.models[model_name].get_field(field_name).selection;if(s[value]){return s[value]}else{return value}},
		fixdates:function(docData){
			if(docData.create_date){docData.create_date=docData.create_date.toDate();}
			if(docData.modified_date){docData.modified_date=docData.modified_date.toDate();}
			if(docData.created){if(typeof docData.created.toDate=='function'){docData.created=docData.created.toDate();}}
			if(docData.modified){if(typeof docData.modified.toDate=='function'){docData.modified=docData.modified.toDate();}}
			if(docData.expected_date){if(docData.expected_date.toDate){docData.expected_date=docData.expected_date.toDate();}else{if(docData.expected_date.replace){docData.expected_date=new Date(docData.expected_date)}}}
			if(docData.expected){if(docData.expected.toDate){docData.expected=docData.expected.toDate();}else{if(docData.expected.replace){docData.expected=new Date(docData.expected)}}}
			return docData;},
		fixattachments:async function(docData){return new Promise(async function(resolve,reject){
			if(docData.attachments){for(let a in docData.attachments){try{
				docData.attachments[a].url=await getDownloadURL(refST(storage,docData.attachments[a].ref));
			}catch(ex){let ok=''}}}resolve(docData);});},
		operators:{
			'==':function(a,b){return (a==b)},
			'!=':function(a,b){return (a!=b)},
			'>=':function(a,b){return (a>=b)},
			'<=':function(a,b){return (a<=b)},
			'>':function(a,b){return (a>b)},
			'<':function(a,b){return (a<b)},
			'like':function(a,b){if(a){if(a.indexOf){return (a.indexOf(b)>-1)}else{return false}}else{return false}}
		},
		lazywhere:function(ii,ww){
			for(let x=0;x<ww.length-2;x=x+3){let w0=ww[x];let w1=ww[x+1];let w2=ww[x+2];
				let fn=function(e){return NEWDOO.UTILS.operators[w1](e[w0],w2);};
				ii=ii.filter(fn);
			}
			return ii;
		},
		unhtmlentities:function(s){for(let k in all_htmlentities){s=s.replace(new RegExp(all_htmlentities[k],'g'),k);}return s},
		  htmlentities:function(s){for(let k in all_htmlentities){s=s.replace(new RegExp(k,'g'),all_htmlentities[k]);}return s},
		open_ticket_html:function(t){return '<label>Richiesta:</label><a href="#" onclick="NEWDOO.open_document_from_id(\''+model_name+'\',\''+t.id+'\')">'+t.title+'</a>'}
	},
	/* FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS */
	/* FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS */
	/* FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS FRAGMENTS */
	basicUI:`<div id="newdoo-modal-dialog" style="position:absolute;display:none;z-index:1000;"><div id="newdoo-modal-dialog-content"></div></div><div class="hd_top_bar"><span class="title">NEWDOO</span><button
		id="GOOGLE_SIGNOUT" onclick="NEWDOO.googleSignout()" class="btn btn-sm">Esci</button><button
		class="hide_NEWDOO btn btn-sm" onclick="NEWDOO.hideUI()" style="display:none">X</button><button
		class="btn btn-sm newdoo-menu" onclick="NEWDOO.menu_system()" id="settings-menu">O</button></div>
	<div id="HD_results_target" class="results_target hd_active">
	</div><div id="HD_details_target" class="details_target">
	</div>`,
	attachment_foot:function(model_name){return `<label>Allega:</label><button class="autoscreenshot" onclick="NEWDOO.UI_takescreenshot('`+model_name+`')" class="btn">Autoscreen</button><input type="file" id="helpdesk_attachment_input" onchange="this.nextSibling.style.display='';" /><button
		 style="display:none" onclick="NEWDOO.UI_uploadfile('`+model_name+`')" class="btn btn-sm btn-secondary">Upload</button>`;},
	attachments_html:function(aa,model_name){if(NEWDOO.models[model_name].attachments_mode){
		if(aa){let ii='';let ll='';for(let a in aa){
				if(aa[a].mime.indexOf('image')>-1){ii=ii+'<img class="ticket_img" src="'+aa[a].url+'"/>';}
				else{ll=ll+'<a target="_blank" href="'+aa[a].url+'" download="'+aa[a].name+'"/>'+aa[a].name+'</a>';}}
			if(!it3.inoe(ii)){ii='<br/><label>Images:</label>'+ii};
			if(!it3.inoe(ll)){ll='<br/><label>Files:</label>'+ll};
			return ii+ll+'<br/>'+this.attachment_foot(model_name);
		}else{return this.attachment_foot(model_name);}
	}else{return '';}}
};
export {NEWDOO}