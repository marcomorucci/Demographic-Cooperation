//Globals are bad. 
payoffType = "fixed"; 
curRound = 0; 

function init(){

}

function runSimulation(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	//User input processing. 
	var gridSide = parseInt(document.getElementById("gridSide").value,10); 
	if(isNaN(gridSide)){
		document.getElementById("gridSideLabel").innerHTML = " Please input an integer value";
		return; 
	} else 
		document.getElementById("gridSideLabel").innerHTML = " Grid side (side x side grid).";

	var nAgents = parseInt(document.getElementById("nAgents").value,10);
	if(isNaN(nAgents)){
		document.getElementById("nAgentsLabel").innerHTML = " Please input an integer value";
		return; 
	} else 
		document.getElementById("nAgentsLabel").innerHTML = " Initial amount of agents.";

	var defectors = parseFloat(document.getElementById("defectors").value,10);
	if(isNaN(defectors) || defectors >= 1 || defectors <= 0){
		document.getElementById("defectorsLabel").innerHTML = " Please enter a number between 0 and 1.";
		return; 
	} else 
		document.getElementById("defectorsLabel").innerHTML = " Proportion of defectors";
	
	var budget = parseInt(document.getElementById("budget").value,10);
	if(isNaN(budget)){
		document.getElementById("budgetLabel").innerHTML = " Please input an integer value";
		return; 
	} else 
		document.getElementById("budgetLabel").innerHTML = " Initial budget of agents.";
	
	var vision = parseInt(document.getElementById("vision").value,10);
	if(isNaN(vision)){
		document.getElementById("visionLabel").innerHTML = " Please input an integer value";
		return; 
	} else 
		document.getElementById("visionLabel").innerHTML = " Vision range of an agent.";
	
	var repThreshold = parseInt(document.getElementById("repThreshold").value,10);
	if(isNaN(repThreshold)){
		document.getElementById("repLabel").innerHTML = " Please input an integer value";
		return; 
	} else 
		document.getElementById("repLabel").innerHTML = " Reproduction threshold.";
	
	var dieThreshold = parseInt(document.getElementById("dieThreshold").value,10);
	if(isNaN(dieThreshold)){
		document.getElementById("dieLabel").innerHTML = " Please input an integer value";
		return; 
	} else 
		document.getElementById("dieLabel").innerHTML = " Death threshold.";
	 
	var childLoss = parseInt(document.getElementById("childLoss").value,10);
	if(isNaN(childLoss)){
		document.getElementById("childLabel").innerHTML = " Please input an integer value";
		return; 
	} else 
		document.getElementById("childLabel").innerHTML = " Initial endowment of child.";
	 

	//Get payoffs from user input
	var payoffFcn;
	if(payoffType == "fixed"){
		var t = parseInt(document.getElementById("fT").value,10);
		var r = parseInt(document.getElementById("fR").value,10);
		var p = parseInt(document.getElementById("fP").value,10);
		var s = parseInt(document.getElementById("fS").value,10);
		payoffFcn = fixedPayoffs(t,r,p,s); 
	} else if(payoffType == "random"){
		var minT = parseInt(document.getElementById("rMinT").value,10);
		var maxT = parseInt(document.getElementById("rMaxT").value,10); 
		var minR = parseInt(document.getElementById("rMinR").value,10); 
		var maxR = parseInt(document.getElementById("rMaxR").value,10);
		var minP = parseInt(document.getElementById("rMinP").value,10); 
		var maxP = parseInt(document.getElementById("rMaxP").value,10);
		var minS = parseInt(document.getElementById("rMinS").value,10); 
		var maxS = parseInt(document.getElementById("rMaxS").value,10); 
		payoffFcn = randomPayoffs(minT,maxT,minR,maxR,minP,maxP,minS,maxS); 
	}else if(payoffType == "normal"){
		var muT = parseInt(document.getElementById("nMuT").value,10);
		var sdT = parseInt(document.getElementById("nSdT").value,10); 
		var muR = parseInt(document.getElementById("nMuR").value,10); 
		var sdR = parseInt(document.getElementById("nSdR").value,10);
		var muP = parseInt(document.getElementById("nMuP").value,10); 
		var sdP = parseInt(document.getElementById("nSdP").value,10);
		var muS = parseInt(document.getElementById("nMuS").value,10); 
		var sdS = parseInt(document.getElementById("nSdS").value,10); 
		payoffFcn = normalPayoffs(muT,sdT,muR,sdR,muP,sdP,muS,sdS); 
	}

	//Simulation speed update
	var simSpeed = parseFloat(document.getElementById("speed").value); 
	simSpeed = 1000-(970*simSpeed); 

	//Create grid and populate it with agents
	var g = new Grid(gridSide, canvas);
	var a = generateAgents(nAgents, defectors,vision,budget);
	populateGrid(g,a); 
	repeats = setInterval(function(){simulateRound(g,repThreshold,dieThreshold,childLoss,payoffFcn); 
	g.draw(ctx);},simSpeed);

	if(curRound >= maxRounds){
		clearInterval(repeats);
	}
}

