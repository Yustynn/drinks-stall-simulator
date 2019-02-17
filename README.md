# Drinks Stall Simulator
Part of the Myx Brewery project. This simulator allows an easy way to understand potential losses etc.

## Instructions
Just install the dependencies and mess with the config file as you see fit.

## Probability of Joining Queue
The current formula for determining the probability of someone joining the queue is this:

![equation](https://latex.codecogs.com/gif.latex?%24%24%20%5Cmathbb%20P%28join%29%20%3D%20w%5En%20%24%24)

Where w is the Willingness to Queue factor in the config file, and n is the current queue length at time of arrival.

Despite the simplicity, it gives quite intuitive values at w = 0.9, so I see no reason to complicate it right now.
