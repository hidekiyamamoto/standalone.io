import {StorageInterface} from "./newdoo-storage.js";

var STORAGE_LOCAL=new StorageInterface('local');
var app=false;var db=false;var storage=false;
const createUID=function(model_name){
	return (+new Date())+'R'+(Math.floor((Math.random()*10000000))+parseInt(Math.floor(Math.random()*10)+'0000000'));
};
var DB=null;

var getObjStore=function(model_name,mode){mode=mode||'readwrite';
	/*if(!DB.objectStoreNames.contains(model_name)){
		let T=DB.transaction(model_name,mode);
		return T.objectStore(model_name);
	}else{*/
		let T=DB.transaction(model_name,mode);
		return T.objectStore(model_name);
	//}
};
STORAGE_LOCAL.init=function(s_config){if(!s_config){s_config={localstorageDB:'newdoo'}}else if(!s_config.localstorageDB){s_config.localstorageDB='newdoo';}
	return new Promise(async function(resolve,reject){let v=1;
		let dbs=await indexedDB.databases();for(let k=0;k<dbs.length;k++){if(dbs[k].name==s_config.localstorageDB){v=dbs[k].version;break;}}
		let request=window.indexedDB.open(s_config.localstorageDB,v);console.log(v);
		request.onerror=function(error){console.log('Error opening local storage:'+request.error);resolve(request.error);};
		request.onsuccess=function(ev){DB=request.result;let doit=false;
			resolve('ok');
			for(let k in NEWDOO.models){if(!NEWDOO.models[k].virtual){
				if(!DB.objectStoreNames.contains(NEWDOO.models[k].name)){
					doit=true;break;
			}}}if(!doit){resolve('ok');}else{
				DB.close();
				v=v+1;
				let urequest=window.indexedDB.open(s_config.localstorageDB,v);
				urequest.onerror=function(error){console.log('Error opening local storage:'+request.error);resolve(request.error);};
				urequest.onsuccess=function(ev){DB=request.result;let dotit=false;};
				urequest.onupgradeneeded=function(ev){DB=ev.target.result;console.log('UPDATING db...');
					for(let k in NEWDOO.models){if(!NEWDOO.models[k].virtual){
					if(!DB.objectStoreNames.contains(k)){
						let userObjectStore = DB.createObjectStore(k,{autoIncrement:false});
				}	}	}	};
				resolve('ok');
			}
		};
		
});};
/**/
STORAGE_LOCAL.create=function(model_name,docData){return new Promise(async function(resolve,reject){
	let OS=getObjStore(model_name);
	let uid=createUID(model_name);
	let request=OS.add(docData,uid);
	request.onsuccess=function(result){resolve(uid);};
	request.onerror=function(error){console.log('Error storing new document to local storage:'+request.error);resolve(uid);};
});};
STORAGE_LOCAL.update=function(model_name,doc_id,doc_data){return new Promise(async function(resolve,reject){
	let doc=await STORAGE_LOCAL.read(model_name,doc_id);
	for(let k in doc_data){doc[k]=doc_data[k]}
	let OS=getObjStore(model_name);
	let request=OS.put(doc,doc_id);request.onsuccess=function(result){resolve(false);};
	request.onerror=function(error){console.log('Error updating document to local storage:'+request.error);resolve(true);};
});};
STORAGE_LOCAL.done={};
STORAGE_LOCAL.query=function(model_name,ww,max){max=max||80;return new Promise(async function(resolve,reject){let OS=getObjStore(model_name);
	if(OS){
		let TT=[];
		OS.openCursor().onsuccess=function(ev){
		let c=ev.target.result;if(c){TT.push(c.value);
			TT[TT.length-1].id=c.primaryKey;
			var listItem = document.createElement('li');
			c.continue();
		}else{
			let mycompare=function(a,b){if(a.modified<b.modified){return 1;}else if(a.modified>b.modified){return -1;}return 0;};
			TT.sort(mycompare);
			if(ww){if(!STORAGE_LOCAL.done['where']){console.log('todo:where for local storage');STORAGE_LOCAL.done['where']=true;}
				TT=NEWDOO.UTILS.lazywhere(TT,ww);
			}
			resolve(TT);
		}};
		//let request = OS.getAll(null,max);
		//request.onsuccess=function(ev){console.log(ev.target.result);resolve(ev.target.result);};
		//request.onerror=function(error){console.log('Error reading documents from local storage:'+request.error);resolve(false);};
	}else{resolve([]);}
	//
	//resolve(TT);
});};

STORAGE_LOCAL.read=function(model_name,doc_id){return new Promise(async function(resolve,reject){let OS=getObjStore(model_name);
	let request=OS.get(doc_id);
	request.onsuccess=function(ev){ev.target.result.id=doc_id;resolve(ev.target.result);};
	request.onerror=function(error){console.log('Error reading document from local storage:'+request.error);resolve(false);};
});};
STORAGE_LOCAL.deactivate=function(model_name,doc_id){return new Promise(async function(resolve,reject){
	let d=await STORAGE_LOCAL.read(model_name,doc_id);d.active=false;await STORAGE_LOCAL.update(model_name,doc_id,d);
	resolve('updated');
});};
STORAGE_LOCAL.activate=function(model_name,doc_id){return new Promise(async function(resolve,reject){
	let d=await STORAGE_LOCAL.read(model_name,doc_id);d.active=true;await STORAGE_LOCAL.update(model_name,doc_id,d);
	resolve('updated');
});};
STORAGE_LOCAL.remove=async function(model_name,doc_id){return new Promise(async function(resolve,reject){let OS=getObjStore(model_name);
	var request = OS.delete(doc_id);
	request.onsuccess=function(ev){resolve('deleted');};
	request.onerror=function(error){console.log('Error deleting document from local storage:'+request.error);resolve(false);};
});};
/*NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done */
/*NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done */
/*NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done */
/*NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done */
/*NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done NOT  done */


STORAGE_LOCAL.removeattachment=async function(model_name,doc_id){
	let docData=await this.read(model_name,doc_id);
	return new Promise(async function(resolve,reject){
		if(docData.attachments){
			if(docData.attachments.length>0){
				for(let a in docData.attachments){
					deleteObject(refST(storage,docData.attachments[a].ref));
		}	}	}
		await deleteDoc(doc(collection(db,model_name),doc_id));
		resolve('deleted');
});};

STORAGE_LOCAL.attach=async function(model_name,doc_id,blob_obj,metadata){
	var mydoc=await this.doc.read(model_name,doc_id);
	return new Promise(async function(resolve,reject){
	let refdate=new Date().toISOString().replace(/-/g,'').replace(/:/g,'_').replace('.','_');
	let ext_added=false;
	if(metadata.name){if(metadata.name.indexOf('.')>-1){refdate=refdate+'-'+metadata.name;ext_added=true}}
	if(!ext_added){
		if(metadata.mime){
			if(metadata.mime.indexOf('png')>-1){refdate+'.png';ext_added=true;}
			else if(metadata.mime.indexOf('jpg')>-1){refdate+'.jpg';ext_added=true;}
			else if(metadata.mime.indexOf('jpeg')>-1){refdate+'.jpg';ext_added=true;}
	}	}
	await uploadBytes(refST(storage,refdate),blob_obj,metadata);
	if(!mydoc.attachments){mydoc.attachments=[];}
	mydoc.attachments.push({ref:refdate,name:metadata.name,mime:metadata.contentType});
	await NEWDOO.doc.write(model_name,mydoc);
	resolve(refdate);
});};
export {STORAGE_LOCAL}