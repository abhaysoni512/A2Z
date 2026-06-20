# Parallelism vs Concurrency

1. **Parallelism**: This is when multiple tasks are executed simultaneously, often on multiple processors or cores. The tasks are truly running at the same time, which can lead to significant performance improvements for CPU-bound tasks.

2. **Concurrency**: Multiple tasks are in progress at the same time, but they may not be executing simultaneously. Concurrency is about dealing with multiple tasks at once, Concurrency can be achieved through techniques like Multitasking, where the CPU switches between tasks to give the illusion of simultaneous execution. Basically, multiple things can happen at the same time, the order matters and sometime tasks have to wait for others to finish before they can proceed.

ex: coffee machine example

