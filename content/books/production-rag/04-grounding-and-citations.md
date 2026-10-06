---
title: Grounding and citations
description: Getting the model to answer from the retrieved context, and nothing else.
order: 4
---

Retrieval found the right chunks. The model has them. Now you need the model to answer *from* those chunks, cite them, and refuse when they do not contain the answer. This is grounding, and getting it right is a prompt-engineering problem more than a retrieval problem.

## The prompt pattern that works

```
You are a {role}. Answer the user's question using only the context below.
If the context does not contain the answer, say so clearly - do not guess.
Cite the source of each claim as [source: {source_id}].

Context:
---
[1] {chunk 1 text} (source: {chunk_1_source})
[2] {chunk 2 text} (source: {chunk_2_source})
[3] ...
---

Question: {user_question}

Answer:
```

Simple, boring, and effective. Variants exist, but every production RAG prompt I have seen that works is some version of this.

## Why strict grounding matters

Without instructions to stick to the context, modern LLMs will blend retrieved information with their training knowledge. Sometimes that is fine. Often it is a disaster:

- Policy answers that are "mostly right" but include a detail the model made up because it fit the pattern of similar policies in training data.
- Dates and numbers that are wrong because the model substituted a more memorable value from pretraining.
- Confident refusals ("I cannot help with that") on questions the context clearly answers, because the model is being overly cautious.

The fix is in the prompt. Explicitly tell the model that the context is the only source of truth, that it must cite everything, and that it must say "the provided context does not contain an answer to this question" when the context is insufficient.

## Citations as a product feature

The citation format is not just for debugging. End users should see it. When a response says "Leave encashment is calculated as basic salary times unused leave days [source: HR Policy v3, section 4.2]", the user can:

- Verify the claim by clicking through to the source.
- Trust the system more than they would trust an unexplained answer.
- Report errors precisely ("the policy actually says X, not Y").

Design the UI so citations are visible and clickable, not buried in a tooltip.

## Handling multi-document answers

Many questions require combining information from two or three chunks. The grounding pattern handles this if the prompt instructs the model to synthesize across sources and cite each one. Watch for:

- The model picking the first relevant chunk and ignoring equally relevant later ones.
- Citations collapsing to just the first source.
- Over-synthesis - the model inventing connections that are not in the text.

Mitigations: lower the retrieval k so there are fewer options to ignore, explicitly instruct the model to use all relevant sources, and spot-check synthesis quality in evaluation.

## The refusal case

A grounded system that cannot find an answer should say so, not guess. Train the behavior through prompt wording and by including evaluation examples where the correct answer is "the context does not say." Models default toward being helpful; you have to explicitly prefer "I don't know" over confabulation.

A good RAG system refuses correctly about as often as it answers correctly. If your refusal rate is near zero, you are hiding failures.
