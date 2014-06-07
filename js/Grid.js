function Grid(side, canvas){
	 this.w = canvas.width; 
	 this.h = canvas.height; 
	 this.side = side; 
	 this.agents = [];
	 this.cooperators = 0; 
	 this.defectors = 0; 
	 this.positions = [];
	 this.createSquares(side); 
}

Grid.prototype.createSquares = function(){
	 this.squares = []; 
	 // The radius of the grid circles is the average of rows and columns
	 var sr = (this.w/this.side)/2; 
	 // A distance offset between squares, 10% of their radius
	 var sd = sr*0.10; 
	 sr -= sd; 
	 //Create single squares for each line and column
	 for(var r = 0; r < this.side; r++){
	 	this.positions.push([]);
	 	for(var c = 0; c < this.side; c++){
	 		//The position of each square 
	 		//all the constants are just there to maintain distance and 
	 		//to make sure all squares fit in the correct spot. 
	 		var posX = r*(2*sr + 2*sd)+sr+sd;
	 		var posY = c*(2*sr + 2*sd)+sr+sd;
	 		var s = new Square(posX,posY, sr); 
	 		s.col = c; 
	 		s.row = r; 
	 		//this.squares.push(s); 
	 		this.positions[r].push(s);
	 	}
	 }
};

/*
 * There's got to be a more elegant way of doing this, 
 * but who cares anyway. 
 */
Grid.prototype.getNeighbours = function(r,c){

	var neighbours = [];

	neighbours.push(this.wrap(r-1,c));
	neighbours.push(this.wrap(r+1,c));
	neighbours.push(this.wrap(r,c-1));
	neighbours.push(this.wrap(r,c+1));
	neighbours.push(this.wrap(r-1,c-1));
	neighbours.push(this.wrap(r-1,c+1));
	neighbours.push(this.wrap(r+1,c-1));
	neighbours.push(this.wrap(r+1,c+1));

	return neighbours; 
};

Grid.prototype.wrap = function(r,c){
	var newR = r; 
	var newC = c; 

	if(r >= this.side)
		newR = r-this.side; 
	else if(r < 0)
		newR = r + this.side; 
	if(c >= this.side)
		newC = c-this.side; 
	else if (c < 0)
		newC = c + this.side; 

	return this.positions[newR][newC];
};

//Possible bottleneck, must see how it goes
//and optimize if needed. 
// Also remember to remove initial node from 
// returned list after the fcn is called. 
Grid.prototype.getSquaresInRadius = function(radius,r,c){
	if(radius <= 1)
		return this.getNeighbours(r,c);

	var neighbours = this.getNeighbours(r,c);
	var closest = [];
	for (var i = 4; i<neighbours.length; i++){
		var outer = this.getSquaresInRadius(radius-1,neighbours[i].row, neighbours[i].col);
		for(var l = 0; l < outer.length; l++)
			closest.push(outer[l]);
	}
	
	for(var b = 0; b < neighbours.length; b++)
		closest.push(neighbours[b]);

	//remove duplicates
	var squaresInRadius = [];
	for(var d = 0; d < closest.length; d++)
		if(squaresInRadius.indexOf(closest[d]) === -1)
			squaresInRadius.push(closest[d]);
	
	return squaresInRadius; 
};

Grid.prototype.draw = function(ctx){ 
	ctx.clearRect(0,0,this.w, this.h );
	for(var r = 0; r < this.positions.length; r++){
		for(var c = 0; c < this.positions[r].length; c++){
			this.positions[r][c].draw(ctx); 
		}
	}
};

