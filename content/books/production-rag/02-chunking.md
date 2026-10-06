---
title: Chunking is the whole game
description: How you split your documents decides how well retrieval works. Here's what to actually do.
order: 2
---

If your retrieval is bad, your chunking is almost always the reason. The embedding model gets most of the credit when things work and most of the blame when they do not, but the chunker is upstream of everything.

## The core tradeoff

- **Small chunks** (100-200 tokens) retrieve precisely. A single question about leave encashment pulls the one paragraph that defines it. But small chunks lack surrounding context - the model may get the definition without the exception.
- **Large chunks** (800-1500 tokens) carry context. The model sees not just the definition but how it relates to adjacent policies. But retrieval becomes blurrier: a chunk about "leaves" also talks about holidays, encashment, and sick days, and it looks relevant to all of them.

There is no universally correct answer. There is only "correct for your corpus and query distribution."

## Three chunking strategies, in order of complexity

### 1. Fixed-size with overlap

Split every document into N-token windows with M-token overlap. Simple, deterministic, works surprisingly well. Reasonable defaults: 512-token chunks, 50-token overlap. Overlap matters because the token at position 511 and the token at position 513 often need to stay together to be meaningful.

Use this first. If it works, do not get fancy.

### 2. Structural

Split on document structure: headings, sections, paragraphs. Each chunk is a logical unit the author already defined. Works well for well-formatted docs (markdown, HTML, structured PDFs). Fails on unstructured text where structure is implicit.

### 3. Semantic

Split where the topic shifts. Use embeddings to detect sentences that are semantically distant from their neighbors, and cut there. More expensive and harder to reason about, but produces chunks that match the natural "ideas" in a document.

Semantic chunking is the most impressive in demos and the least worth it in production, in my experience. Spend your effort on hybrid retrieval and evaluation first.

## What to put in each chunk

Beyond the text itself:

- **Metadata** - source document, section, URL, author, date. Not for retrieval scoring, but for the model to cite and for post-filtering ("only chunks from the last 6 months").
- **A prefixed header** - "From: Policy Doc v3 / Section 4.2 - Leave Encashment\\n\\n{chunk text}". This helps both retrieval (header words are searchable) and the model's response.
- **A deterministic chunk ID** - hash of source + offset. Needed for stable citations, update detection, and cache invalidation.

## Chunking gotchas

- **Tables and lists get mangled.** A table that spans a chunk boundary becomes two half-tables, neither useful. Detect structured content and keep it in one chunk even if it exceeds your target size.
- **Code blocks need special handling.** Splitting a code block in the middle of a function makes both halves useless.
- **PDFs lie.** Text extraction order is not reading order. Two-column layouts, footnotes, and tables all require layout-aware parsing (pdfplumber, unstructured, pymupdf) rather than naive text extraction.
- **Headers repeat.** If the same section header appears in every chunk of a document, it dominates the embedding and hurts retrieval. Deduplicate or weight it down.

Get chunking right and everything downstream gets easier. Get it wrong and no amount of reranking will save you.
