//Globals are bad. 
payoffType = "fixed"; 
curRound = 0; 
simData = "";
firstData = [];
secondData = [];
firstLabels = [];
secondLabels = [];
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

	//Get actions order
	var updateMode = document.getElementById("updateMode").value;  
	var actPos = parseInt(document.getElementById("Play").value); 
	var movePos = parseInt(document.getElementById("Move").value); 
	var repPos = parseInt(document.getElementById("Reproduce").value); 
	var diePos = parseInt(document.getElementById("Die").value); 

	if(actPos == movePos || actPos == repPos || actPos == diePos || movePos == repPos || 
		movePos == repPos || movePos == diePos || repPos == diePos){
		document.getElementById("updateLabel").innerHTML = "No two moves can have the same position";
		return; 
	} else{
		document.getElementById("updateLabel").innerHTML = "Update Mode";
	}

	//Generate action functions
	var order = createUpdateOrder(updateMode,actPos,movePos,diePos,repPos); 

	//Reset cur round
	curRound = 0; 

	//Initialize simulation data table
	simData = "Action,Agent,Budget,Against,Round,PayoffType,T,R,P,S\n";

	//Reset data
	firstData = [];
	secondData = [];

	var firstGraph = document.getElementById("firstGraphContent").value;
	var secondGraph = document.getElementById("secondGraphContent").value;

	//Create grid and populate it with agents
	var g = new Grid(gridSide, canvas);
	var a = generateAgents(nAgents, defectors,vision,budget,maxLife);
	populateGrid(g,a); 
	g.draw(ctx); 
	running = true; 
	repeats = setInterval(function(){simulateRound(maxRounds,g,repThreshold,dieThreshold,
		childLoss,payoffFcn,order,updateMode, firstGraph, secondGraph); 
	g.draw(ctx);},simSpeed);
}

function stopSimulation(){
	clearInterval(repeats); 
	running = false; 
}

