const to_implement=function(a,b,c,d){return new Promise(async function(resolve,reject){let x=resolve;
	setTimeout(function(){x(a+' '+c||' Must be implemented in the storage engine driver '+b)},250);
});};
var StorageInterface=function(name){
	this.name=name;
};StorageInterface.prototype={
		init:function(config){return to_implement('init(config)')},
	/*SINGLE DOCUMENT*/
	  update:function(model_name,doc_id,doc_data){return to_implement('update(model_name,doc_data)',this.name)},
	  create:function(model_name,doc_data){return to_implement('create(model_name,doc_data) resolve to new id',this.name)},
  deactivate:function(model_name,doc_id){return to_implement('deactivate(model_name,doc_id)',this.name)},
	activate:function(model_name,doc_id){return to_implement('activate(model_name,doc_id)',this.name)},
		read:function(model_name,doc_id){return to_implement('read(model_name,doc_id)',this.name)},
	  remove:function(model_name,doc_id){return to_implement('remove(model_name,doc_id)',this.name)},
	   query:function(model_name,ww,getall,getarch){return to_implement('query(model_name,ww,getall,getarch)',this.name)},
  attach2doc:function(model_name,doc_id,blob_obj,metadata){return to_implement('attach2doc(model_name,doc_id,blob_obj,metadata)',this.name)},
removeattachment:function(ref){return to_implement('removeattachment(ref)',this.name)},
addattachment:function(blob_obj,metadata){return to_implement('addattachment(blob_obj,metadata)',this.name)}
};
export {StorageInterface}