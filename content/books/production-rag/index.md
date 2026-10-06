---
title: Production RAG
description: A field guide to retrieval-augmented generation that actually works outside a notebook.
tagline: Chunking, retrieval, grounding, and evaluation.
order: 2
---

Retrieval-augmented generation is the simplest way to give a language model knowledge it was not trained on: at query time, retrieve relevant documents from a corpus and let the model answer from those passages. A notebook demo takes an afternoon. A production system that users actually trust takes a lot longer.

This book is the second kind. It covers the choices that matter in practice - what to chunk and how, which retriever to use, how to ground responses in sources, and how to measure whether your pipeline is getting better or worse as you change it.

The examples are deliberately generic. Nothing here is specific to a particular company's documents or domain. The techniques apply whether you are building a policy assistant, a documentation search, a customer-support bot, or anything else where the model needs to answer from a controlled corpus.
