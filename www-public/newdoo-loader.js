let s=document.createElement('script');
s.setAttribute('type','module');s.innerHTML=`
	import {FIREDESK} from "https://tools.gpo.one/helpdesk/firedesk.js";
	window.FIREDESK=FIREDESK;
	if(window.addEventListener){
	  window.addEventListener('load', startFIREDESK);
	}else{
	  window.attachEvent('onload', startFIREDESK);
	}
	`
;
document.head.appendChild(s);
let sss=document.createElement('script');
sss.setAttribute('integrity','sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==');
sss.setAttribute('crossorigin','anonymous');
sss.setAttribute('referrerpolicy','no-referrer');
sss.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
document.head.appendChild(sss);

let cc=document.createElement('link');cc.setAttribute('rel','stylesheet');cc.setAttribute('href','https://tools.gpo.one/helpdesk/firedesk.css');
document.head.appendChild(cc);
//let xcc=document.createElement('link');xcc.setAttribute('rel','stylesheet');xcc.setAttribute('href','https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.10.1/css/mdb.min.css');
//document.head.appendChild(xcc);
window.startFIREDESK=function(){
	
	let B1=document.createElement('button');
	B1.setAttribute('id','GOOGLE_SIGNIN');
	B1.setAttribute('onclick','FIREDESK.googleSignin()');
	B1.innerHTML='Signin';
	B1.style.display='none';document.body.appendChild(B1);
	let B2=document.createElement('button');
	B2.setAttribute('id','GOOGLE_SIGNOUT');
	B2.setAttribute('onclick','FIREDESK.googleSignout()');
	B2.innerHTML='Signout';
	B2.style.display='none';document.body.appendChild(B2);
	window.FIREDESK.init({
			apiKey: "AIzaSyAnk2KPM_xI4aC4lB4KjkqYfkIxqm6uHcM",
			authDomain: "gpo-firebase.firebaseapp.com",
			databaseURL: "https://gpo-firebase-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "gpo-firebase",
			storageBucket: "gpo-firebase.appspot.com",
			messagingSenderId: "503702556354",
			appId: "1:503702556354:web:7b13436f95e75eb74e755b",
			measurementId: "G-L47C0XE8LV",
			embedded:true,
			integratefunction:function(){
				let NEWB=document.createElement('a');
				NEWB.setAttribute('onclick','FIREDESK.showUI();return false;');
				NEWB.href='#';
				NEWB.innerHTML='Supporto';
				let B=document.querySelectorAll('.o_user_menu .dropdown-menu a')[1];
				let p=B.parentElement;
				p.insertBefore(NEWB,B);
				p.removeChild(B);
			}
	});
};