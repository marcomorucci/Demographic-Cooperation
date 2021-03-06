//Globals are bad. 
payoffType = "fixed"; 
curRound = 0; 
simData = "";
firstData = [];
secondData = [];
running = false; 

function init(){

}

function runSimulation(){

	if(running){
		stopSimulation(); 
	}

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.font = "20px Arial";
	ctx.fillStyle = "red";
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//User input processing. 
	var gridSide = parseInt(document.getElementById("gridSide").value,10); 
	if(isNaN(gridSide) || gridSide < 5 ){
		ctx.fillText("Grid side must be an integer greater than 5!",80,250);
		return; 
	} 
	var nAgents = parseInt(document.getElementById("nAgents").value,10);
	if(isNaN(nAgents) || nAgents < 2 || nAgents > (gridSide*gridSide)){
		ctx.fillText("Agents must be an integer greater than 2",80,250);
		ctx.fillText("and less than gridSide X gridSide",80,290);
		return; 
	} 

	var defectors = parseFloat(document.getElementById("defectors").value,10);
	if(isNaN(defectors) || defectors >= 1 || defectors <= 0){
		ctx.fillText("Defectors must be a real between 0 and 1",80,250);
		return; 
	} 
	
	var budget = parseInt(document.getElementById("budget").value,10);
	if(isNaN(budget) || budget <= 0){
		ctx.fillText("Budget must be an integer greater than 0",80,250);
		return; 
	} 
	
	var vision = parseInt(document.getElementById("vision").value,10);
	if(isNaN(vision) || vision < 0){
		ctx.fillText("Vision must be a positive integer",80,250);
		return; 
	} 
	var repThreshold = parseInt(document.getElementById("repThreshold").value,10);
	if(isNaN(repThreshold) || repThreshold < 0){
		ctx.fillText("Reproduction must be a positive integer",80,250);
		return; 
	} 
	var dieThreshold = parseInt(document.getElementById("dieThreshold").value,10);
	if(isNaN(dieThreshold)){
		ctx.fillText("Death must be an integer",80,250);
		return; 
	}
	 
	var childLoss = parseInt(document.getElementById("childLoss").value,10);
	if(isNaN(childLoss) || childLoss < 0){
		ctx.fillText("Child must be a positive integer",80,250);
		return; 
	} 
	
	//Get max rounds
	var maxRounds = parseInt(document.getElementById("maxRounds").value);
	if(isNaN(maxRounds) || maxRounds <= 0){
		ctx.fillText("MaxRounds must be an integer greater than 0",80,250);
		return;
	}

	var maxLife = parseInt(document.getElementById("maxLife").value,10);
	if(isNaN(maxLife) || maxLife < 1){
		ctx.fillText("Max Age must be an integer greater than 1",80,250);
		return;
	}

	var minLife = parseInt(document.getElementById("minLife").value,10);
	if(isNaN(minLife) || minLife > maxLife || minLife < 0){
		ctx.fillText("Max Age must be an integer greater than Max age",80,250);
		return;
	}

	var metabolism = parseInt(document.getElementById("metabolism").value, 10);
	if(isNaN(metabolism) || metabolism < 0){
		ctx.fillText("Metabolism must be an integer greater than 0",80,250);
		return; 
	}

	var mutation = parseFloat(document.getElementById("mutation").value,10);
	if(isNaN(mutation) || mutation >= 1 || mutation < 0){
		ctx.fillText("Mutation must be a real between 0 and 1",80,250);
		return; 
	}

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
			ctx.fillText("Payoffs must be integers",80,250);
			return; 
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
			ctx.fillText("Payoffs must be integers",80,250);
			return;
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
			ctx.fillText("Payoffs must be integers",80,250);
			return;
		} 
	}

	//Simulation speed update
	var simSpeed = parseFloat(document.getElementById("speed").value); 
	simSpeed = (1000 - (970*simSpeed)); 

	//Get actions order
	var updateMode = document.getElementById("updateMode").value;  
	var actPos = parseInt(document.getElementById("Play").value); 
	var movePos = parseInt(document.getElementById("Move").value); 
	var repPos = parseInt(document.getElementById("Reproduce").value); 
	var diePos = parseInt(document.getElementById("Die").value); 

	if(actPos == movePos || actPos == repPos || actPos == diePos || movePos == repPos || 
		movePos == repPos || movePos == diePos || repPos == diePos){
		ctx.fillText("Moves must have different order positions",80,250);
		return; 
	} 

	//Generate action functions
	var order = createUpdateOrder(updateMode,actPos,movePos,diePos,repPos); 

	var firstGraph = document.getElementById("firstGraphContent").value;
	var secondGraph = document.getElementById("secondGraphContent").value;

	//Create grid and populate it with agents
	var g = new Grid(gridSide, canvas);
	var a = generateAgents(nAgents, defectors,vision,budget,randInt(minLife,maxLife));
	populateGrid(g,a); 
	g.draw(ctx); 
	running = true; 
	repeats = setInterval(function(){simulateRound(maxRounds,g,repThreshold,dieThreshold,
		childLoss,payoffFcn,order,updateMode, firstGraph, secondGraph,metabolism,mutation); 
	g.draw(ctx);},simSpeed);
}