function stopSimulation(){
	clearInterval(repeats); 
}

function simulateRound(grid, repThreshold, dieThreshold, childLoss,payoffFcn){
	var roundMemo = {};
	var roundCoop = 0; 
	var roundDef = 0; 
	for(var r = 0; r < grid.positions.length; r++){
		for(var c = 0; c < grid.positions[r].length; c++){
			//Skip grid position if this square is empty
			if(!grid.positions[r][c].containsAgent())
				continue; 
			//store agent and neighbours
			var agent = grid.positions[r][c].agent; 
			var neighbours = grid.getNeighbours(r,c);

			//Cycle through all neighbour of this square
			for(var i = 0; i < neighbours.length; i++){

				// For the game to be played the neighbour must contain an agent
				// and this game must have not be played before. 
				if(neighbours[i].containsAgent() &&
					 (!(agent.name + neighbours[i].agent.name in roundMemo) || 
					 	!(neighbours[i].agent.name + agent.name in roundMemo))){

					var p = payoffFcn();
					agent.updateBudget(neighbours[i].agent.getAction(),p);
					neighbours[i].agent.updateBudget(agent.getAction(),p);
					//Need to change the way this is stored
					roundMemo[agent.name + neighbours[i].agent.name] = true; 

					//Gather stat data
					if(agent.getAction())
						roundCoop++; 
					else 
						roundDef++; 
					if(neighbours[i].agent.getAction())
						roundCoop++; 
					else 
						roundDef++; 
				}
			}
			agent.die(grid,dieThreshold);
			agent.reproduce(grid,repThreshold,childLoss);
			agent.move(grid);  
		}
	}
	curRound++;
	console.log("roundCoop: ", roundCoop, "roundDef:",roundDef);
	console.log("memo size: ", Object.keys(roundMemo).length); 
}	

function generateAgents(n,ratio,vision,budget){
	var agents = [];
	for(var i = 0; i < n; i++){
		var s; 

		if(Math.random() < ratio) s = false; 
		else s = true; 

		var a = new Agent(s,null,String(i),vision,budget);
		agents.push(a); 
	}
	return agents; 
}

function populateGrid(grid,agents){
	grid.agents = agents; 

	for (var i = 0; i < grid.agents.length; i++){
		//Count how many cooperators and defectors there are
		if(grid.agents[i].getAction())
			grid.cooperators++;
		else 
			grid.defectors++;

		//Random placement for now, maybe introduce clustering later
		var r = Math.floor(Math.random()*grid.side);
		var c = Math.floor(Math.random()*grid.side);
		//Check if the square is empty first
		while(grid.positions[r][c].containsAgent()){
			r = Math.floor(Math.random()*grid.side);
			c = Math.floor(Math.random()*grid.side);
		}
		//Setup agent on position
		grid.positions[r][c].setAgent(grid.agents[i]);
		grid.agents[i].position = grid.positions[r][c]; 
	}
}

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