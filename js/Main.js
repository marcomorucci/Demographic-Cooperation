function init(){
}

function runSimulation(){

	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	
	var gridSide = parseInt(document.getElementById("gridSide").value,10); 
	if(isNaN(gridSide)){
		document.getElementById("gridSide").innerHTML += " Please input an integer value";
		return; 
	}
	var nAgents = parseInt(document.getElementById("nAgents").value,10);
	var defectors = parseInt(document.getElementById("defectors").value,10);
	var budget = parseInt(document.getElementById("budget").value,10);
	var vision = parseInt(document.getElementById("vision").value,10);
	var repThreshold = parseInt(document.getElementById("repThreshold").value,10);
	var dieThreshold = parseInt(document.getElementById("dieThreshold").value,10); 
	var childLoss = parseInt(document.getElementById("childLoss").value,10); 
	
	console.log(gridSide);
	//var g = new Grid(30, canvas);
	//var a = generateAgents(nAgents, defectors,vision,budget);
	//populateGrid(g,a); 
	//repeats = setInterval(function(){simulateRound(g,repThreshold,dieThreshold,childLoss); 
	//g.draw(ctx);},30);
}

function stopSimulation(){
	clearInterval(repeats); 
}

function simulateRound(grid, repThreshold, dieThreshold, childLoss){
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

					var p = fixedPayoffs(6,5,-5,-6);
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
	return {T:t,R:r,P:p,S:s};
}