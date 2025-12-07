import { initializeApp,getApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import {StorageInterface} from "./newdoo-storage.js";
import {getDatabase, ref as refRT,onChildAdded,get as getRT,set as setRT} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";
import {getStorage,ref as refST,uploadBytes,getDownloadURL,deleteObject} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-storage.js";
import {getFirestore,collection,doc,addDoc,setDoc,getDoc,getDocs,query,updateDoc,orderBy,where,deleteDoc} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-firestore.js";
/*NEWDOO firebase driver*/
var STORAGE_FIREBASE=new StorageInterface('storage-firebase');
var app=false;var db=false;var storage=false;
STORAGE_FIREBASE.init=function(s_config){app=getApp();if(!getApp){app=initializeApp(s_config);}db=getFirestore(app);storage=getStorage(app);};
/* --------------------------------------------------------------- */
STORAGE_FIREBASE.create=function(model_name,docData){return new Promise(async function(resolve,reject){
	let id=(await addDoc(collection(db,model_name),docData)).id;resolve(id);});};
STORAGE_FIREBASE.update=function(model_name,doc_id,docData){return new Promise(async function(resolve,reject){
	await setDoc(doc(collection(db,model_name),doc_id),docData);resolve(false);});};
STORAGE_FIREBASE.deactivate=function(model_name,doc_id){return new Promise(async function(resolve,reject){
	await updateDoc(doc(collection(db,model_name),doc_id),{active:false});resolve('updated');});};
STORAGE_FIREBASE.activate=function(model_name,doc_id){return new Promise(async function(resolve,reject){
	await updateDoc(doc(collection(db,model_name),doc_id),{active:true});resolve('updated');});};
STORAGE_FIREBASE.remove=async function(model_name,doc_id){return new Promise(async function(resolve,reject){
	await deleteDoc(doc(collection(db,model_name),doc_id));resolve('deleted');});};
STORAGE_FIREBASE.read=function(model_name,doc_id){return new Promise(async function(resolve,reject){
	let doc_ref=doc(collection(db,model_name),doc_id);let doc_get=await getDoc(doc_ref);
	let docData=await doc_get.data();docData.id=doc_id;
	docData=NEWDOO.UTILS.fixdates(docData);docData=await NEWDOO.UTILS.fixattachments(docData);
	resolve(docData);});};
STORAGE_FIREBASE.query=function(model_name,ww){return new Promise(async function(resolve,reject){
	let TT=[];let c=collection(db,model_name);let SNAP=false;let tdata=null;
	if(ww){SNAP=await getDocs(query(c,where(ww[0],ww[1],ww[2])));}else{SNAP=await getDocs(c)}
	SNAP.forEach((doc)=>{tdata=doc.data();TT.push(tdata);TT[TT.length-1].id=doc.id;});
	resolve(TT);
});};
STORAGE_FIREBASE.addattachment=function(blob_obj,metadata){return new Promise(async function(resolve,reject){
	let refdate=new Date().toISOString().replace(/-/g,'').replace(/:/g,'_').replace('.','_');let ext_added=false;
	if(metadata.name){if(metadata.name.indexOf('.')>-1){refdate=refdate+'-'+metadata.name;ext_added=true}}
	if(!ext_added){if(metadata.mime){
		if(metadata.mime.indexOf('png')>-1){refdate+'.png';ext_added=true;}
		else if(metadata.mime.indexOf('jpg')>-1){refdate+'.jpg';ext_added=true;}
		else if(metadata.mime.indexOf('jpeg')>-1){refdate+'.jpg';ext_added=true;}
	}}
	await uploadBytes(refST(storage,refdate),blob_obj,metadata);
	resolve(refdate);
});};
STORAGE_FIREBASE.removeattachment=function(ref){return new Promise(async function(resolve,reject){try{deleteObject(refST(storage,ref));resolve('deleted');}catch(ex){resolve('not existing')}});};
export {STORAGE_FIREBASE}