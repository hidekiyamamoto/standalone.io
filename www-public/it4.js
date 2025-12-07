var it4={};
it4.RenderEngine=function(prefix){this.preloaded={};this.prefix=prefix;
	this.rrgxXX=new RegExp('<!--'+prefix+'X@([^{]*){([^}]*)}([^@]*)@'+prefix+'X-->','g'),
	this.rrgx1=new RegExp('<!--'+prefix+'{([^>]*)}'+prefix+'-->'),
	this.rrgx2=new RegExp(prefix+'-([^=]+)="([^"]*)"'),
	this.rrgxLAST=new RegExp('<!--LOAD{([^>]*)}LOAD-->'),
	this.rrgx0=new RegExp('<!--PRE{([^>]*)}PRE-->'),
	this.rrgxSCRIPT=/<script\b[^>]*>([\s\S]*?)<\/script>/gm;
};
it4.RenderEngine.prototype={
	string:function(t,d,_alpha,_norun){/*{R:'string',DESC:'performs evaluation of specially marked string templates, using an object instance as data',t:{T:'string',DESC:'the starting template string'},d:{T:'object','the object onto wich evaluate template expression against (referred as this in the template)'}}*/
		//console.log(t);console.log(d);
		let ridx;
						do{
						ridx=t.indexOf("<!--"+this.prefix+"#"); let rpcode=t.substring(ridx+7,t.indexOf('{', ridx));
						let potentialdeeper="";
						if(ridx != -1){
							let endidx=t.indexOf('}'+rpcode+'#'+this.prefix+'-->');
							potentialdeeper=t.substring(ridx+8+rpcode.length,endidx);
							let rpArr=null;let insideoutput=[];
							if(rpcode==''){rpArr=eval("(d"+((typeof _alpha == "number")?"["+_alpha+"]":"")+")");}
							else{rpArr=eval("(d"+((typeof _alpha == "number")?"["+_alpha+"]":"")+"."+rpcode+")");}
							for(let rpK=0;rpK<rpArr.length;rpK++){
								let returned_render = this.string(potentialdeeper,rpArr,rpK);
								insideoutput.push(returned_render[0]);
							}
							t=t.substr(0,ridx)+insideoutput.join("")+t.substr(endidx+8+rpcode.length, t.length-1)
						}
						//console.log(t);
						if(typeof _alpha == "number"){ /*console.log(t);*/t=t.replace(/%ARRIDX%/g, _alpha); /*console.log(t);*/}
						}while(ridx != -1)
		
		var rnd=Math.floor(Math.random()*1000000000).toString();t=t.replace(/%UNIQUEID/g,rnd);
		var tmp='';var rr=null;var jj=[];d.tmpfn=function(j){try{return eval(j)}catch(ex){return ex.message}};
		rr=this.next_token(t,'<!--'+this.prefix+'X@','@'+this.prefix+'X-->');while(rr){tmp='';
			ridx=rr[1].substr(0,rr[1].indexOf('{'));rr[1]=rr[1].substring(ridx.length+1);rr[1]=rr[1].substring(0,rr[1].length-(ridx.length+1));
			let F=false;if(it3.inoe(ridx)){F=d;ridx='';}else{F=d[ridx];ridx='.'+ridx;}
			for(let f=0;f<F.length;f++){tmp=tmp+this.string(rr[1],F[f])[0];}
			t=t.replace(rr[0],tmp);rr=this.next_token(t,'<!--'+this.prefix+'X@','@'+this.prefix+'X-->');
		}
		rr=this.rrgx0.exec(t);while(rr!=null){t=t.replace(rr[0],this.preloaded[rr[1]]||'Preloaded not found '+rr[1]);rr=this.rrgx0.exec(t);}
		rr=this.rrgx1.exec(t);while(rr!=null){tmp=d.tmpfn(rr[1]);t=t.replace(rr[0],tmp);rr=this.rrgx1.exec(t);}
		rr=this.rrgx2.exec(t);while(rr!=null){tmp=d.tmpfn(rr[2]);t=t.replace(rr[0],rr[1]+'="'+tmp+'"');rr=this.rrgx2.exec(t);}
		rr=this.rrgxLAST.exec(t);while(rr!=null){t=t.replace(rr[0],'');jj[jj.length]=rr[1];rr=this.rrgxLAST.exec(t);}
		if(!_norun){this.run_scripts(t);}
		delete d.tmpfn;return [t,jj]
	},
	to:function(tgt,tpl,data,_mode,_norun){if(!_mode){_mode='normal'}var out=this.string(tpl,data,false,_norun);this._renderfill(tgt,out[0],_mode,out[1]);},
	run_scripts:function(t,keep){let rr=this.rrgxSCRIPT.exec(t);while(rr!=null){if(!keep){t=t.replace(rr[0],'');}try{eval(rr[1])}catch(ex){console.log('ERROR evaluating:'+ex.message)}rr=this.rrgxSCRIPT.exec(t);}return t;},
	_renderfill:function(tgt,s,m,jj){if(tgt.get){tgt=tgt.get(0)}{}if(tgt.nodeName.toLowerCase()=='table'){console.log('todo:target is table')}
		else{if(m=='normal'){tgt.innerHTML=s;}else{var n=document.createElement('div');n.innerHTML=s;
			if(m=='append'){tgt.appendChild(n);}else if(m=='insert'){tgt.insertBefore(n,tgt.firstChild);}else{console.log('unsupported mode')}
		}}if(jj.length>0){var $this=this;var post=function(){$this._renderpost(jj);};setTimeout(post,100);}},
	_renderpost:function(jj){for(var j=0;j<jj.length;j++){try{eval(jj[j])}catch(ex){console.log('Error postloading render: '+ex.message);}}},
	next_token:function(value,start,end,_generalstart){if(!_generalstart){_generalstart=start}
		let s=value.indexOf(start);if(s<0){return false}let e=value.indexOf(end,s+1);let ps=value.indexOf(_generalstart,s+1);let te=0;
		while((e>ps)&&(ps>0)){ps=value.indexOf(_generalstart,ps+1);te=value.indexOf(end,e+1);if(te>-1){e=te}}
		return [value.substring(s,e+end.length),value.substring(s+start.length,e),{s:s,e:e,ps:ps,te:te}];
	}
};
it4.render=new it4.RenderEngine('JS');
export {it4}