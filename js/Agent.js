function Agent(strategy, position, name, vision, budget,maxLife){
	this.position = position || null; 
	this.strategy = strategy; 
	this.budget = budget || 0; 
	this.name = name || ""; 
	this.vision = vision || 1; 
	this.curLife = 0;
	this.maxLife = maxLife || 100; 
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
	var newPos = this.chooseRandomSquare(grid); 
	if(newPos === null)
		return;

	//Remove self from current square
	this.position.setAgent(null);
	//Update reference to new square. 
	this.position = newPos;
	this.position.setAgent(this); 

	//Check for correct update
	if(!this.position.containsAgent())
		throw "ERROR: Couldn't update agent location"; 
};	

Agent.prototype.reproduce = function(grid,threshold,loss){
	//Do nothing if reproduction threshold is not met
	if(this.budget < threshold)
		return; 

	//Setup child position or return if no squares are available
	var childPos = this.chooseRandomSquare(grid); 
	if(childPos === null)
		return; 

	//Instantiate a child with same strategy and random position within vision
	var child = new Agent(this.strategy,childPos,
		String(grid.agents.length + grid.children.length),this.vision, loss,this.maxLife); 
	
	//Uodate square child is now on
	child.position.setAgent(child);
	//Update agents count 
	grid.children.push(child);
	//Update agents count
	if(this.strategy)
		grid.cooperators++; 
	else 
		grid.defectors++; 
	//Take initial child budget from agent budget
	this.budget -= loss; 
};


Agent.prototype.die = function(grid, threshold){
	if(this.budget >= threshold && this.curLife <= this.maxLife){
		this.curLife++;
		return; 
	}
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
	var available = grid.getSquaresInRadius(this.vision,this.position.row,this.position.col);
	var emptySquares = [];
	
	//Maybe factor into grid function as it won't be used elsewhere
	//Remove squares that are already occupied by an agent
	for (var i = 0; i < available.length; i++)
		if(!available[i].containsAgent())
			emptySquares.push(available[i]); 

	//Choose randomly among empty squares
	var chosen = Math.floor(Math.random()*emptySquares.length);
	return emptySquares[chosen] || null;
};