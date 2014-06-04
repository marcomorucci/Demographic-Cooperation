function init(){
	var canvas = document.getElementById("canvas"); 
	var ctx = canvas.getContext("2d"); 
	var g = new Grid(5, canvas);
	var a = generateAgents(10,0.5,1,0);
	populateGrid(g,a);
	g.draw(ctx);
	runSimulation(ctx,0,g,18,-10,6); 
	
}

function runSimulation(ctx,rounds, grid, repThreshold, dieThreshold, childLoss){
	var totCoop = 0; 
	var totDef = 0; 
	for(var cnt = 1; cnt <= rounds; cnt++){
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

						var p = fixedPayoffs(5,3,-1,-3);
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

		totCoop += roundCoop;
		totDef += roundDef; 
		console.log("round:", cnt);
		ctx.clearRect(0,0,grid.w, grid.h );
		grid.draw(ctx); 
	}	
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