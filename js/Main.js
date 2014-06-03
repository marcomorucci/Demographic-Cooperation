function init(){
	var canvas = document.getElementById("canvas"); 
	var ctx = canvas.getContext("2d"); 
	var g = new Grid(5, canvas);
	g.draw(ctx); 
}