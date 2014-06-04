function Agent(strategy, position, name, vision, budget){
	this.position = position || null; 
	this.strategy = strategy || true; 
	this.budget = budget || 0; 
	this.name = name || ""; 
	this.vision = vision || 1; 
}

Agent.prototype.getAction = function(){
	return this.strategy; 
};

//Payoffs are assumed to come in an object of the form
//payoffs = {R:1,S:2,T:3,P:4};
Agent.prototype.updateBudget = function(action, payoffs){
	if(this.strategy === true && action === true)
		this.budget += payoffs.R; 
	else if (this.strategy === true && action === false)
		this.budget += payoffs.S; 
	else if (this.strategy === false && action === true)
		this.budget += payoffs.T; 
	else if (this.strategy === false && action === false)
		this.budget += payoffs.P; 
	else 
		throw "Error: unspecified action, can't upadate payoffs"; 
};


Agent.prototype.move = function(grid){
	//Remove self from current square
	this.position.setAgent(null);
	//Update reference to new square. 
	this.position = this.chooseRandomSquare(grid);
	this.position.setAgent(this); 

	//Check for correct update
	if(!this.position.containsAgent())
		throw "ERROR: Couldn't update agent location"; 
};	

Agent.prototype.reproduce = function(grid,threshold,loss){
	//Do nothing if reproduction threshold is not met
	if(this.budget < threshold)
		return; 
	//Instantiate a child with same strategy and random position within vision
	var child = new Agent(this.strategy,this.chooseRandomSquare(grid),
		String(grid.agents.length),this.vision, loss); 

	//Uodate square child is now on
	child.position.setAgent(child);
	//Update agents count 
	grid.agents.push(child);
	//Update agents count
	if(this.strategy)
		grid.cooperators++; 
	else 
		grid.defectors++; 
	//Take initial child budget from agent budget
	this.budget -= loss; 
};


Agent.prototype.die = function(grid, threshold){
	if(this.budget >= threshold)
		return; 
	//Remove from square
	this.position.setAgent(null);
	//Remove self from agents list 
	grid.agents.splice(grid.agents.indexOf(this),1); 
	//Update agents count
	if(this.strategy)
		grid.cooperators--; 
	else
		grid.defectors--; 
};

Agent.prototype.chooseRandomSquare = function(grid){
	//Get squares within vision radius
	var emptySquares = grid.getSquaresInRadius(this.vision);
	
	//Maybe factor into grid function as it won't be used elsewhere
	//Remove squares that are already occupied by an agent
	for (var i = 0; i < emptySquares.length; i++)
		if(!emptySquares[i].containsAgent())
			emptySquares.splice(i,1); 

	//Choose randomly among empty squares
	var chosen = Math.floor(Math.random()*emptySquares.length);
	return emptySquares[chosen];
};