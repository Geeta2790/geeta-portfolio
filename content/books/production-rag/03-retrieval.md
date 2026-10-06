---
title: Retrieval - embeddings, hybrid, and reranking
description: The three layers of a retrieval pipeline and when each one earns its complexity.
order: 3
---

Retrieval is a layered problem. Each layer trades complexity for precision. Add them in order; stop when quality is good enough.

## Layer 1: dense retrieval with embeddings

The default. Embed every chunk at index time, embed the query at retrieval time, return the top-k by cosine similarity. Fast, cheap, and often enough.

### Choosing an embedding model

The choice matters more than people assume:

- **OpenAI text-embedding-3-small / -large** - solid defaults, cheap, good multilingual.
- **BGE / E5 / Cohere embed-v3** - open-weights options competitive with OpenAI, especially after fine-tuning on your domain.
- **Instructor / INSTRUCTOR-XL** - lets you prompt the embedding model with intent ("retrieve passages that answer this question"). Underrated.

Benchmark on your corpus, not on MTEB. Public benchmarks measure average performance; what matters is performance on your specific document distribution and query patterns.

### Vector databases

For small corpora (under 1M chunks): a flat index in FAISS, Chroma, or even NumPy is fine. For larger: Pinecone, Qdrant, Weaviate, pgvector. The database matters less than the embeddings and the metadata filtering support. Pick based on operational fit - do you want a managed service, a Postgres extension you already run, or a specialized vector store?

## Layer 2: hybrid retrieval

Dense embeddings are great at semantic similarity and bad at exact matches. Ask about "SKU 4472-B" and the embedding model has no idea what that is - it was never a common token. BM25 (classical keyword search) handles this trivially.

Hybrid retrieval runs both:

- Dense search returns the top-N semantically similar chunks.
- BM25 returns the top-N lexically matching chunks.
- Merge the two lists with reciprocal rank fusion (RRF) or weighted scoring.

In my experience, hybrid retrieval is the single biggest quality upgrade over pure dense search for most corpora. It costs almost nothing to implement if your vector store supports it (most do now).

## Layer 3: reranking

The retriever returns 20 candidates. A reranker scores each one more carefully using a cross-encoder - a model that looks at the query and the candidate chunk together and outputs a relevance score.

Rerankers are slower per candidate than embeddings but orders of magnitude more accurate. The pattern is: retrieve 50-100 candidates with embeddings or hybrid, rerank to the top 5-10, pass those to the generator.

Common choices: Cohere Rerank, BGE reranker, Jina reranker. For high-stakes applications a tuned cross-encoder on your domain beats off-the-shelf options.

## When each layer is worth it

- Just dense retrieval: fine for most prototypes and many simple production use cases.
- Add hybrid: when queries sometimes contain identifiers, codes, or exact phrases that semantic search misses.
- Add reranking: when the top-k precision needs to be high because the generator cannot sift through noise - typically small context budgets or sensitive domains.

Add layers one at a time, measure, and keep what helps. Reranking adds latency and cost. Hybrid adds complexity. Both are worth it when they are worth it, and not before.
