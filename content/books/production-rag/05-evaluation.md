---
title: Evaluation
description: How to measure a RAG pipeline so you know when a change helps or hurts.
order: 5
---

Everything in a RAG pipeline is tunable: chunk size, overlap, embedding model, k, hybrid weights, reranker, prompt. Without evaluation you cannot tell whether changing any of these makes the system better or just different. Build evaluation before you optimize.

## The two things to measure separately

### Retrieval quality

Do the retrieved chunks contain the information needed to answer the question? Measure this independently of generation.

- **Hit rate at k** - for a labeled question, does the top-k include the correct source chunk?
- **Mean reciprocal rank (MRR)** - at what rank does the correct chunk first appear? MRR = 1 means always first.
- **Recall at k** - of all chunks that could answer the question, how many are in the top-k?

Retrieval metrics need labeled data: question + which chunks are relevant. 100-200 labeled questions covering your query distribution is enough to detect meaningful regressions.

### Generation quality

Given the retrieved context, does the model produce a correct, grounded, well-formed answer?

- **Faithfulness** - every claim in the answer is supported by the context.
- **Answer correctness** - the answer matches a reference answer.
- **Citation accuracy** - the cited sources actually contain the cited claims.

Generation metrics usually need a model-as-judge or human review. Model-as-judge is cheap and surprisingly reliable with the right prompt; use it liberally for iteration and reserve human review for release gates.

## Building the evaluation set

The hardest part is getting labeled data. Three approaches, best used together:

1. **Synthetic questions.** Prompt an LLM to generate questions from your documents - "given this passage, what questions does it answer?" Produces broad coverage cheaply but biased toward what the LLM finds askable.
2. **Real user questions.** Collect queries from logs. The ground truth distribution. The problem: labeling correct answers for all of them is slow.
3. **Hand-written edge cases.** Specific questions you know are hard - acronyms, exact-match identifiers, multi-document synthesis, out-of-scope queries that should be refused.

Combine: synthetic for breadth, real queries for distribution match, hand-written for the specific failures you have seen.

## The regression harness

Once you have an eval set, wrap it in a script that runs the full pipeline on every change and reports metrics. Commit the eval set to the repo. Compare against the previous run on every PR.

```
retrieval:  hit@5 = 0.87 (prev 0.84, +0.03)
generation: faithfulness = 0.92 (prev 0.91, +0.01)
            correctness = 0.78 (prev 0.81, -0.03)  WARN
refusals:   correct_refusal_rate = 0.95 (prev 0.95, 0.00)
```

This turns "changing the prompt helped" into "changing the prompt improved faithfulness by 3 points but regressed correctness by 1." Now you can decide whether to ship it.

## What to evaluate first

If you only build one thing, build retrieval evaluation. Retrieval is the ceiling - the generator cannot answer from context that was not retrieved. Measuring retrieval tells you whether more effort should go into chunking, embedding choice, or hybrid search.

Generation evaluation is next. The common failure once retrieval is good: the model answers correctly on average but is wrong on specific types of questions - numeric values, dates, lists, cross-document synthesis. Evaluation makes that visible.

Everything in RAG is a knob. Evaluation is the dashboard that tells you which way to turn each one.
