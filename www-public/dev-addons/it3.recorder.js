if(!window.it3){window.it3={_:{}}}
else{if(!it3._){it3._={}}}
window.mymicmimetype={mimeType:'audio/webm'};
if(navigator.userAgent.toLowerCase().indexOf('mac os') > -1){window.mymicmimetype={mimeType: 'audio/mp4'}}
it3.MicRecorder=function(elm,options){this.hasData=false;this.elm=elm;this.elm_ucid=it3.uid('it3-recorder');elm.classList.add(this.elm_ucid);this.options=options||{};
	this.mediaRecorder=null;this.recstart=false;this.recinterval=false;this.micok=false;this.recordedChunks=[],
	this.init();
};
it3.MicRecorder.prototype={
	init:function(){var _this=this;
		this.firstrec_listener=function(ev){_this.firstrec(ev,_this)};
		document.getElementsByClassName(this.elm_ucid)[0].addEventListener('mousedown',this.firstrec_listener);
		document.getElementsByClassName(this.elm_ucid)[0].addEventListener('touchstart',this.firstrec_listener);
	},
	export_blob:function(){
		if(this.hasData){if(this.recordedChunks.length==1){return this.recordedChunks[0]}else{return new Blob(this.recordedChunks)}}
		else{console.log('No recording available');return null}
		//let dol=document.getElementById('do');	//dol.href = URL.createObjectURL(new Blob(myapp.recordedChunks));	//dol.download = 'acetest.wav';
	},
	firstrec:function(ev,__this){if(ev){ev.preventDefault();}var _this=__this;
		if(this.mis_is_inited){return false}this.mis_is_inited=true;
		document.getElementsByClassName(_this.elm_ucid)[0].removeEventListener('mousedown',_this.firstrec_listener);
		document.getElementsByClassName(_this.elm_ucid)[0].removeEventListener('touchstart',_this.firstrec_listener);
		document.getElementsByClassName(_this.elm_ucid)[0].addEventListener('mousedown',function(ev){_this.startrecord(ev,_this)});
		document.getElementsByClassName(_this.elm_ucid)[0].addEventListener('touchstart',function(ev){_this.startrecord(ev,_this)});
		document.getElementsByClassName(_this.elm_ucid)[0].addEventListener('mouseup',function(ev){_this.stoprecord(ev,_this)});
		document.getElementsByClassName(_this.elm_ucid)[0].addEventListener('mouseleave',function(ev){_this.stoprecord(ev,_this)});
		document.getElementsByClassName(_this.elm_ucid)[0].addEventListener('touchend',function(ev){_this.stoprecord(ev,_this)});
		const handlesSuccess=function(micresult,noautostart){_this.micok=true;
			_this.mediaRecorder=new MediaRecorder(micresult,mymicmimetype);
			_this.mediaRecorder.addEventListener('dataavailable',function(e){
				if(e.data.size>0){_this.recordedChunks[0]=e.data;_this.hasData=true}
			});
			_this.mediaRecorder.addEventListener('start',function(){/*console.log('started recording');*/
				_this.recstart=new Date();
				if(_this.options.updaterFn){_this.options.updaterFn('Recording... 00:00',_this.elm_ucid)}
				_this.recinterval=setInterval(function(){_this.rectimer(_this)},1000);
			});
			_this.mediaRecorder.addEventListener('stop',function(){/*console.log('stopped recording');*/
				clearInterval(_this.recinterval);
				if(_this.options.updaterFn){
					let d=new Date();let diff=d-_this.recstart;
					let min=it3.spad(Math.floor(diff/60000),2);
					let sec=it3.spad(Math.floor((diff-(min*60000))/1000),2);
					_this.options.updaterFn('Audio '+min+':'+sec);
				}
			});
			if(!noautostart){_this.startrecord();}
		};
		if(navigator.permissions){
			navigator.permissions.query({name:'microphone'}).then(function(result){
				if(result.state=='granted'){_this.micok=true;
					navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(handlesSuccess);
				}else if(result.state=='prompt'){
					result.onchange=function(micresult){
						if(micresult.target.state=='granted'){_this.micok=true;}
						else{_this.micok=false;}
					};
					navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(function(result){handlesSuccess(result,true);});
				}else if(result.state=='denied'){_this.micok=false;}
			});
		}else{navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(handlesSuccess);}
	},
	rectimer:function(_this){
		if(_this.options.updaterFn){
			let d=new Date();let diff=d-_this.recstart;
			let min=it3.spad(Math.floor(diff/60000),2);
			let sec=it3.spad(Math.floor((diff-(min*60000))/1000),2);
			_this.options.updaterFn('Recording... '+min+':'+sec);
	}	},
	startrecord:function(ev,_this){_this=_this||this;if(ev){ev.stopPropagation();ev.preventDefault();}if(_this.micok){
		document.getElementsByClassName(_this.elm_ucid)[0].classList.add('pressed');
		if(_this.mediaRecorder.state!='recording'){_this.mediaRecorder.start();}
		}else{console.log('no-mic - but should not be here in the first place');}},
	stoprecord:function(ev,_this){document.getElementsByClassName(_this.elm_ucid)[0].classList.remove('pressed');if(_this.mediaRecorder){
		if(_this.mediaRecorder.state!='inactive'){_this.mediaRecorder.stop();}
	}},
};
	