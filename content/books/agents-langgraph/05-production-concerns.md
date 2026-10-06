---
title: Running agents in production
description: Observability, cost, retries, and the things that catch you after launch.
order: 5
---

The agent works in dev. Now it has to work for real users, at real volume, with real failure modes. The things that catch you here are rarely about the LLM. They are about everything around it.

## Observability

You cannot debug what you cannot see. Minimum viable observability for an agent:

- **Per-invocation trace** - which nodes ran, in what order, how long each took, what state looked like at each step.
- **LLM call logs** - model, prompt, response, tokens, latency, cost.
- **Tool call logs** - tool name, arguments, result, errors.
- **Thread-level timeline** - everything that happened for a specific thread_id, sorted by time.

LangSmith, Langfuse, and Phoenix all do this. If you cannot adopt a vendor, roll a minimal version yourself: structured JSON logs with trace IDs, piped to any log aggregator. The exact tool matters less than the discipline of logging consistently.

## Cost control

Agents are expensive. Each LLM call is a billable event, and agents make many of them. Three practical levers:

- **Pick the right model per node.** Classification does not need GPT-4. Use a cheaper model for routing and a stronger one for generation. In LangGraph, each node can use a different LLM.
- **Cache aggressively.** Identical prompts return identical outputs. A simple content-hash cache around the LLM call eliminates duplicate charges when a user retries a question or the same deterministic path runs twice.
- **Set hard limits.** Max tokens per response. Max iterations per thread. Cost budget per user. These prevent runaway loops from draining budget on a single bug.

Monitor cost per thread and cost per completed outcome. The second number tells you whether the agent is paying for itself.

## Retries and timeouts

LLM APIs fail. Rate limits, 500s, timeouts. Build retries in at the LLM-call layer, not inside your nodes:

- Exponential backoff with jitter.
- Retry only on transient errors (429, 5xx, timeouts), not on client errors (400, 401).
- Cap retries at a small number - 3 is usually right. Beyond that, fail the invocation and let higher levels decide.

Tool calls need their own retry logic depending on what the tool does. API calls get the same backoff treatment. Database queries usually should not retry at the tool level - let the connection pool handle it.

## Rate limiting your own agent

Users can hit refresh. Processes can crash and retry. Your agent will sometimes receive the same request multiple times. Three mitigations:

- **Idempotency keys** on side effects. "Send email" takes a key; sending twice with the same key only sends once.
- **Request-level dedup.** Hash the input, check if a thread is already processing it, return the in-flight promise instead of starting a new invocation.
- **Per-user rate limits.** Even without malicious intent, one user running 50 concurrent requests will degrade the service for others.

## Graceful failure

The agent will fail. The question is whether failure degrades gracefully or breaks the user experience:

- A node that cannot complete should route to an "I ran into a problem" response, not throw an unhandled exception.
- A tool that returns an error should be fed back to the LLM so it can respond ("the lookup failed, let me try differently"), not surfaced as a stack trace.
- A pipeline that cannot find an answer should route to escalation, not return silence or guesses.

Model failure as a first-class node, not an exception handler.

## Evaluation in production

Dev evaluation covers correctness. Production evaluation covers drift:

- Are responses still accurate as the underlying data changes?
- Are new user queries falling into categories your eval set does not cover?
- Is the model's behavior shifting after a provider updates their endpoint?

Sample a small percentage of production invocations into a review queue. Have a human or a model-as-judge grade them. Watch the trend. When quality drops, you have early warning before users complain.

Agents in production are mostly plumbing. The exciting part - the model deciding what to do - is 5% of the system by code. The other 95% is making the 5% survive contact with reality.
