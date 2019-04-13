# SUTD Drinks Stall Simulator
The canteen in SUTD has an unusually slow drink stall. This is a quick simulation to estimate the monetary losses due to the slow service.

I've written it in JavaScript so that I can add a front-end later. The math is done from scratch to make it even more lightweight

## Instructions
Just install the dependencies and mess with the config file as you see fit.

```yarn```
or
```npm i```

## General Comments
• The service times and arrival times are both determined by independent Poisson processes. The math for generating the interarrival times is based on a simple inversion of the CDF.
• The parameters are fairly arbitrarily set, to things I intuitively feel are correct

## Probability of Joining Queue
This is the only non-standard part of the simulation. The current formula for determining the probability of someone joining the queue is this:

![equation](https://latex.codecogs.com/gif.latex?%24%24%20%5Cmathbb%20P%28join%29%20%3D%20w%5En%20%24%24)

Where w is the Willingness to Queue factor in the config file, and n is the current queue length at time of arrival.

Despite the simplicity, it gives quite intuitive values at w = 0.9, so I see no reason to complicate it right now.