function simulateRound(maxRounds,grid, repThreshold, dieThreshold, childLoss,payoffFcn,
	updateOrder,updateMode, firstGraph, secondGraph){
	
	if(curRound >= maxRounds)
		clearInterval(repeats);

	console.log("cur round: ",curRound, "tot agents:",grid.agents.length); 

	var roundData = {round:curRound, coop:0, def:0, nCoop:0, nDef:0, avgCoop:0, avgDef:0, 
		coopDeath:0, defDeath:0, coopRep:0, defRep:0, coopMove:0, defMove:0};

	//Shuffle agent order
	shuffleArray(grid.agents);

	if(updateMode == "Synchronous"){
		//Synchronus updating
		updateOrder.first(grid,repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
		updateOrder.second(grid,repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
		updateOrder.third(grid,repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
		updateOrder.fourth(grid,repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
	}else{
		//Asynchronous updating reverse order because die function removes agent from list; 
		//reverse loop avoid skipping agents after removal. 
		for(var i = grid.agents.length-1; i >= 0; i--){
			updateOrder.first(grid,grid.agents[i],repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
			if(grid.agents[i] !== undefined)
				updateOrder.second(grid,grid.agents[i],repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
			if(grid.agents[i] !== undefined)
				updateOrder.third(grid,grid.agents[i],repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
			if(grid.agents[i] !== undefined)
				updateOrder.fourth(grid,grid.agents[i],repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
		}
	}
	roundData.nCoop = grid.cooperators; 
	roundData.nDef = grid.defectors; 
	updateRecords(roundData, firstGraph,secondGraph); 
	//console.log(firstData,secondData);
	updatePlots();

	curRound++;
}

function updateRecords(roundData,firstGraph,secondGraph){
	var totAgents = roundData.nCoop+roundData.nDef; 
	switch (firstGraph){
		case "coop/def":
			firstLabels = ["Round","Cooperations","Defections","Interactions"];
			firstData.push([roundData.round,roundData.coop,roundData.def,roundData.coop+roundData.def]);
		break;
		case "nCoop/nDef":
			firstLabels = ["Round","Cooperators","Defectors","Agents"];
			firstData.push([roundData.round,roundData.nCoop,roundData.nDef,roundData.nCoop+roundData.nDef]);
		break;
		case "avgPayoff":
			firstLabels = ["Round","Avg. cooperator gain","Avg. defector gain","Avg. total gain"];
			firstData.push([roundData.round,roundData.avgCoop/roundData.nCoop,
				roundData.avgDef/roundData.nDef,(roundData.avgCoop+roundData.avgDef)/totAgents]);
		break;
		case "deathRatio":
			firstLabels = ["Round","Coop. that died (%)","Def. that died (%)","Agents that died (%)"];
			firstData.push([roundData.round,roundData.coopDeath/roundData.nCoop,roundData.defDeath/roundData.nDef,
				(roundData.coopDeath+roundData.defDeath)/totAgents]);
		break;
		case "repRatio":
			firstLabels = ["Round","Coop. that reproduced (%)","Def. that reproduced (%)","Agents that reproduced (%)"];
			firstData.push([roundData.round,roundData.coopRep/roundData.nCoop,roundData.defRep/roundData.nDef,
				(roundData.coopRep+roundData.defRep)/totAgents]);
		break;
		case "moveRatio":
			firstLabels = ["Round","Coop. that moved (%)","Def. that moved (%)","Agents that moved (%)"];
			firstData.push([roundData.round,roundData.coopMove/roundData.nCoop,roundData.defMove/roundData.nDef,
				(roundData.coopMove+roundData.defMove)/totAgents]);
		break;
	}
	switch(secondGraph){
		case "coop/def":
			secondLabels = ["Round","Cooperations","Defections","Interactions"];
			secondData.push([roundData.round,roundData.coop,roundData.def,roundData.coop+roundData.def]);
		break;
		case "nCoop/nDef":
			secondLabels = ["Round","Cooperators","Defectors","Agents"];
			secondData.push([roundData.round,roundData.nCoop,roundData.nDef,roundData.nCoop+roundData.nDef]);
		break;
		case "avgPayoff":
			secondLabels = ["Round","Avg. cooperator gain","Avg. defector gain","Avg. total gain"];
			secondData.push([roundData.round,roundData.avgCoop/roundData.nCoop,
				roundData.avgDef/roundData.nDef,(roundData.avgCoop+roundData.avgDef)/totAgents]);
		break;
		case "deathRatio":
			secondLabels = ["Round","Coop. that died (%)","Def. that died (%)","Agents that died (%)"];
			secondData.push([roundData.round,roundData.coopDeath/roundData.nCoop,roundData.defDeath/roundData.nDef,
				(roundData.coopDeath+roundData.defDeath)/totAgents]);
		break;
		case "repRatio":
			secondLabels = ["Round","Coop. that reproduced (%)","Def. that reproduced (%)","Agents that reproduced (%)"];
			secondData.push([roundData.round,roundData.coopRep/roundData.nCoop,roundData.defRep/roundData.nDef,
				(roundData.coopRep+roundData.defRep)/totAgents]);
		break;
		case "moveRatio":
			secondLabels = ["Round","Coop. that moved (%)","Def. that moved (%)","Agents that moved (%)"];
			secondData.push([roundData.round,roundData.coopMove/roundData.nCoop,roundData.defMove/roundData.nDef,
				(roundData.coopMove+roundData.defMove)/totAgents]);
		break;
	}
}

function updatePlots(){
	a = new Dygraph(document.getElementById("ActionGraph"), 
	 	firstData,{labels: firstLabels});
	l = new Dygraph(document.getElementById("LifeGraph"), 
	 	secondData,{labels: secondLabels});
}

function createUpdateOrder(updateMode, actPos, movePos, diePos, repPos){
	var order = {};
	switch(actPos){
		case 1:
			if(updateMode == "Synchronous")
				order.first = allAct; 
			else
				order.first = asyncAct;
			break; 
		case 2:
			if(updateMode == "Synchronous")
				order.second = allAct; 
			else
				order.second = asyncAct;
			break; 
		case 3: 
			if(updateMode == "Synchronous")
				order.third = allAct; 
			else
				order.third = asyncAct;
			break;
		case 4: 
			if(updateMode == "Synchronous")
				order.fourth = allAct; 
			else
				order.fourth = asyncAct;
			break; 
	}
	switch(movePos){
		case 1:
			if(updateMode == "Synchronous")
				order.first = allMove; 
			else
				order.first = asyncMove;
			break; 
		case 2:
			if(updateMode == "Synchronous")
				order.second = allMove; 
			else
				order.second = asyncMove;
			break;  
		case 3: 
			if(updateMode == "Synchronous")
				order.third = allMove; 
			else
				order.third = asyncMove;
			break; 
		case 4: 
			if(updateMode == "Synchronous")
				order.fourth = allMove; 
			else
				order.fourth = asyncMove;
			break; 
	}
	switch(diePos){
		case 1:
			if(updateMode == "Synchronous")
				order.first = allDie; 
			else
				order.first = asyncDie;
			break; 	
		case 2:
			if(updateMode == "Synchronous")
				order.second = allDie; 
			else
				order.second = asyncDie;
			break; 
		case 3: 
			if(updateMode == "Synchronous")
				order.third = allDie; 
			else
				order.third = asyncDie;
			break; 
		case 4: 
			if(updateMode == "Synchronous")
				order.fourth = allDie; 
			else
				order.fourth = asyncDie;
			break; 
	}
	switch(repPos){
		case 1:
			if(updateMode == "Synchronous")
				order.first = allReproduce; 
			else
				order.first = asyncReproduce;
			break; 
		case 2:
			if(updateMode == "Synchronous")
				order.second = allReproduce; 
			else
				order.second = asyncReproduce;
			break; 
		case 3: 
			if(updateMode == "Synchronous")
				order.third = allReproduce; 
			else
				order.third = asyncReproduce;
			break; 
		case 4: 
			if(updateMode == "Synchronous")
				order.fourth = allReproduce; 
			else
				order.fourth = asyncReproduce;
			break; 
	}
	return order; 
}

function asyncAct(grid,agent,repThreshold,dieThreshold,childLoss,payoffFcn,roundData){
	var position = agent.position; 
	var neighbours = grid.getNeighbours(position.row,position.col);
		
	//Cycle through all neighbour of this square
	for(var i = 0; i < neighbours.length; i++){

		// For the game to be played the neighbour must contain an agent
		// and this game must have not be played before. 
		if(neighbours[i].containsAgent()){
			var p = payoffFcn();

			var p1 = agent.updateBudget(neighbours[i].agent.getAction(),p);
			var p2 = neighbours[i].agent.updateBudget(agent.getAction(),p);

			if(agent.getAction()){
				roundData.coop++;
				roundData.avgCoop += p1;
			}
			else{
				roundData.def++;
				roundData.avgDef += p1;
			}
			if(neighbours[i].agent.getAction()){
				roundData.coop++;
				roundData.avgCoop += p2; 
			}
			else{
				roundData.def++;
				roundData.avgDef += p2; 
			}
		}
	}
}

function asyncMove(grid,agent,repThreshold,dieThreshold,childLoss,payoffFcn,roundData){
	if(agent.move(grid))
		if(agent.getAction())
			roundData.coopMove++; 
		else 
			roundData.defMove++;
}

function asyncReproduce(grid,agent,repThreshold,dieThreshold,childLoss,payoffFcn,roundData){
	if(agent.reproduce(grid,repThreshold,childLoss))
		if(agent.getAction())
			roundData.coopRep++;
		else
			roundData.defRep++;
}

function asyncDie(grid,agent,repThreshold,dieThreshold,childLoss,payoffFcn,roundData){
	if(agent.die(grid,dieThreshold))
		if(agent.getAction())
			roundData.coopDeath++;
		else
			roundData.defDeath++;
}

function allAct(grid,repThreshold,dieThreshold,childLoss,payoffFcn,roundData){
	for( var a = 0; a < grid.agents.length;a++){
		asyncAct(grid,grid.agents[a],repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
	}
}

function allReproduce(grid,repThreshold,dieThreshold,childLoss,payoffFcn,roundData){
	for (var c = 0; c < grid.agents.length; c++)
		asyncReproduce(grid,grid.agents[c],repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
}

function allDie(grid,repThreshold,dieThreshold,childLoss,payoffFcn,roundData){
	for(var c = grid.agents.length-1; c >= 0; c--)
		asyncDie(grid,grid.agents[c],repThreshold,dieThreshold,childLoss,payoffFcn,roundData); 
}

function allMove(grid,repThreshold,dieThreshold,childLoss,payoffFcn,roundData){
	for(var c = 0; c < grid.agents.length; c++)
		asyncMove(grid,grid.agents[c],repThreshold,dieThreshold,childLoss,payoffFcn,roundData);
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



function storeData(){
	//Add for this agent
	//simData += String(agent.strategy)+","+agent.name+","+String(agent.budget)+
	//","+String(neighbours[i].strategy)+","+String(curRound)+","+payoffType+","+
	//String(p.T)+","+String(p.R)+","+String(p.P)+","+String(p.S)+"\n";

	//Add data for neighbour
	//simData += String(neighbours[i].strategy)+","+neighbours[i].name+","+
	//String(neighbours[i].budget)+ ","+String(agent.strategy)+","+
	//String(curRound)+","+payoffType+","+ String(p.T)+","+String(p.R)+
	//","+String(p.P)+","+String(p.S)+"\n"; 
}


/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 * Seriously though, that we can't find anything better 
 * than the O(n) trivial solution for this is kind of a 
 * bummer. 
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