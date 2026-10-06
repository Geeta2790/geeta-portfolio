---
title: Checkpointing and durability
description: Making agents survive restarts, resumes, and the real world.
order: 4
---

A notebook agent runs once and exits. A production agent needs to survive process restarts, network blips, user tab closures, and the five-day gap between when a user starts a conversation and when they come back to finish it. That means persisting state at every meaningful step. LangGraph calls this checkpointing.

## Why checkpoint

Three concrete scenarios:

1. **User leaves and returns.** They start a multi-step provisioning conversation, answer four questions, close the browser. Three days later they come back. The agent should resume where they left off, not start over.
2. **The process restarts mid-execution.** A deploy, a crash, a Kubernetes rescheduling event. The agent should pick up at the last completed node, not the last successful invocation.
3. **You need to debug a stuck conversation.** With checkpoints you can inspect state at every step. Without them, you have logs.

## Enabling checkpointing

LangGraph ships with checkpointer implementations for SQLite, Postgres, and in-memory stores:

```python
from langgraph.checkpoint.postgres import PostgresSaver

checkpointer = PostgresSaver.from_conn_string("postgresql://...")
app = graph.compile(checkpointer=checkpointer)
```

Now every invocation needs a thread ID:

```python
config = {"configurable": {"thread_id": "user-123-session-456"}}
app.invoke(initial_state, config=config)
# ...later, same thread_id:
app.invoke(new_input, config=config)  # resumes from last checkpoint
```

Each node execution writes a checkpoint. Resuming reads the latest checkpoint for the thread and continues from there.

## What gets persisted

The full state object, serialized. That means:

- Messages, intermediate decisions, tool outputs: all persisted automatically.
- Pydantic models and dataclasses: fine, as long as they are serializable.
- Database connections, file handles, LLM clients: these do not go in state. Keep them as module-level singletons or dependency-injected arguments, not state fields.

Checkpoints are per-node. If a node crashes mid-execution, the previous node's checkpoint is the resume point - that node will run again. Design nodes to be idempotent where possible, or use idempotency keys for side effects.

## Postgres over SQLite in production

SQLite works for local dev and single-process apps. For anything multi-replica, use Postgres:

- Concurrent writes from multiple app instances.
- Transactional guarantees across state and your business data.
- Backups, replication, point-in-time recovery - all the Postgres you already know.
- Queryability: `SELECT thread_id FROM checkpoints WHERE state->>'user_intent' = 'escalate'` is a real tool for finding stuck sessions.

## Thread lifecycle

Not every thread needs to live forever. Policies I use:

- **Active threads** - last activity within N days. Keep in main table.
- **Completed threads** - final state reached. Move to archive table or export to object storage.
- **Abandoned threads** - no activity for M days, not completed. Clean up with a scheduled job.

Checkpoint rows are cheap but not free. A busy system can accumulate millions. Define a retention policy early.

## Human-in-the-loop as a checkpoint

The pause-for-human pattern is a specific checkpointing use case. When the agent reaches a decision that needs approval, it writes a checkpoint and returns. The UI shows the pending decision. Later, when a human approves or rejects, the agent resumes from that checkpoint with the human's input added to state.

LangGraph supports this directly with `interrupt_before` and `interrupt_after` on node names:

```python
app = graph.compile(checkpointer=checkpointer, interrupt_before=["send_email"])
```

Now the graph pauses before `send_email` runs. You inspect state, let a human decide, update state if needed, and resume.

Checkpointing is unglamorous infrastructure. It is also the single feature that separates agents that demo well from agents that run in production. Build it in on day one.
