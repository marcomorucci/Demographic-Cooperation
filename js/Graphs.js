function updateRecords(roundData,firstGraph,secondGraph){
	var totAgents = roundData.nCoop+roundData.nDef; 
	switch (firstGraph){
		case "coop/def":
			firstLabels = ["Round","Cooperations","Defections","Interactions"];
			firstData.push([roundData.round,roundData.coop,roundData.def,roundData.coop+roundData.def]);
		break;
		case "nCoop/nDef":
			firstLabels = ["Round","Cooperators","Defectors","Agents"];
			firstData.push([roundData.round,roundData.nCoop,roundData.nDef,roundData.nCoop+roundData.nDef]);
		break;
		case "avgPayoff":
			firstLabels = ["Round","Avg. cooperator gain","Avg. defector gain","Avg. total gain"];
			firstData.push([roundData.round,roundData.avgCoop/roundData.nCoop,
				roundData.avgDef/roundData.nDef,(roundData.avgCoop+roundData.avgDef)/totAgents]);
		break;
		case "deathRatio":
			firstLabels = ["Round","Coop. that died (%)","Def. that died (%)","Agents that died (%)"];
			firstData.push([roundData.round,roundData.coopDeath/roundData.nCoop,roundData.defDeath/roundData.nDef,
				(roundData.coopDeath+roundData.defDeath)/totAgents]);
		break;
		case "repRatio":
			firstLabels = ["Round","Coop. that reproduced (%)","Def. that reproduced (%)","Agents that reproduced (%)"];
			firstData.push([roundData.round,roundData.coopRep/roundData.nCoop,roundData.defRep/roundData.nDef,
				(roundData.coopRep+roundData.defRep)/totAgents]);
		break;
		case "moveRatio":
			firstLabels = ["Round","Coop. that moved (%)","Def. that moved (%)","Agents that moved (%)"];
			firstData.push([roundData.round,roundData.coopMove/roundData.nCoop,roundData.defMove/roundData.nDef,
				(roundData.coopMove+roundData.defMove)/totAgents]);
		break;
	}
	switch(secondGraph){
		case "coop/def":
			secondLabels = ["Round","Cooperations","Defections","Interactions"];
			secondData.push([roundData.round,roundData.coop,roundData.def,roundData.coop+roundData.def]);
		break;
		case "nCoop/nDef":
			secondLabels = ["Round","Cooperators","Defectors","Agents"];
			secondData.push([roundData.round,roundData.nCoop,roundData.nDef,roundData.nCoop+roundData.nDef]);
		break;
		case "avgPayoff":
			secondLabels = ["Round","Avg. cooperator gain","Avg. defector gain","Avg. total gain"];
			secondData.push([roundData.round,roundData.avgCoop/roundData.nCoop,
				roundData.avgDef/roundData.nDef,(roundData.avgCoop+roundData.avgDef)/totAgents]);
		break;
		case "deathRatio":
			secondLabels = ["Round","Coop. that died (%)","Def. that died (%)","Agents that died (%)"];
			secondData.push([roundData.round,roundData.coopDeath/roundData.nCoop,roundData.defDeath/roundData.nDef,
				(roundData.coopDeath+roundData.defDeath)/totAgents]);
		break;
		case "repRatio":
			secondLabels = ["Round","Coop. that reproduced (%)","Def. that reproduced (%)","Agents that reproduced (%)"];
			secondData.push([roundData.round,roundData.coopRep/roundData.nCoop,roundData.defRep/roundData.nDef,
				(roundData.coopRep+roundData.defRep)/totAgents]);
		break;
		case "moveRatio":
			secondLabels = ["Round","Coop. that moved (%)","Def. that moved (%)","Agents that moved (%)"];
			secondData.push([roundData.round,roundData.coopMove/roundData.nCoop,roundData.defMove/roundData.nDef,
				(roundData.coopMove+roundData.defMove)/totAgents]);
		break;
	}
}

function updatePlots(){
	a = new Dygraph(document.getElementById("ActionGraph"), 
	 	firstData,{labels: firstLabels});
	l = new Dygraph(document.getElementById("LifeGraph"), 
	 	secondData,{labels: secondLabels});
}
