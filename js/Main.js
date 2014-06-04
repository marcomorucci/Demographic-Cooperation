function init(){
	var canvas = document.getElementById("canvas"); 
	var ctx = canvas.getContext("2d"); 
	var g = new Grid(30, canvas);
	var a = generateAgents(500,0.5,1,0);
	populateGrid(g,a);
	console.log(g.cooperators,g.defectors); 
	g.draw(ctx); 
	
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