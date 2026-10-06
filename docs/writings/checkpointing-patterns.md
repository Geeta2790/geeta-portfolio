---
title: Checkpointing patterns for long-running conversational agents
description: Practical patterns for persisting agent state so conversations survive restarts, resumes, and edits - notes from building LangGraph-based assistants in production.
date: 2026-10-04
---

# Checkpointing patterns for long-running conversational agents

If your agent lives for more than a single request-response round-trip, you need to persist state. Not "nice to have" - a baseline requirement. Users close tabs. Processes get redeployed. Networks blip. A conversation that only lives in memory is a conversation you'll lose at exactly the worst moment.

Here's what I've learned about doing this well, mostly from building a LangGraph-based cloud provisioning assistant where conversations span dozens of turns and users routinely leave and come back.

## 1. Checkpoint after every node, not every message

The temptation is to save state only when the user sends a message. That's not enough. A single user message can trigger multiple graph nodes - classification, validation, enrichment, LLM call, tool call. If the process dies mid-way through, you want to resume where you failed, not re-run everything.

LangGraph does this natively: a checkpointer saves state at every node boundary. If you're rolling your own, pick a persistence boundary smaller than "turn" - otherwise retries become expensive and non-deterministic.

## 2. Use PostgreSQL for conversation state, not Redis

Redis is great for ephemeral option lookups (my regions-to-zones cache lives there). But conversation state belongs in PostgreSQL:

- You want durability guarantees, not eviction.
- You want to query across conversations (how many sessions got stuck at the "subnet selection" node?).
- You want transactional writes alongside your business data.

Redis is for things you can rebuild. Postgres is for things you can't.

## 3. Make the state schema explicit

LangGraph lets you define state as a `TypedDict` or Pydantic model. Do this. The alternative - a free-form dict that each node adds keys to - turns into untraceable chaos within a week.

Explicit state also makes checkpoints portable: you can migrate state between schema versions, you can inspect a stuck conversation in a Postgres client, you can write tests against known-good state fixtures.

## 4. Design for "resume" from day one

Every conversation should be resumable by ID. That means:

- A `GET /sessions/{id}` endpoint that returns the current state and the next question.
- A `POST /sessions/{id}/resume` that re-runs the graph from the last checkpoint.
- A `POST /sessions/{id}/edit` that lets a user go back and change an earlier answer - and re-runs the dependent downstream nodes.

The "edit" case is where naive checkpointing breaks. If a user edits answer #3 and answers #4, #5, #6 depended on it, you can't just re-run from #3 - you need to invalidate the downstream state. Model this explicitly in your graph: nodes should declare what state they depend on, so edits can target the right slice.

## 5. Checkpoint the inputs, not just the outputs

When a node runs, save the inputs it saw along with the outputs it produced. This is boring and feels redundant - until you're debugging a weird edge case six months later and you want to replay exactly what happened. Logs rot; checkpointed inputs don't.

## 6. Expire old checkpoints, but keep an audit trail

You don't need 90-day-old in-progress sessions cluttering your database. Expire incomplete sessions after a sensible window. But when a session completes successfully, keep an audit record - the final state, the sequence of nodes, the inputs at each step. This is cheap, and compliance will thank you.

## 7. Human-in-the-loop is a checkpoint boundary

When your graph pauses for human approval, that's a checkpoint. The approver might click "approve" five minutes later or five days later. Model the paused state explicitly ("awaiting_approval") and checkpoint before the pause - so a redeploy during the wait doesn't lose the pending decision.

---

Checkpointing isn't glamorous. It's not the part of agent-building that goes in demos. But it's the difference between an agent that works in a Jupyter notebook and one that survives production.

More agent-plumbing notes to come.
