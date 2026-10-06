---
title: Tokens and embeddings
description: How text becomes numbers the model can work with.
order: 2
---

Models do not read text. They read vectors of floating-point numbers. Converting text into those vectors is a two-step process: tokenization, then embedding.

## Tokenization

A tokenizer splits text into units called tokens. A token is roughly a word or part of a word, but the exact split is learned from a training corpus. Common schemes:

- **Byte-pair encoding (BPE)** - used by GPT models. Starts with individual characters and iteratively merges the most frequent pairs. Common words become single tokens; rare words get split into pieces.
- **WordPiece** - used by BERT. Similar idea with a different merging criterion.
- **SentencePiece** - treats input as a raw byte stream, so it works on any language or script without preprocessing.

Each token has an integer ID in a vocabulary of typically 32k to 200k entries. "The quick brown fox" might become `[464, 2068, 7586, 21831]`. The exact IDs do not matter; what matters is that the same string always maps to the same sequence of IDs.

### Why not just words

Pure word-level tokenization has a vocabulary explosion problem: every rare word, misspelling, and proper noun needs its own slot. Pure character-level tokenization keeps the vocabulary tiny but makes sequences very long. Subword tokenizers like BPE are a compromise: common words stay as single tokens, rare words get split, and nothing is out of vocabulary.

## Embeddings

Each token ID maps to a vector in a learned embedding table. The table has one row per vocabulary entry, and each row is a vector of some dimension - commonly 768, 1024, or 4096 depending on model size.

The embedding is just a lookup: token ID 464 goes in, a specific 1024-dimensional vector comes out. These vectors are learned during pretraining. Tokens with related meanings end up with similar vectors, which is why you can do the famous "king - man + woman = queen" trick on word embeddings. The analogy is a side effect of the learning process, not a goal.

## What the model sees

After tokenization and embedding, your input "The quick brown fox" is a matrix of shape `[sequence_length, embedding_dim]` - for example, `[4, 1024]`. Four tokens, each represented by a 1024-dimensional vector. Everything the model does from here operates on this matrix.

## Why this matters in practice

- **Context windows are measured in tokens, not words.** 8k tokens is roughly 6k English words. Code and non-English text use more tokens per unit of meaning.
- **Token costs are real.** API pricing is per-token. Shortening a prompt from 500 tokens to 300 is a 40 percent cost reduction.
- **Tokenizers differ.** The same text produces different token counts in GPT-4, Claude, and Llama. If you are optimizing prompt length, test with the specific model you deploy.
