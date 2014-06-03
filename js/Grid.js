function Grid(side, canvas){
	 this.w = canvas.width; 
	 this.h = canvas.height; 
	 this.side = side; 
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
	 	for(var c = 0; c < this.side; c++){
	 		//The position of each square 
	 		//all the constants are just there to maintain distance and 
	 		//to make sure all squares fit in the correct spot. 
	 		var posX = r*(2*sr + 2*sd)+sr+sd;
	 		var posY = c*(2*sr + 2*sd)+sr+sd;
	 		var s = new Square(posX,posY, sr); 
	 		this.squares.push(s); 
	 	}
	 }
};

/*
 * There's got to be a more elegant way of doing this, 
 * but who cares anyway. 
 */
Grid.prototype.getNeighbours = function(ind){
	var neighbours = [];
	
	//If this square is not on any border of the grid
	//if(ind%this.side !== this.side-1 && ind%this.side !== 0 &&
	//	ind - this.side > 0 && this.squares.length - ind  > this.side)

};

Grid.prototype.draw = function(ctx){ 
	for(var i = 0; i<this.squares.length; i++){
		this.squares[i].draw(ctx);
	}
};

