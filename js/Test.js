txt = document.getElementById("console");

function testAgentConstructor(){
	txt.innerHTML = "<p> Testing agent constructor... </p> <p> =============== </p>";
	var a = new Agent(true,null,"a",2,10);
	try{
		if(a.strategy !== true) throw "Strategy not stored correctly: " + 
			String(a.strategy) + " instead of " + String(true);
		if(a.position !== null) throw "Position not set correctly: " + 
			String(a.position) + " instead of " + String(null); 
		if(a.name !== "a") throw "Name not set correctly: " + String(a.name) + 
			" instead of " + "a";
		if(a.vision !== 2) throw "Vision not set correctly: " + String(a.vision) + 
			" instead of " + "2";
		if(a.budget !== 10) throw "Budget not set correctly: " + String(a.budget) + 
			" instead of "+ "10";
	} catch (err) {
		txt.innerHTML += "<p>" + "FAIL: " + err + "." + "</p>";
	}
	txt.innerHTML += "<p> PASS! </p>";
}

function testUpdateBudget(){
	txt.innerHTML = "<p> Testing budget updating...</p> <p> =============== </p>";
	var a = new Agent(true,null,"a",2,10);
	var p = {T:5,R:3,P:-1,S:-3};
	try{
		a.updateBudget(true,p);
		if(a.budget != 13) throw "Budget updated incorrectly: " + String(a.budget) + 
			" instead of " + "13";
		a.updateBudget(false,p);
		if(a.budget != 10) throw "Budget updated incorrectly: " + String(a.budget) + 
			" instead of " + "10";
		a.strategy = false; 
		a.updateBudget(true,p);
		if(a.budget != 15) throw "Budget updated incorrectly: " + String(a.budget) + 
			" instead of " + "15";
		a.updateBudget(false,p);
		if(a.budget != 14) throw "Budget updated incorrectly: " + String(a.budget) + 
			" instead of " + "14";
	}catch(err){
		txt.innerHTML += "<p>" + "FAIL: " + err + "." + "</p>";
	}
	txt.innerHTML += "<p> PASS! </p>";
}

function testAgentMovement(grid){
	var a = new Agent(true,grid.positions[3][3],"a",2,10);
	var n = grid.getSquaresInRadius(a.vision,3,3); 
	for(var i = 0; i < n.length; i++)
		n[i].color = "#98E453";
	a.move(grid);
}

function testReproduce(grid){
	var n = grid.getSquaresInRadius(2,3,3); 
	for(var i = 0; i < n.length; i++)
		n[i].color = "#98E453";
	var a = new Agent(true,grid.positions[3][3],"a",2,100);
	a.position.setAgent(a); 
	grid.agents.push(a); 
	a.reproduce(grid,10,0);
	a.reproduce(grid,10,0); 
}