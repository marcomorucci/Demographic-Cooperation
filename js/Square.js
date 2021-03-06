function Square(x,y,r){
	this.agent = null; 
	this.x = x || 0; 
	this.y = y || 0; 
	this.r = r || 0; 
	this.color = '#CFC0C0'; 
	this.row = 0; 
	this.col = 0; 
}
Square.prototype.containsAgent = function(){
	return this.agent !== null; 
};

Square.prototype.draw = function(ctx){
	ctx.beginPath(); 
	ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
	ctx.fillStyle = this.color; 
	ctx.fill(); 
	//ctx.fillStyle = "black"; 
	//ctx.fillText(String(this.row)+","+String(this.col),this.x-7,this.y+5);
};

Square.prototype.setAgent = function(agent){
	this.agent = agent; 
	if(this.agent === null)
		this.color = '#CFC0C0';
	else if(this.agent.strategy === false) 
		this.color = "#ff6666";
	else if(this.agent.strategy === true)
	 	this.color = "#6666ff";
};
