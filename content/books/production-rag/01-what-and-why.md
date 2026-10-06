---
title: What RAG is and when to use it
description: The architecture in one page, and the cases where it beats the alternatives.
order: 1
---

Retrieval-augmented generation is a pattern, not a framework. The architecture is three steps:

1. **Index** your documents offline. Split them into chunks, compute embeddings, store in a vector database.
2. **Retrieve** at query time. Embed the user's question, find the top-k most similar chunks.
3. **Generate** an answer. Build a prompt that includes the retrieved chunks and the question, then let the model respond grounded in that context.

That is the whole thing. Everything else - hybrid search, reranking, query rewriting, multi-hop retrieval - is refinement.

## Why RAG beats the alternatives

Three competing approaches, and when each one wins:

- **Fine-tuning.** Change the model's weights to memorize your data. Expensive, slow to iterate, and the model will still hallucinate because it does not know *which* training example to cite. Fine-tuning is good for teaching style or structure, not for teaching facts.
- **Long-context prompting.** Dump the entire corpus into the prompt. Works for small corpora. Fails as the corpus grows, because context windows have limits and because the model's attention over 100k+ tokens is uneven.
- **Agent with search tools.** Let the model call a search API. More flexible than RAG but much harder to reason about and evaluate. RAG is the simpler, cheaper, better-measured version of this.

RAG wins when:

- The corpus is too large to fit in context, or changes often.
- You need source citations for compliance or trust.
- The information is private - internal docs, HR policies, product specs - that no public model has seen.
- You want to swap models without re-indexing. Changing from GPT-4 to Claude is a prompt change; your embeddings and retrieval do not care.

## Where RAG fails

RAG is retrieval first, generation second. If retrieval returns the wrong chunks, the model cannot recover - it will either hallucinate confidently or correctly report "I don't know" from the wrong context. The quality ceiling of your RAG system is set by retrieval quality.

The hardest failures in production are not "model gave a wrong answer." They are:

- Retriever returns 10 chunks, none of which contain the answer, but one looks close enough that the model fabricates a plausible-sounding wrong response.
- User's question is phrased differently from how the document phrases the information, so semantic search misses.
- Retriever returns the right document but the wrong chunk - the one that mentions the topic without defining it.

The rest of this book is about making retrieval good enough that generation can do its job.
