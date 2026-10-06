---
title: Building production RAG - lessons so far
description: A running list of things that actually matter when taking RAG pipelines from notebook to production.
date: 2026-10-04
---

# Building production RAG - lessons so far

_Draft - I'll keep expanding this as I ship more._

A notebook RAG demo takes an afternoon. A production RAG system that HR, finance, or ops actually trusts takes a lot longer. Here's what I've learned from shipping a couple of them.

## 1. Routing beats one giant prompt

The temptation is to build one RAG chain and feed everything through it. In practice, the questions users ask fall into distinct intents, and each intent wants different retrieval, different grounding, and different output shapes. Classify the intent first, then pick the pipeline.

## 2. Cite sources, always

Users forgive wrong answers more easily than they forgive opaque ones. If every response shows "this came from policy doc X, chunk Y," reviewers can audit, correct, and trust. If it's a confident paragraph with no citations, nobody trusts it even when it's right.

## 3. Deterministic validation at the edges

Let the LLM elicit intent and generate language. Let plain Python enforce invariants - required fields, numeric ranges, cross-field dependencies, allowed enum values. LLMs are bad at being strict; they're great at being conversational.

## 4. Checkpoint the conversation, not just the message

If your agent is multi-turn or multi-step, checkpoint its state (LangGraph's checkpointing or your own PostgreSQL-backed equivalent). Users leave and come back. Processes restart. Networks blip. State that only lives in memory is state you'll lose.

## 5. Fallback and escalation are features

Design the "I don't know" path on day one. A graph that routes low-confidence or out-of-scope queries to a human - with the conversation attached - is dramatically more useful than a graph that always answers.

## 6. Build an evaluation harness early

Golden fixtures, intent-level eval sets, retrieval precision/recall against known questions - all of this feels like overhead until the day you swap models or re-chunk your corpus and need to know what broke. Build it before you need it.

---

_More to come._
