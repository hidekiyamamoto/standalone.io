import {AddonInterface,ModelInterface} from "../newdoo-addon.js";
import {it4} from "../../it4.js";
import * as models from "./website-models.js";
const module_name='website';
var addon=new AddonInterface(module_name);
addon.actions.push({key:module_name+'_all_fragment_groups',fn:async function(CX){
	let ff=await NEWDOO.storage.query('website_fragment');
	let TT={};let now=new Date();
	for(let f=0;f<ff.length;f++){
		if(TT[ff[f].group]){TT[ff[f].group].fragments.push(ff[f]);}
		else{TT[ff[f].group]={id:ff[f].group,group:ff[f].group,fragments:[ff[f]],active:true,created:now,modified:now,created_by:window.EMAIL,modified_by:window.EMAIL}}
	}let TTT=[];for(let t in TT){TTT.push(TT[t])}
	NEWDOO.UI_update_results('website_fragment_group',false,TTT);
}});
addon.widgets.content=function(model_name,field_name,view_mode,editable,value){
	let out=NEWDOO.widgets.text(model_name,field_name,view_mode,editable);
	out=out.replace('textarea','div contenteditable="true"');
	out=out.replace('class="','class="textarea ');
	out=out.split('').reverse().join('');
	out=out.replace('aeratxet','vid');
	out=out.split('').reverse().join('');
	if(editable){out=out.replace('NEWDOO.UTILS.htmlentities(this.'+field_name+')',"NEWDOO.addons['website'].texteditconvert(this."+field_name+")");}
	return out;
};
addon.get_frag_from_g=async function(g){
		let F=await NEWDOO.storage.query('website_fragment',['group','==',g,'lang','==',currLANG]);
		if(F.length==0){F=await NEWDOO.storage.query('website_fragment',['group','==',g,'lang','==','eng']);}
		if(F.length==0){F=await NEWDOO.storage.query('website_fragment',['group','==',g,'lang','==','ita']);}
		if(F.length==0){F=await NEWDOO.storage.query('website_fragment',['group','==',g]);}
		if(F.length>0){F=F[0];return F;}else{return false}
};
addon.open_frag_from_g=async function(g){let doc=await this.get_frag_from_g(g);NEWDOO.open_document(doc,false,'website_fragment');};
addon.texteditconvert=function(html){
	html=NEWDOO.UTILS.unhtmlentities(html);
	let mm=html.matchAll(/<fragment([^\/]*)\/>/g);let TT=[];
	let m=mm.next();let tmp='';let faa={};let fa='';let a=false;
	let aa=new RegExp('[^a-z]*([^=]*)=[^"]*"([^"]*)"');
	while(m.value){let t=m.value[1];a=aa.exec(t);while(a!=null){t=t.replace(a[0],'');faa[a[1].trim()]=a[2].trim();a=aa.exec(t);}
		tmp='<div contenteditable="false" style="display:inline-block;font-weight:bold;" onclick="it3.fix(event);NEWDOO.addons[\'website\'].open_frag_from_g(\''+faa['x-name']+'\')">'+NEWDOO.UTILS.htmlentities(m.value[0])+'</div>';
		TT.push(tmp);
		html=html.replace(m.value[0],':X:'+(TT.length-1)+':X');
		m=mm.next();
	}
	html=NEWDOO.UTILS.htmlentities(html);
	for(let t=0;t<TT.length;t++){html=html.replace(':X:'+t+':X',TT[t]);}
	return html;
};
addon.content_save=function(model_name,field_name,doc,v){
	v=NEWDOO.UTILS.unhtmlentities(v);v=v.replace(/<br>/g,'\n');
	let xx=it4.render.next_token(v,'<div conte','</div>','<div ');
	while(xx){v=v.replace(xx[0],xx[1].substr(xx[1].indexOf('>')+1));
		xx=it4.render.next_token(v,'<div conte','</div>','<div ');
	}doc[field_name]=v;
	return v
};

addon.menu.push({key:module_name+'_menu_groups',action:module_name+'_all_fragment_groups',text:'Fragment Groups'});
for(let k in models){addon.addModel(models[k]);}
export {addon}
