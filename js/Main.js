//Globals are bad. 
payoffType = "fixed"; 
curRound = 0; 
simData = "";
actionsRecord = [];
lifeRecord = [];
running = false; 

function init(){

}

function runSimulation(){

	if(running)
		stopSimulation(); 

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

		//Check input
		if(isNaN(t) || isNaN(r) || isNaN(p) || isNaN(s)){
			document.getElementById("payoffLabel").innerHTML = "Please input valid integers";
			return; 
		} else {
			document.getElementById("payoffLabel").innerHTML = "Type of payoff function";
		}
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

		if(isNaN(minT) || isNaN(maxT) || isNaN(minR) || isNaN(maxR) || 
			isNaN(minS) || isNaN(maxS) || isNaN(minP) || isNaN(maxP)){
			document.getElementById("payoffLabel").innerHTML = "Please input valid integers";
			return;
		} else {
			document.getElementById("payoffLabel").innerHTML = "Type of payoff function";
		}
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


		if(isNaN(muT) || isNaN(sdT) || isNaN(muR) || isNaN(sdR) || 
			isNaN(muS) || isNaN(sdS) || isNaN(muP) || isNaN(sdP)){
			document.getElementById("payoffLabel").innerHTML = "Please input valid integers";
			return;
		} else {
			document.getElementById("payoffLabel").innerHTML = "Type of payoff function";
		}
	}

	//Simulation speed update
	var simSpeed = parseFloat(document.getElementById("speed").value); 
	simSpeed = (1000 - (970*simSpeed)); 

	//Get max rounds
	var maxRounds = parseInt(document.getElementById("maxRounds").value);
	if(isNaN(maxRounds) || maxRounds <= 0){
		document.getElementById("maxRoundsLabel").innerHTML = "Plaease input a number greater than 0";
		return;
	}else {
		document.getElementById("maxRoundsLabel").innerHTML = "Max Rounds.";
	}

	var maxLife = parseInt(document.getElementById("maxLife").value,10);
	if(isNaN(maxLife) || maxLife < 1){
		document.getElementById("maxLifeLabel").innerHTML = "Please input an integer greater than 1";
		return;
	}else{
		document.getElementById("maxLifeLabel").innerHTML = "Max agent life";
	} 

	//Reset cur round
	curRound = 0; 

	//Initialize simulation data table
	simData = "Action,Agent,Budget,Against,Round,PayoffType,T,R,P,S\n";
	actionsRecord = [];
	lifeRecord = [];

	//Create grid and populate it with agents
	var g = new Grid(gridSide, canvas);
	var a = generateAgents(nAgents, defectors,vision,budget,maxLife);
	populateGrid(g,a); 
	g.draw(ctx); 
	running = true; 
	repeats = setInterval(function(){simulateRound(maxRounds,g,repThreshold,dieThreshold,
		childLoss,payoffFcn); 
	g.draw(ctx);},simSpeed);
}

function stopSimulation(){
	clearInterval(repeats); 
	running = false; 
}

function simulateRound(maxRounds,grid, repThreshold, dieThreshold, childLoss,payoffFcn){
	
	if(curRound >= maxRounds)
		clearInterval(repeats);

	console.log("cur round: ",curRound, "tot agents:",grid.agents.length); 

	var roundMemo = {};
	var roundCoop = 0; 
	var roundDef = 0; 
	var roundChildren = 0;
	var roundDeaths = 0; 

	//Shuffle agent order
	shuffleArray(grid.agents);

	for( var a = 0; a < grid.agents.length;a++){
		//store agent and neighbours
		var agent = grid.agents[a]; 
		var position = agent.position; 
		var neighbours = grid.getNeighbours(position.row,position.col);
			
		//console.log("Before","name:", agent.name,"budget",agent.budget);

		//Cycle through all neighbour of this square
		for(var i = 0; i < neighbours.length; i++){

			// For the game to be played the neighbour must contain an agent
			// and this game must have not be played before. 
			if(neighbours[i].containsAgent()){
				var p = payoffFcn();

				agent.updateBudget(neighbours[i].agent.getAction(),p);
				neighbours[i].agent.updateBudget(agent.getAction(),p);

				//Add for this agent
				//simData += String(agent.strategy)+","+agent.name+","+String(agent.budget)+
				//","+String(neighbours[i].strategy)+","+String(curRound)+","+payoffType+","+
				//String(p.T)+","+String(p.R)+","+String(p.P)+","+String(p.S)+"\n";

				//Add data for neighbour
				//simData += String(neighbours[i].strategy)+","+neighbours[i].name+","+
				//String(neighbours[i].budget)+ ","+String(agent.strategy)+","+
				//String(curRound)+","+payoffType+","+ String(p.T)+","+String(p.R)+
				//","+String(p.P)+","+String(p.S)+"\n"; 

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

		//console.log("After:","name:", agent.name,"budget",agent.budget);
	}
	
	//Synchronus updating
	for(var c = 0; c < grid.agents.length; c++){
	 	if (grid.agents[c].die(grid,dieThreshold)){
			roundDeaths++; 
	 	}else{
	 		if (grid.agents[c].reproduce(grid,repThreshold,childLoss))
	 			roundChildren++;
	 		grid.agents[c].move(grid);
	 	}
	}

	actionsRecord.push([curRound,roundCoop,roundDef]);
	lifeRecord.push([curRound,roundChildren,roundDeaths]);
	a = new Dygraph(document.getElementById("ActionGraph"), 
		actionsRecord,{labels: ["Round","Cooperations","Defections"]});
	l = new Dygraph(document.getElementById("LifeGraph"), 
		lifeRecord,{labels: ["Round","Reproductions","Deaths"]});

	curRound++;
}

function generateAgents(n,ratio,vision,budget,maxLife){
	var agents = [];
	for(var i = 0; i < n; i++){
		var s; 

		if(Math.random() < ratio) s = false; 
		else s = true; 

		var a = new Agent(s,null,String(i),vision,budget,maxLife);
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

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}