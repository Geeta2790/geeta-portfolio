---
title: Enterprise Cloud Provisioning AI Assistant — AWS & Azure
description: LangGraph-based conversational assistant that collects, validates, and emits Terraform-compatible configs for AWS EC2/RDS and Azure VMs, with human-in-the-loop and PostgreSQL checkpointing.
---

# Enterprise Cloud Provisioning AI Assistant — AWS & Azure

**Role:** Generative AI Engineer, Dataclaps.in
**Stack:** Python · FastAPI · LangGraph · PostgreSQL · Redis · Pydantic · Docker

## The problem

Cloud provisioning for AWS and Azure requires dozens of interdependent fields — regions, availability zones, instance types, OS images, storage sizes, networking choices — and the valid options for one field often depend on earlier choices. Giving operators a form to fill out leads to invalid combinations and support tickets; letting them chat with a vanilla LLM leads to confidently wrong Terraform.

## What I built

A LangGraph-based conversational assistant that:

1. **Asks the right questions dynamically** based on the resource type (EC2, RDS, Azure VM) and the user's earlier answers.
2. **Validates every input deterministically** in Python — required fields, numeric constraints, supported options, cross-field dependencies.
3. **Preserves conversation state** across sessions via PostgreSQL-backed LangGraph checkpointing, so users can leave and resume.
4. **Keeps a human in the loop** at critical decision points instead of blindly provisioning.
5. **Emits Terraform-compatible JSON** by merging user inputs, defaults, Redis-cached enrichment data, and enterprise API responses.

## Interesting bits

### State and conditional routing

The LangGraph state machine routes based on resource type and what's already answered. A single conversation can jump between question nodes, validation nodes, and enrichment nodes without losing context.

### Redis for dependency-driven options

Regions determine available zones; zones determine available instance types; instance types determine available OS images. Rather than re-hitting cloud APIs every turn, option lists are cached in Redis and looked up based on the current state.

### Deterministic validation, not LLM validation

LLMs are great at eliciting intent, bad at enforcing invariants. All field-level validation is pure Python — the LLM asks questions, Python decides what's valid. This split made the system testable and auditable.

### Three endpoints, one conversation

FastAPI exposes `start`, `resume`, and `edit` endpoints that all operate on the same checkpointed conversation state. Editing an earlier answer re-runs the dependent validation and re-asks downstream questions.

## What I'd do differently

- Add an evaluation harness: scripted conversations that assert the final Terraform JSON matches golden fixtures.
- Explore CrewAI-style role separation (asker / validator / enricher) as a comparison point against the current single-graph design.
