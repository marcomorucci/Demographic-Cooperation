function fixedPayoffs(t,r,p,s){
	return function(){
		return {T:t,R:r,P:p,S:s};
	};
}

function randomPayoffs(minT,maxT,minR,maxR,minP,maxP,minS,maxS){

	return function() {
		var t = Math.floor(Math.random()*(maxT-minT+1)+minT);
		var r = Math.floor(Math.random()*(maxR-minR+1)+minR); 
		var p = Math.floor(Math.random()*(maxP-minP+1)+minP);
		var s = Math.floor(Math.random()*(maxS-minS+1)+minS);
		return {T:t,R:r,P:p,S:s};
	};
}

function normalPayoffs(avT,sdT,avR,sdR,avP,sdP,avS,sdS){

	return function(){
		var t = Math.round(rnd()*sdT+avT);
		var r = Math.round(rnd()*sdR+avR);
		var p = Math.round(rnd()*sdP+avP);
		var s = Math.round(rnd()*sdS+avS); 
		return {T:t,R:r,P:p,S:s};
	};
}

function rnd(){
	return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function randInt(min, max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

function changePayoffInput(){
	var fixed = document.getElementById("fixedInput"); 
	var random = document.getElementById("randomInput");
	var normal = document.getElementById("normalInput");

	var opt = document.getElementById("payoffType");
	if(opt.value=="fixed"){
		random.style="display:none";
		normal.style="display:none"; 
		fixed.style="display:block";
		payoffType = "fixed"; 
	} else if (opt.value == "random"){
		normal.style="display:none"; 
		fixed.style="display:none";
		random.style="display:block";
		payoffType = "random"; 
	} else if (opt.value == "normal"){
		fixed.style="display:none";
		random.style="display:none";
		normal.style="display:block"; 	
		payoffType = "normal";
	}
}