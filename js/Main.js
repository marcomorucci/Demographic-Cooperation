function init(){
	var canvas = document.getElementById("canvas"); 
	var ctx = canvas.getContext("2d"); 
	var g = new Grid(10, canvas);
	g.draw(ctx); 
	var n = g.getSquaresInRadius(2,4,3);
	for (var i = 0; i < n.length; i++){
		n[i].color = "#E75050";
	}
	ctx.clearRect(0,0,canvas.width,canvas.height);
	g.draw(ctx); 
	console.log(n.length);
}