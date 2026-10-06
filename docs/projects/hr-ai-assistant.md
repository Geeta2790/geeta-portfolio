---
title: Enterprise HR AI Assistant
description: FastAPI + LangGraph assistant answering employee HR questions over policies via RAG, with routing to policy, leave, email, and document flows.
---

# Enterprise HR AI Assistant

**Role:** Generative AI Engineer, Dataclaps.in
**Stack:** Python · FastAPI · LangGraph · LangChain · ChromaDB · PostgreSQL · OpenAI · Docker

## The problem

HR teams get the same questions over and over - leave policy, holiday calendar, reimbursement rules, how to draft a resignation email. The answers live in long PDFs and scattered FAQs, and employees usually ask HR instead of reading them. The goal: give employees a fast, source-grounded assistant that handles the common cases and escalates cleanly when it can't.

## What I built

A FastAPI service backed by a LangGraph workflow that routes incoming questions to one of several specialised flows:

- **Policy Q&A** - RAG over HR policy documents, with source citations.
- **Leave assistance** - answers leave-balance and leave-type questions against policy + enterprise APIs.
- **Email generation** - drafts resignation, leave, and other common HR emails with structured outputs.
- **Document-based support** - retrieves from internal docs the employee has access to.
- **Escalation** - when confidence is low or the query is out of scope, hand off cleanly to an HR rep.

## Interesting bits

### Routing before retrieval

The LangGraph router classifies the question first, then picks the right retrieval + prompt pipeline. This avoided the "one giant RAG prompt" trap - email drafting and policy Q&A have very different grounding needs.

### Source-grounded responses

Every policy answer cites the chunk and document it came from, with the retrieved snippet visible in the response. This made HR comfortable approving the system - they can audit any answer.

### Structured outputs for emails

Email generation uses Pydantic schemas (subject, body, tone, recipient role) so downstream systems can post-process or template them without parsing freeform text.

### Fallback and escalation

If retrieval confidence is low or the LLM returns a low-signal response, the graph routes to an escalation node that packages the conversation and hands it to HR instead of guessing.

### Operational plumbing

- PostgreSQL for conversation state and audit logs.
- ChromaDB for policy embeddings; re-indexed via a scheduled job on policy updates.
- Docker-based deployment with health checks, structured logs, and automated tests covering each router branch.

## What I'd do differently

- Add a public evaluation set with golden answers per intent, so model/retrieval changes are measurable.
- Experiment with hybrid retrieval (BM25 + embeddings) for policy docs - a lot of HR questions are keyword-heavy.
