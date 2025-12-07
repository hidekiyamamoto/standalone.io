//it3.js by Hideki Yamamoto
window._UA=navigator.userAgent.toLowerCase();window.tempfix=false;
window.HOST=document.location.protocol.toString()+'//'+document.location.hostname.toString();
it3={NS:'it3',$$:function(e){if(typeof e=='string'){e=document.getElementById(e);}return e;},$$c:function(e){return document.getElementsByClassName(e);},
	_uid:0,uid:function(_pfx){/*{R:'string'}*/this._uid++;if(!_pfx){_pfx='uid'}return _pfx+'-'+this._uid},fix:function(ev){ev.stopPropagation();ev.preventDefault();},
	extend:function(initial,extend){for(k in extend){initial[k]=extend[k]||(initial[k]||null);}},
	sleep:function(milliseconds){return new Promise(resolve => setTimeout(resolve, milliseconds));},
/* ----------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------- BROWSER UTILS --- */
	isIE:document.ActiveXObject,isIE9:_UA.indexOf('msie 9')>-1,isIE10:_UA.indexOf('msie 10')>-1,
	toggleFullScreen:function(){/*{R:'void',DESC:{}}*/
		var d=document;var de=d.documentElement;if((d.fullScreenElement&&d.fullScreenElement!==null)||(!d.mozFullScreen&&!d.webkitIsFullScreen)){if(de.requestFullScreen){de.requestFullScreen();}else if(de.mozRequestFullScreen){de.mozRequestFullScreen();}else if(de.webkitRequestFullScreen){de.webkitRequestFullScreen(Element.ALLOWKEYBOARDINPUT);}}else{if(d.cancelFullScreen){d.cancelFullScreen();}else if(d.mozCancelFullScreen){d.mozCancelFullScreen();}else if(d.webkitCancelFullScreen){d.webkitCancelFullScreen();}}},
	querystring:function(key,qs){if(this.inoe(qs)){if(History){if(History.getState){qs=History.getState().url;}}if(!qs){qs=location.href}}qs=qs.slice(qs.indexOf('?'));if(!key){return qs;}if(key==''){return '';}var deft_="";key=key.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');var regex=new RegExp('[\\?&]'+key+'=([^&#]*)');qs=regex.exec(qs);if(qs==null){return deft_;}else{return decodeURIComponent(qs[1]);}},
	downloadbig:function(data,fn){if(!streamSaver){console.log('No streamSaver js detected : install with:');console.log('<script src="https://cdn.jsdelivr.net/gh/jimmywarting/StreamSaver.js/StreamSaver.js"></script>')}
		let fileStream=streamSaver.createWriteStream(fn);let writer=fileStream.getWriter();let encoder=new TextEncoder();
		let uint8array=encoder.encode(data + "\n\n");writer.write(uint8array);writer.close();},
     	makebloblink:function(content,filename,contentType,linkid){if(!contentType){contentType='application/octet-stream';}var blob=new Blob([content],{'type': contentType});
		var link=window.document.createElement('a');link.id=linkid;link.href=window.URL.createObjectURL(blob);link.download=filename;
		link.innerHTML='<i class="icon ion-android-download"></i> Download export';return link;},
/* ----------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------- STRING UTILS ---  */
	inoe:function(v){/*{R:'boolean',DESC:'returns true if value Is Null Or Empty, false otherwise',v:{T:'string',DESC:'the value to test'}}*/
		if(!v){return true}return (v==null||v==='');},
	starts:function(v,m){/*{R:'boolean',DESC:'returns true if value starts with match, false otherwise',v:{T:'string',DESC:'the value to test'},v:{t:'string',desc:'the match to test the value against'}}*/
		return v.indexOf(m)==0;},
	ends:function(v,m){/*{R:'boolean',DESC:'returns true if value ends with match, false otherwise',v:{T:'string',DESC:'the value to test'},v:{t:'string',desc:'the match to test the value against'}}*/
		return v.length>=m.length&&v.substr(v.length-m.length)===m;},
        spad:function(num,size){var s=num.toString();while(s.length<size){s="0"+s};return s;},
/* ----------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------- DHTML UTILS --- */
	att:function(e,a,_v){/*{R:'value',DESC:'gets or sets an attribute in any document node',e:{T:'node',DESC:'The element from to read or set the attribute'},a:{T:'string',DESC:'the name of the attribute'},_v:{T:'value',DESC:'If provided, the element\'s attribute will be set to this value'}}*/
		if(e){if(_v){e.setAttribute(a,_v);}else{return e.getAttribute(a)}}return false},getdoc:function(n){while(n.nodeType!=9){n=n.parentNode;}return n;},
	ins:function(p,tag,aa,_html,b){var i;var elm=document.createElement(tag);if(_html){elm.innerHTML=_html;}p=this.$$(p);if(aa){for(i=0;i<aa.length;i+=2){this.att(elm,aa[i],aa[i+1]);}}if(p){if(b==true){return p.insertBefore(elm,p.firstChild);}else if(b){return p.insertBefore(elm,b);}else{return p.appendChild(elm);}}else{return elm}},
	insvg:function(p,tag,aa,_html,b){var i;var elm=document.createElementNS('http://www.w3.org/2000/svg',tag);if(_html){elm.innerHTML=_html;}p=this.$$(p);if(aa){for(i=0;i<aa.length;i+=2){
		elm.setAttribute(aa[i],aa[i+1]);
	}}if(p){if(b==true){return p.insertBefore(elm,p.firstChild);}else if(b){return p.insertBefore(elm,b);}else{return p.appendChild(elm);}}else{return elm}},
	move:function(elm,p,atbegin){p=this.$$(p);elm=this.$$(elm);if(atbegin){p.insertBefore(elm,p.firstChild)}else{p.appendChild(elm.parentNode.removeChild(elm));}},
	clearchilds:function(elm){/*{R:'void'}*/
		elm=this.$$(elm);if(elm&&elm.hasChildNodes&&elm.removeChild){while(elm.hasChildNodes()){elm.removeChild(elm.firstChild);}}},
/* ----------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------- XPATH + XML + XHR UTILS --- */
	selone:function(xpath,n,_doc){if(!n){return null;};if(this.isIE){return n.selectSingleNode(xpath);}else{if(!_doc){_doc=this.getdoc(n);}var xx=_doc.evaluate(xpath,n,null,XPathResult.ANY_TYPE,null);if(xx.resultType==1){return xx.numberValue}else{return xx.iterateNext();}}},
	sel:function(xpath,n,_doc){if(!n){return [];};var x=null;var xx=new Array();var xxx=null;if(this.isIE){if(this.isIE9||this.isIE10){x=this._IE9sel(xpath,n);}else{x=n.selectNodes(xpath);}xxx=x.nextNode();while(xxx){xx[xx.length]=xxx;xxx=x.nextNode();}return xx;}
		else{if(!_doc){_doc=this.getdoc(n);}x=_doc.evaluate(xpath,n,null,XPathResult.ANY_TYPE,null);if(x.resultType!=4){xx=[x.numberValue]}else{xxx=x.iterateNext();while(xxx){xx[xx.length]=xxx;xxx=x.iterateNext();}}return xx;}},
		_IE9sel:function(xpath,n){var xml='<?xml version="1.0" encoding="utf-8" ?>\n'+this.xml(n,false);var xD=new ActiveXObject("Microsoft.XMLDOM");var objNodeList;xD.loadXML(xml);if(xD.parseError.errorCode!=0){var myErr=xD.parseError;throw new Error(myErr.reason+'\n Parsing :\n'+xml);}else{xD.setProperty("SelectionLanguage", "XPath");try{return xD.documentElement.selectNodes(xpath);}catch(tex){var i=0;}}},
	xmlparse:function(xml){var xD=false;try{var xP=new DOMParser();xD=xP.parseFromString(xml,"text/xml");}catch(zz){try{xD=new ActiveXObject("Microsoft.XMLDOM");xD.async=false;xD.loadXML(xml);}catch(z){return zz.message;}}return xD;},
	load:function(url,_elm,_onfinish,_onstep,_onerror,_mem){var req=this._req();var $this=this;req.onreadystatechange=function(ev){
		$this._doload(ev,_elm,_onfinish,_onstep,_onerror,_mem);};if(!_elm){req.open("GET",url,true);req.send('');}
		else{var hasfile=false;if(!hasfile){req.open("POST",url,true);req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    		console.log('todo:serialize');req.send($this.serialize(_elm))}
			else{console.log('todo:file upload');}}return false;},
	_req:function(){var rq=false;if(window.XMLHttpRequest&&!(window.ActiveXObject)){try{rq=new XMLHttpRequest();}catch(exk){rq=false;}}else if(window.ActiveXObject){try{rq=new ActiveXObject("Msxml2.XMLHTTP");}catch(ex){try{rq=new ActiveXObject("Microsoft.XMLHTTP");}catch(exx){rq=false;}}}if(!rq){console.log('This browser is neither w3c or mozilla compatible*[2008], uno.xml javascript framework will not work.');}return rq;},
 	_doload:function(ev,_elm,_onfinish,_onstep,_onerror,_mem){var req=(ev.currentTarget||ev.target||ev.srcElement);if(req.readyState>1&&req.readyState<4){if(req.status==200){if(_onstep)_onstep(req);}
		}else if(req.readyState==4){if(req.status==200){_onfinish(req,_mem);}else{console.log('Request failed');console.log(req);if(_onerror){_onerror(req)}}}},
/* ----------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------- FILES PRELOAD and CACHING --- */
	preloaded:{},preload:function(t,prop,_next,_reserved){/*{R:'void',DESC:'preloads resources froma uri, optionally posting data, then retrieves and stores selected prop from the response in the preloaded object list',t:{T:'string||string array',DESC:'one or more uris to preload'},prop:{T:'string',DESC:'the name of the property to store from the response'},_next:{T:'function',DESC:'If provided, will be called when all the resources have been preloaded'},_reserved:{T:'reserved',DESC:'reserved'}}*/
		if(!_reserved){if(t instanceof Array){this.Rpreloading=t;this.preload(false,prop,_next,true);
		}else{if(this.preloaded[t]){_next(this.preloaded)}else{var $this=this;
			this.load(t,false,function(req){$this.preloaded[t]=req[prop];_next($this.preloaded);});}}
		}else{var x;var flag=true;for(x=0;x<this.Rpreloading.length;x++){
			if(!this.preloaded[this.Rpreloading[x]]){var $this=this;var k=this.Rpreloading[x];flag=false;
				this.load(k,false,function(req){$this.preloaded[k]=req[prop];$this.preload(false,prop,_next,true);});
		break}}if(flag){delete this.Rpreloading;_next(this.preloaded);}}},
/* ----------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------ JSON RENDER ENGINE --- */
	rrgx0:new RegExp('<!--TT{([^>]*)}TT-->'),rrgxXX:new RegExp('<!--JSX@([^{]*){([^}]*)}([^@]*)@JSX-->','g'),rrgx1:new RegExp('<!--JS{([^>]*)}JS-->'),rrgx2:new RegExp('JS-([^=]+)="([^"]*)"'),
	rrgxLAST:new RegExp('<!--LOAD{([^>]*)}LOAD-->'),rrgxSCRIPT:/<script\b[^>]*>([\s\S]*?)<\/script>/gm,
	/*var rxs=/(<|%3C)script[\s\S]*?(>|%3E)[\s\S]*?(<|%3C)(\/|%2F)script[\s\S]*?(>|%3E)/gi;*/
	run_scripts:function(t,keep){let rr=this.rrgxSCRIPT.exec(t);while(rr!=null){if(!keep){t=t.replace(rr[0],'');}try{eval(rr[1])}catch(ex){console.log('ERROR evaluating:'+ex.message)}rr=this.rrgxSCRIPT.exec(t);}return t;},
	render:function(tgt,tpl,data,_mode,_norun){if(!_mode){_mode='normal'}var out=this._render(tpl,data,false,_norun);this._renderfill(tgt,out[0],_mode,out[1]);},
	_render:function(t,d,_alpha,_norun){/*{R:'string',DESC:'performs evaluation of specially marked string templates, using an object instance as data',t:{T:'string',DESC:'the starting template string'},d:{T:'object','the object onto wich evaluate template expression against (referred as this in the template)'}}*/
		var rnd=Math.floor(Math.random()*1000000000).toString();t=t.replace(/%UNIQUEID/g,rnd);
						let ridx;
						do{
						ridx=t.indexOf("<!--JS#"); let rpcode=t.substring(ridx+7,t.indexOf('{', ridx));
						let potentialdeeper="";
						if(ridx != -1){
							let endidx=t.indexOf('}'+rpcode+'#JS-->');
							potentialdeeper=t.substring(ridx+8+rpcode.length,endidx);
							let rpArr=null;let insideoutput=[];
							if(rpcode==''){rpArr=eval("(d"+((typeof _alpha == "number")?"["+_alpha+"]":"")+")");}
							else{rpArr=eval("(d"+((typeof _alpha == "number")?"["+_alpha+"]":"")+"."+rpcode+")");}
							for(let rpK=0;rpK<rpArr.length;rpK++){
								let returned_render = this._render(potentialdeeper,rpArr,rpK);
								insideoutput.push(returned_render[0]);
							}
							t=t.substr(0,ridx)+insideoutput.join("")+t.substr(endidx+8+rpcode.length, t.length-1)
						}
						if(typeof _alpha == "number"){ /*console.log(t);*/t=t.replace(/%ARRIDX%/g, _alpha); /*console.log(t);*/}
						}while(ridx != -1)
		var tmp='';var rr=null;var jj=[];d.tmpfn=function(j){try{return eval(j)}catch(ex){return ex.message}};
		rr=this.rrgxXX.exec(t);while(rr!=null){tmp='';ridx=rr[1];
			let F=false;if(it3.inoe(ridx)){F=d;ridx='';}else{F=d[ridx];ridx='.'+ridx;}
			//for(let f=0;f<F.length;f++){tmp=tmp+this._render('<!--JS{'+rr[2].replace('this.','this'+ridx+'['+f+'].')+'}JS-->\n',F[f])[0];}
			for(let f=0;f<F.length;f++){tmp=tmp+this._render('<!--JS{'+rr[2]+'}JS-->\n',F[f])[0];}
			//for(let f=0;f<F.length;f++){tmp=tmp+this._render(rr[2],F[f])[0];}
			t=t.replace(rr[0],tmp);rr=this.rrgxXX.exec(t);
		}
		rr=this.rrgx0.exec(t);while(rr!=null){t=t.replace(rr[0],this.preloaded[rr[1]]);rr=this.rrgx0.exec(t);}
		rr=this.rrgx1.exec(t);while(rr!=null){tmp=d.tmpfn(rr[1]);t=t.replace(rr[0],tmp);rr=this.rrgx1.exec(t);}
		rr=this.rrgx2.exec(t);while(rr!=null){tmp=d.tmpfn(rr[2]);t=t.replace(rr[0],rr[1]+'="'+tmp+'"');rr=this.rrgx2.exec(t);}
		rr=this.rrgxLAST.exec(t);while(rr!=null){t=t.replace(rr[0],'');jj[jj.length]=rr[1];rr=this.rrgxLAST.exec(t);}
		if(!_norun){this.run_scripts(t);}
		delete d.tmpfn;return [t,jj]
	},
	_renderfill:function(tgt,s,m,jj){tgt=this.$$(tgt);if(tgt.get){tgt=tgt.get(0)}{}if(tgt.nodeName.toLowerCase()=='table'){console.log('todo:target is table')}
		else{if(m=='normal'){tgt.innerHTML=s;}else{var n=document.createElement('div');n.innerHTML=s;
			if(m=='append'){tgt.appendChild(n);}else if(m=='insert'){tgt.insertBefore(n,tgt.firstChild);}else{console.log('unsupported mode')}
		}}if(jj.length>0){var $this=this;var post=function(){$this._renderpost(jj);};setTimeout(post,100);}},
	_renderpost:function(jj){for(var j=0;j<jj.length;j++){try{eval(jj[j])}catch(ex){console.log('Error postloading render: '+ex.message);}}},
/* ----------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------ HTML5 AUTOCOMPLETE --- */
	actbremove:function(elm){elm=this.$$(elm);if(elm){if(this._actbs[elm.id]){delete this._actbs[elm.id]; return true}}return false},
	actb:function(elm){elm=this.$$(elm);var auid=this.uid();if(this.inoe(elm.id)){elm.id=auid;}if(this._actbs[elm.id]){return this._actbs[elm.id]}else{
		var $this=this;var ACTB={uid:auid,TEXTBOX:elm,GHOST:null,min:3,enabled:true,clear:$this._ACTBclear,onkeypress:$this._ACTBonkeypress,setvalue:$this._ACTBsetvalue,suggest:$this._ACTBsuggest,onsuggest:$this._ACTBonsuggest,setenabled:$this._ACTBsetenabled,_init:$this._ACTBinit};ACTB._init(this);
		this._actbs[elm.id]=ACTB;return this._actbs[elm.id]}},_actbs:{},
	_ACTBinit:function($){this.GHOST=$.ins(this.TEXTBOX.parentNode,'div',['style','position:absolute;display:none;z-index:100','class','autocompleteghost']);
		this.TEXTBOX.setAttribute('onkeyup','it3.actb(this.id).onkeypress()');
		this.TEXTBOX.setAttribute('onblur','setTimeout(\'it3.actb(\\\''+this.TEXTBOX.id+'\\\').clear()\',250);return true;');},
	_ACTBclear:function(){clearTimeout(window.autoctimeout);this.GHOST.style.display='none';it3.clearchilds(this.GHOST);},
	_ACTBonkeypress:function(){clearTimeout(window.autoctimeout);var $this=this;
		window.autoctimeout=setTimeout(function(){var v=$this.TEXTBOX.value.split(' ');$this.suggest(v[v.length-1]);},500);},
	_ACTBsuggest:function(w){if(this.enabled){this.clear();if(w.length>=this.min){this.GHOST.style.display='';var $this=this;f$.db.autocomplete(w,function(r){$this.onsuggest(r,$this)})}}},
	_ACTBsetvalue:function(w){var vv=this.TEXTBOX.value.split(' ');if(vv.length<2){this.TEXTBOX.value=w}else{this.TEXTBOX.value='';for(var v=0;v<vv.length-1;v++){this.TEXTBOX.value+=vv[v]+' '}this.TEXTBOX.value+=w}this.clear();},
	_ACTBonsuggest:function(w,$this){if($this.enabled){it3.ins($this.GHOST,'button',
		['class','actbresult',
		'onclick','it3.fix(event);var ACTB=it3.actb(\''+$this.TEXTBOX.id+'\');ACTB.setvalue(\''+w.replace('\'','\\\'')+'\');ACTB.TEXTBOX.focus();if(ACTB.TEXTBOX.onsubmit){ACTB.TEXTBOX.onsubmit()}'],w)}},
	_ACTBsetenabled:function(enabled){this.enabled=enabled;if(!enabled){this.clear()}},
/* ----------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------ HTML5 JSON TABLE FACTORY --- */
	tableremove:function(elm){elm=this.$$(elm);if(elm){if(this._tables[elm.id]){delete this._tables[elm.id]; return true}}return false},
	table:function(elm){elm=this.$$(elm);var tuid=this.uid();if(this.inoe(elm.id)){elm.id=tuid;}if(this._tables[elm.id]){return this._tables[elm.id]}else{
		this._tables[elm.id]=new this.Table(tuid,elm);return this._tables[elm.id]}},_tables:{},

/* ----------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------ DATA STRUCTURES -------- --- */
	
};

/* ----------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- HTML5 JSON TABLE --- */
it3.Table=function(uid,elm){this.uid=uid;this.TABLE=elm;this.cols={};this.ignore={};this.colstot=0;this.ignorecol={};this.fncol={};this.hidden={};this.init();};
it3.Table.prototype={
	init:function(){//th parse and rebuild + tabletools
		var th=this.TABLE.getElementsByTagName('th');
		//tr parse and typeguess
		//layout + foot
		var TID=this.TABLE.id;
		//table tools
		var tools=it3.ins(this.TABLE.parentNode,'div',['class','html5tabletools','style','position:relative;top:-25px;'],false,this.TABLE);
		it3.ins(tools,'button',['onclick','if(this.classList.contains(\'nocheck\')){this.classList.remove(\'nocheck\');this.firstChild.classList.remove(\'ion-android-checkbox-outline-blank\');this.firstChild.classList.add(\'ion-android-checkbox\');'+it3.NS+'.table(\''+TID+'\').selectall();}else{this.classList.add(\'nocheck\');this.firstChild.classList.add(\'ion-android-checkbox-outline-blank\');this.firstChild.classList.remove(\'ion-android-checkbox\');'+it3.NS+'.table(\''+TID+'\').selectnone();}','class','nocheck'],'<i class="icon ion-android-checkbox-outline-blank"></i>');
		it3.ins(tools,'button',['onclick',it3.NS+'.table(\''+TID+'\').invertsel();this.previousElementSibling.classList.add(\'nocheck\');this.previousElementSibling.firstChild.classList.add(\'ion-android-checkbox-outline-blank\');this.previousElementSibling.firstChild.classList.remove(\'ion-android-checkbox\');'],'<i class="icon ion-arrow-swap"></i> Inverti selezione');
		it3.ins(tools,'button',['id',this.TABLE.id+'cpb'],'<i class="fa fa-copy"></i> Copia');		
		it3.ins(tools,'button',['onclick',it3.NS+'.table(\''+TID+'\').xls()'],'<i class="fa fa-file-excel-o"></i> Esporta excel');
		it3.ins(tools,'button',['onclick',it3.NS+'.table(\''+TID+'\').csv()'],'<i class="icon ion-android-document"></i> Esporta csv');
		if(window.clipexport){window.clipexport.destroy();}window.clipexport=new Clipboard('#'+TID+'cpb',{text:function(trigger){return it3.table(TID).copy();}});
		//sort controls
		
		//scroll event
		this.TABLE.parentNode.setAttribute('onscroll',it3.NS+'.table(\''+this.TABLE.id+'\').onscroll(this)');setTimeout(it3.NS+'.table(\''+this.TABLE.id+'\').onscroll('+it3.NS+'.$$(\''+this.TABLE.id+'\').parentNode)',25);
	},	
	reset:function(){console.log('todo');},
	onscroll:function(Tparent){var s='transform:translate(Xpx,Ypx);background-color:#0F0;border-bottom:1px solid #0F0';
		Tparent.firstChild.setAttribute('style','position:relative;top:-25px;'+('transform:translate(Xpx,Ypx);').replace('X',Tparent.scrollLeft).replace('Y',(Tparent.scrollTop)));
		var ee=Tparent.getElementsByTagName('tr')[0];if(ee){ee=ee.getElementsByTagName('th');for(var e =0;e<ee.length;e++){ee[e].setAttribute('style',s.replace('X',0).replace('Y',(-25+Tparent.scrollTop)));}}},
	add:function(json){var x;var out='';var d=json;for(x in d){if(!this.cols[x]){if(!this.ignorecol[x]){
		this.cols[x]={idx:this.colstot};this.colstot++;it3.ins(this.TABLE.tHead.rows[0],'th',false,'<b>'+x+'</b>');}}}
		setTimeout('var id=\''+this.TABLE.id+'\';it3.table(id).onscroll(it3.$$(id).parentNode)',25);
		var tr=document.getElementsByClassName(this.uid+d['$key'].replace(/ /g,''))[0];if(tr){it3.clearchilds(tr);}
		else {tr=document.createElement('tr');tr=this.TABLE.tBodies[0].insertRow(tr);tr.classList.add(this.uid+d['$key'].replace(/ /g,''));tr.setAttribute('onclick','this.classList.toggle("selected")');}
		var td=document.createElement('td');if(!d['doctitle']){d['doctitle']=d.$key.substr(d.$key.indexOf('-')+1).replace('*','.');}
		td.innerHTML='<a target="_blank" onclick="it3.fix(event);return app.dialog(\''+d['$key']+'\');return false;" href="'+HOST+'/?'+d['url']+'" /><i class="fa fa-external-link"></i></a><a href="#" onclick="it3.fix(event);return app.details(\''+d['$key']+'\')" draggable="true" ondragstart="app.drag(\''+d['$key']+'\',\''+d[f$.db.docnamefield].replace('\'','\\\'')+'\')" ondragover="event.preventDefault()" ondrop="fix(event);app.drop(\''+d['$key']+'\',\''+d[f$.db.docnamefield]+'\')"> '+d[f$.db.docnamefield]+'</a>';
		tr.appendChild(td);for(var o in this.cols){if(!this.ignorecol[o]){td=document.createElement('td');
			if(this.fncol[o]){td.innerHTML=this.fncol[o](d);}else if(d[o]){if(d[o].join){td.innerHTML=d[o].join(', ')} 
			else if(typeof d[o]=='number'){td.innerHTML=d[o].toLocaleString()}
			else if(typeof d[o]=='string'){d[o]=d[o].replace(/<.*\/>/g,' ');d[o]=d[o].replace(/\s/g,' ');
					d[o]=d[o].replace(/<([^>]+)\/>/g,' ');d[o]=d[o].replace(/(<([^>]+)>)/ig,'');d[o]=d[o].replace(/<link .*>/g,' ');
				if(d[o].length>100){d[o]=d[o].substring(0,95)+'[...]'}td.innerText=d[o]}
			}else{td.innerText='';}tr.appendChild(td);}}},
	addcol:function(prop,alias,sort,filter,sample){
		
	},
	remove:function(d){var k=d.$key||(d.key||d.toString());var tr=document.getElementsByClassName(this.uid+k.replace(/ /g,''))[0];if(tr){tr.parentElement.removeChild(tr)}},
	csv:function(){var sss=this.copy();var lnk=it3.$$(this.TABLE.id+'dl');if(lnk){lnk.parentNode.removeChild(lnk)};
		lnk=it3.makebloblink(sss,'risultati.csv','text/csv',this.TABLE.id+'dl');this.TABLE.parentNode.firstChild.appendChild(lnk);},
	xls:function(){var ccc=this.cols;var rc=0;var c;var cc=[];for(c in ccc){cc[cc.length]=c}
		var hh='<ss:Row>';for(c=0;c<cc.length;c++){if(!this.hidden[cc[c]]){hh+='<ss:Cell><ss:Data ss:Type="String">';hh+=cc[c]+'</ss:Data></ss:Cell>';rc++;}}hh+='</ss:Row>\n';
		var rrr=this.TABLE.tBodies[0].getElementsByClassName('selected');if(rrr.length<1){rrr=this.TABLE.tBodies[0].getElementsByTagName('tr');}
		var r=0;var rr=rrr[r];var tc=[];while(rr){tc=rr.getElementsByTagName('td');if(tc.length>0){hh+='<ss:Row>';
		for(c=0;c<tc.length;c++){hh+='<ss:Cell><ss:Data ss:Type="String">';hh+=tc[c].innerText.replace(/&/g,'&amp;')+'</ss:Data></ss:Cell>';}hh+='</ss:Row>\n';}r++;rr=rrr[r];}
		var lnk=it3.$$(this.TABLE.id+'dl');if(lnk){lnk.parentNode.removeChild(lnk)};lnk=it3.makebloblink('<?xml version="1.0"?><ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n<ss:Worksheet ss:Name="Sheet1">\n<ss:Table>\n\n'+
		hh +'</ss:Table></ss:Worksheet></ss:Workbook>','risultati.xls','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',this.TABLE.id+'dl');
		this.TABLE.parentNode.firstChild.appendChild(lnk);},
	copy:function(){var ccc=this.cols;var rc=0;var c;var cc=[];for(c in ccc){cc[cc.length]=c}
		var hh='';for(c=0;c<cc.length;c++){if(!this.hidden[cc[c]]){hh+='"'+cc[c].replace(/"/g,'\"')+'",';rc++;}}hh=hh.substr(0,hh.length-1);hh+='\n';
		var rrr=this.TABLE.tBodies[0].getElementsByClassName('selected');if(rrr.length<1){rrr=this.TABLE.tBodies[0].getElementsByTagName('tr');}
		var r=0;var rr=rrr[r];var tc=[];var tmps;while(rr){tc=rr.getElementsByTagName('td');if(tc.length>0){
		for(c=0;c<tc.length;c++){tmps='"'+tc[c].innerText.replace(/"/g,'""')+'"';if(tmps=='""'){tmps=''}hh+=tmps+','}hh=hh.substr(0,hh.length-1);hh+='\n';}r++;rr=rrr[r];}
		return hh;},
	getsel:function(){console.log('todo')},
	selectall:function(){var $t=this.TABLE.tBodies[0].getElementsByTagName('tr');for(var i=0;i<$t.length;i++){$t[i].classList.add('selected');}},
	selectnone:function(){var $t=this.TABLE.tBodies[0].getElementsByTagName('tr');for(var i=0;i<$t.length;i++){$t[i].classList.remove('selected');}},
	invertsel:function(){var $t=this.TABLE.tBodies[0].getElementsByTagName('tr');for(var i=0;i<$t.length;i++){$t[i].classList.toggle('selected');}},
	sort:function(idx,_desc){console.log('todo')},
	filter:function(_idx){console.log('todo')},
	togglecol:function(idx,_forcevisible){}
};
if(window.noloadcopy!=true){
it3.ins(document.head,'script',['src','https://cdn.jsdelivr.net/gh/zenorocha/clipboard.js/dist/clipboard.min.js']);
}
if(window.it3_onload){window.it3_onload();}
/*
	date : YYYYMMDD DD/MM/YY MM/DD/YY
	time :
	datetime :
	currency : 
	number :
	string
*/
/*
	filter : single - range - text
*/






//NEW-OPEN-FROM-TEMPLATE-EXPORT
//SOURCES-ADDSOURCE-SAVE-PREVIEW-ADDPAGE-REMPAGE



/*
window.NS={};
NS.Bottiglia=function(target){this.name='B';this.cc='';this.target=target;this.init()}
NS.Bottiglia.prototype={
	init(){
		this.button=it3.ins(document.body,'div',[],'ciao');
		var gh=this.resized;let _this=this;
		elm.addEventListener('click',function(ev){_this.resized(ev)});
	},
	get_name:function(){return this.name},
	get_fake:function(){return 'ciao'},
	resized:function(ev){
		console.log(ev);
		console.log(this.get_fake());
	}
};
var T= new Bottiglia();*/




/*
async function AT(a,b){
	await sleep(3000);
	return (a+b);
};
var c=await AT(1,1);
console.log(c);
*/




/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */