### Class structure: 
* **Agent**
* **Square**
* **Grid**

### Interfaces: 
#### Agent
1. **getAction()**: returns the action the agent has built in. 
2. **updateBudget(action, payoffs)**: Updates this agent's budget given the action of the other player and a set of payoffs. 
3. **move(Grid)**: moves the agent in the first empty square in its line of vision.
4. **reproduce(Grid)**: spawns a son (agent with same strategy) in an empty grid square within the agent's vision field. 
5. **die()**: removes agent from grid and destroys it. 
6. **name**: returns an unique label for this agent

#### Square
1. **containsAgent()**: returns true or false whether this square contains an agent or is empty. 
2. **Agent**: holds a reference to the agent located in this square. 
3. **x, y, w, h**: return position, width and height of this square. 
4. **fill**: returns color of this square.

#### Grid
1. **squares**: returns the array of squares contained in the grid
2. **update()**: updates rectangles to be drawn with colors. 
3. **draw()**: draws the grid each frame. 
4. **getNeighbours(Square s)**: returns all 6 squares adjacent to square s. 

### Simulation subroutine:
	RunSim(Grid, # of Rounds, payoffFunction)
		for each round:
			memo = map string:string.  
			for each square in Grid.squares: 
				if square has agent: 
					for each square neighbouring this one: 
						if there is an agent in this neighbour AND this transaction hasn't already happened:
							p = payoffFunction; 
							update Budgets of both agents with p and each other's actions
							collect data on actions performed.
						save transaction in this round's memory.
					kill agent 
					move agent
					reproduce agen		
			update grid
			redraw grid

### Payoff subroutines:
1. **fixed**: user inputs fixed values for all 4 payoffs.
2. **random**: user inputs min and max values for all 4 payoffs. If min and max are the same, then the value is considered fixed. 
3. **normal**: user inputs the mean of the normal distribution from which payoffs have to be chosen. 

### Graphics and user inputs. 
1. **Canvas** to draw on, possibly stored in the Grid class
2. **Slider/Text Field** to input number of rounds. 	  
3. **Slider/Text Field** to choose grid size (square only?).
4. **Slider/Text Field** to input agent density. 
5. **Slider/Text Field** to select cooperators/defectors ratio. 
6. **Dropdown** to select payoff method. 
7. **Text Fields** to input payoff method parameters. 
8. **Slider/Text Field**: to control agent's vision parameter.  