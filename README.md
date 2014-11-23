#README
This is the code for a web-based implementation  of Joshua Epstein's demographic prisoner's dilemma model. 

**The  model can be viewed and ran [here](http://marcomorucci.github.io/Demographic-Cooperation/)**


##Background
The model is a re-implementation of the  model described in [this paper](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.8598&rep=rep1&type=pdf) by Joshua Epstein. 
It is an almost identical implementation, with a few added features, these are:

1. Death age randomisation.
2. Payoff randomisation.
3. Customisable order of action. 

### The Demographic Prisoner's Dilemma
The model is based on the standard definition of the prisoner's dilemma. 

||C|D|
||---|--|
|C|-1,-1|-6,0|
|D|0,-6|-2,-2|

If we let players' strategically choose their moves, then the result will be (D,D). However, consider what would happen in a situation where players didn't choose their moves, and they were somehow "embedded" in their character. In this case, you would have a number of "natural-born" cooperators and defectors. The first would gain when playing against one of their own kind; and lose against a member of the opposite genus. The opposite would be true for the defectors. 

This situation is what Epstein's Demographic prisoner's dilemma tries to model.  

###How it works
Players are initialised as either cooperators or defectors and placed on a grid (a torus actually).  During each round, they play the prisoner's dilemma against their neighbours, they gain or lose basing on their type, the other's type and the user-chosen payoffs for each kind of action couple. A player can also move randomly on free spaces in its neighbourhood. 

Their gains and losses are accumulated in each player's "budget". When a player's budget goes below a certain threshold, that player dies and leaves the grid. Instead, when a player's budget goes above an upper threshold, that player is allowed to reproduce and  spawns a child of its own type. This provided that there are free slots within the vision range of that player. 

There are several other factors taken into account by the simulation, they are detailed in the **Model Parameters** section. 

##Model Parameters

### Name: Update 
#### Value: Synchronous or Asynchronous
Whether the model should update all agents at once or one at a time. This parameter is closely related to the order of action described in the **Action Order** param. If the updating is synchronous, then all agents will perform all actions in the chosen order before updating with the results. If the updating is asynchronous, each player will update itself and the others as soon as each of its action is performed. 
As Epstein points out in his paper, Asynchronous updating is generally better for this kind of simulation. 

###Name: Grid Size
#### Value: Integer between 5 and 100.
The number of spaces on each side of the square grid. The grid is actually a Torus, as each side is connected to the opposite. 
Epstein's original model was run on a 30x30 torus, here we can expand up to 100 with similar results. Be warned that the simulation is run by the browser and as such relies 100% on the hardware of the computer used. If the computer is not powerful enough, a grid too large could lead to lag/hanging. That being said, a 50x50 (or even larger) grid should work fine on most modern computers. 

###Name: Agents
#### Value: Integer between 2 and Grid Size x Grid Size
The initial number of agents to be placed on the grid. 

###Name: Defectors
####Value: Real greater than 0 and less than 1
The initial proportion of agents playing defect. 1-Defectors will be the resulting proportion of cooperators on the grid. The agent initialisation is randomised, so the actual proportion of defectors will not exactly mirror the number input. Effectively, this parameter is used as the probability that one of the initial players will be a defector. 

###Name: Budget
####Value: Integer greater than 0
The initial budget of players instantiated at the beginning of the simulation. Gains/losses from interaction will be added/subtracted from this amount. 

###Name: Vision
####Value: Integer greater than 0
How many spaces away from its current position a player can spawn children in and move to. The value is interpreted as the radius of a circle of spaces surrounding the player. The way the player calculates where it can move each round is probably the biggest bottleneck in the code, as such a large value for vision might cause noticeable slowdowns. 

###Name: Reprod
####Value: integer grater than 0
How large a player's budget must be before it's allowed to reproduce. 

###Name: Death
####Value: positive or negative integer
Lower threshold for agents' budget: if surpassed, the agent dies and leaves the grid. 

###Name: Neighbour
####Value: Either Von Neumann or Moore
The agent's neighbourhood is the collection of spaces next to it in which agents the player will play against in each round may be located. 
A Von Neumann neighbourhood only considers the 4 spaces below, left, right and above the player. A Moore neighbourhood adds to these also the 4 corner squares on the top left, top right, bottom left and bottom right of the player, thus allowing 8 interactions per player at each round. 

###Name: Child
####Value: integer between 0 and Reprod
The initial endowment of each child. This amount will be detracted from the parent's budget and will constitute the initial budget of any newly spawned agent. 

###Name: Min Age
####Value: integer between 0 and Max Age
The minimum number of rounds after which an agent can die. Death is randomised between Min Age and Max Age. If you wish to avoid the randomisation simply set this to equal Max Age. 

###Name: Max Age
####Value: Integer greater than Min Age
The max number of rounds an agent can be alive for. If the agent doesn't randomly die after min age, it will die automatically once it goes beyond Max Age. 

###Name: Mutation
####Value: Real between 0 and 1
The probability that an agent's child will be of a type opposite than its parent's. Mutation can be turned off by setting this parameter to 0. 

###Name: Metabolism
####Value: Integer greater or equal to 0. 
A fixed amount to be detracted from each agent's budget at each round. Can be used to simulate the "cost of living". Can be turned off by setting the parameter to 0.

###Name: Action Order
####Value: Either 1, 2, 3 or 4. 
The order in which each agent will perform its actions during the round. Two actions *cannot* have the same position. The result of the action will be used to update the grid and the agent's individual parameters according to the update param. 

###Name: Payoff Type
####Value: Either Fixed, Random Uniform or Random Normal. 
The type of payoff function to be used at each game. 

Fixed keeps the payoffs the same for each transaction and for all players. Random Uniform randomises payoffs uniformly at each transaction for each player. Random Normal behaves the same as random uniform, only drawing the payoff value from a normal distribution. 

This functionality has been introduced to make sure having positive or negative payoffs for specific couples of actions did't influence the results of the simulation too much. 

###Name: Payoffs:
####Value: All positive or negative integers
All values are added to the player budget *as they are specified*, so, if you wish a payoff to be subtracted from a player's budget, you need to specify it with a negative sign. 

* **T** How much a defector will gain when playing against a cooperator
* **R** How much a cooperator will gain when playing against a cooperator
* **P** How much a defector will lose when playing against a defector
* **S** How much a cooperator will lose when playing against a defector.

###Name: Rounds
####Value: Integer greater than 0
The number of rounds the simulation should run for. Epstein's initial model was run for at least 1000 rounds. 

###Name: Speed
####Value: real between 0 and 1
Controls the speed of the simulation. Max is at 30 fps. Keeping it maximised is recommended. Turn it down if you experience lag, slowdown or are working on an older machine. Speed must be set *before* the simulation is started as it will not be modifiable at runtime. 

##Graphs
The two graphs are drawn using the amazing [dygraph](http://dygraphs.com/) charting library. 

Round number is always plotted on the X axis. Variables on the Y axis are always plotted both by agent type and on average/total. 
Several alternatives variables can be plotted on the Y axis. 

These are:

 * Number of Cooperations and Defections
 * Number of agents of each type on the grid
 * Average payoff for all the interactions of all agents. 
 *  % of agents of each type that died, reproduced or moved.
 * total number of agents that moved, reproduced or died.
 * Average age of agents. 
 * Average agent budget. 

##Known Issues
* Payoff function type switching works only on Firefox.
