---
title: What is an agent
description: Separating the term from the hype. What agents actually are and when you want one.
order: 1
---

"Agent" is one of the most abused words in the LLM ecosystem right now. In different conversations it means a chatbot, a function-calling model, a multi-step workflow, an autonomous research assistant, or a thing that can delete your files. For the purposes of this book, an agent is:

> A system where an LLM decides which action to take next, from a defined set of actions, in a loop that continues until a termination condition is met.

The key words are "decides" and "loop." A single LLM call that produces a response is not an agent. A pipeline that always runs the same five steps is not an agent. A system where the model picks among tools based on the current state, maybe calls one, observes the result, and decides what to do next - that is an agent.

## When you actually want an agent

Agents are more complex, more expensive, and harder to reason about than straight pipelines. Reach for one when:

- The sequence of steps depends on the input in ways you cannot enumerate in advance.
- The model needs to interact with external systems (databases, APIs, document stores) and use their responses to shape later steps.
- The task requires multi-turn interaction with the user, where the next question depends on earlier answers.
- A one-shot prompt would need to encode too many branching cases to stay reliable.

If you can describe the full workflow as a fixed sequence - "classify, then retrieve, then generate" - do not use an agent. Use a chain. Chains are faster, cheaper, and easier to evaluate. Agents are for when the branching is genuinely data-dependent.

## The anatomy of an agent

Every agent has four parts:

1. **State** - everything the agent knows at this moment. Conversation history, tool outputs, user inputs, intermediate decisions.
2. **Tools** - the actions the agent can take. Functions it can call, APIs it can hit, databases it can query.
3. **A reasoner** - the LLM that reads the state and decides what to do next.
4. **A control loop** - the code that calls the reasoner, dispatches the chosen action, updates the state, and decides whether to continue.

LangGraph makes all four explicit. State is a typed object you define. Tools are Python functions decorated appropriately. The reasoner is an LLM node in a graph. The control loop is the graph itself - a directed graph where each node reads state and returns an update.

## Why state machines

The ReAct-style pattern (reason, act, observe, repeat) is a loop. You can implement it with recursion or `while True`, and plenty of agents do. But as the agent grows, you want:

- Different reasoners for different situations (one model for classification, another for generation).
- Branching based on what the previous step returned.
- Explicit "we are now waiting for a human" states.
- The ability to inspect, log, and resume execution.

A state machine (which is what LangGraph gives you) models all of this directly. Nodes are steps. Edges are decisions. State is a dictionary that flows through. When you need to pause, resume, or branch, you add a node or an edge rather than tangling a monolithic loop.

The next chapters cover each piece: defining state, calling tools, routing with conditional edges, pausing for humans, and persisting the whole thing to a database so it survives restarts.