function stopSimulation(){
	clearInterval(repeats); 
	resetSimulation(); 
	running = false; 
}

function resetSimulation(){

	//Reset cur round
	curRound = 0; 

	//Initialize simulation data table
	simData = "Action,Agent,Budget,Against,Round,PayoffType,T,R,P,S\n";

	//Reset data
	firstData = [];
	secondData = [];
}

function simulateRound(maxRounds,grid, repThreshold, dieThreshold, childLoss,payoffFcn,
	updateOrder,updateMode, firstGraph, secondGraph, metabolism, mutation){
	
	if(curRound >= maxRounds)
		clearInterval(repeats);

	//console.log("cur round: ",curRound, "tot agents:",grid.agents.length); 

	var roundData = {round:curRound, coop:0, def:0, nCoop:0, nDef:0, avgCoop:0, avgDef:0, 
		coopDeath:0, defDeath:0, coopRep:0, defRep:0, coopMove:0, defMove:0, coopAge:0, defAge:0,
		coopBudget:0, defBudget:0};

	//Shuffle agent order
	shuffleArray(grid.agents);

	if(updateMode == "Synchronous"){
		//Synchronus updating
		updateOrder.first(grid,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
		updateOrder.second(grid,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
		updateOrder.third(grid,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
		updateOrder.fourth(grid,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
	}else{
		//Asynchronous updating reverse order because die function removes agent from list; 
		//reverse loop avoid skipping agents after removal. 
		for(var i = grid.agents.length-1; i >= 0; i--){
			updateOrder.first(grid,grid.agents[i],repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
			if(grid.agents[i] !== undefined)
				updateOrder.second(grid,grid.agents[i],repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
			if(grid.agents[i] !== undefined)
				updateOrder.third(grid,grid.agents[i],repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
			if(grid.agents[i] !== undefined)
				updateOrder.fourth(grid,grid.agents[i],repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
		}
	}
	//console.log("coop:",grid.cooperators,"def",grid.defectors);
	roundData.nCoop = grid.cooperators; 
	roundData.nDef = grid.defectors; 
	updateRecords(roundData, firstGraph,secondGraph); 
	//console.log(firstData,secondData);
	updatePlots(false);

	curRound++;
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

function asyncAct(grid,agent,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData){
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

function asyncMove(grid,agent,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData){
	if(agent.move(grid))
		if(agent.getAction())
			roundData.coopMove++; 
		else 
			roundData.defMove++;
}

function asyncReproduce(grid,agent,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData){
	if(agent.reproduce(grid,repThreshold,childLoss,mutation))
		if(agent.getAction())
			roundData.coopRep++;
		else
			roundData.defRep++;
}

function asyncDie(grid,agent,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData){
	if(agent.die(grid,dieThreshold,metabolism))
		if(agent.getAction())
			roundData.coopDeath++;
		else
			roundData.defDeath++;
	else{
		if(agent.getAction()){
			roundData.coopAge += agent.curLife;
			roundData.coopBudget += agent.budget;
		}else{
			roundData.defAge += agent.curLife;
			roundData.defBudget += agent.budget;
		}
	}
}

function allAct(grid,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData){
	for( var a = 0; a < grid.agents.length;a++){
		asyncAct(grid,grid.agents[a],repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
	}
}

function allReproduce(grid,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData){
	for (var c = 0; c < grid.agents.length; c++)
		asyncReproduce(grid,grid.agents[c],repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
}

function allDie(grid,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData){
	for(var c = grid.agents.length-1; c >= 0; c--)
		asyncDie(grid,grid.agents[c],repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData); 
}

function allMove(grid,repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData){
	for(var c = 0; c < grid.agents.length; c++)
		asyncMove(grid,grid.agents[c],repThreshold,dieThreshold,childLoss,payoffFcn,metabolism,mutation,roundData);
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