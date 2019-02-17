# Drinks Stall Simulator
Part of the Myx Brewery project. This simulator allows an easy way to understand potential losses etc.

## Instructions
Just install the dependencies and mess with the config file as you see fit.

## Notes
The current formula for determining the probability of someone joining the queue is this:
$$ P(join) = WQ^n $$

Where WQ is the Willingness to Queue factor in the config file, and n is the current queue length at time of arrival.

Despite the simplicity, it gives quite intuitive values at $WQ = 0.9$ so I see no reason to complicate it right now.
