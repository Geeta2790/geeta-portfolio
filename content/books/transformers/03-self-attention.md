---
title: Self-attention
description: The core mechanism. Query, key, value, and why it works.
order: 3
---

Self-attention is the engine inside a transformer layer. Every other component - feed-forward blocks, layer norms, residual connections - is scaffolding around it.

## The idea in one sentence

For each token, decide how much to pay attention to every other token in the sequence, then build a new representation of this token as a weighted sum of information from all tokens.

That is it. The rest is implementation.

## Query, key, value

Each token's embedding is projected into three different vectors by three learned weight matrices:

- **Query (Q)** - "what am I looking for?"
- **Key (K)** - "what do I offer?"
- **Value (V)** - "if someone pays attention to me, this is the information I give them"

To decide how much token `i` should attend to token `j`, you take the dot product of `Q_i` and `K_j`. If their directions align (high dot product), token `j` is relevant. You do this for every pair in the sequence, giving you an attention matrix of shape `[seq_len, seq_len]`.

The attention matrix is scaled by `sqrt(d_k)` (to keep gradients stable) and passed through a softmax so each row sums to 1 - these are now proper weights. Then each token's new representation is `attention_weights @ V`: a weighted sum of value vectors from the whole sequence.

In code it is three lines:

```python
scores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)
weights = softmax(scores, dim=-1)
output = weights @ V
```

## Multi-head attention

A single attention operation can only learn one kind of relationship at a time - say, syntactic agreement. In practice we want to track syntax, coreference, semantic similarity, and more, all at once. The fix: run attention in parallel heads.

The embedding is split into chunks, each chunk gets its own Q/K/V projections, each head computes attention independently, and the results are concatenated and projected back to the original dimension. 12 or 16 heads is typical.

Each head specializes during training. Visualization tools like BertViz show heads that track subject-verb agreement, pronoun resolution, sentence boundaries, and other patterns. No one tells them to specialize - it emerges.

## Causal masking

For a language model that generates text left to right, token `i` should only attend to tokens 1 through `i`. We enforce this by masking the attention matrix: before the softmax, set the upper triangle to `-inf`. After softmax those positions become 0, and future tokens contribute nothing to past tokens.

This is why training a GPT-style model is efficient. You can compute predictions for every position in a sequence in parallel, and the causal mask ensures each prediction only sees the correct context.

## Why this scales

The attention matrix is `O(n^2)` in sequence length - that is the famous quadratic cost. But it is `O(n)` with respect to layers. Doubling the model's depth roughly doubles its compute. The architecture scales smoothly with hardware and data, which is why pretraining budgets have grown by orders of magnitude without the architecture changing much.
