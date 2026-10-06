---
title: Agents with LangGraph
description: Building multi-step LLM agents that work in production. State machines, tools, checkpointing, and human-in-the-loop.
tagline: Not another "look, it calls a function" tutorial.
order: 3
---

LLM agents are easy to prototype and hard to run in production. The prototype is three lines of code that let a model call tools. The production system is state management, retries, checkpointing, graceful failure, and the ability to resume a half-finished conversation three days later without losing anything.

This book is about that second system, using LangGraph as the concrete framework. LangGraph is not the only option - CrewAI, AutoGen, and plain Python state machines all work - but it gets the architecture right and the patterns it encourages transfer to anything else.

Everything in here is generic. There are no company APIs, no proprietary tool catalogs, no customer data. The focus is on the shape of the problem and the shape of the solution.
