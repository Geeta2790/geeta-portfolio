---
title: What is a transformer
description: The one-paragraph version, plus why RNNs lost.
order: 1
---

A transformer is a neural network architecture for mapping one sequence to another. Text to text, speech to text, image patches to captions - any task shaped as "sequence in, sequence out" fits. The original 2017 paper (*Attention Is All You Need*, Vaswani et al.) introduced it for machine translation. Within a few years it had absorbed the entire NLP stack and then crossed over to vision, audio, and biology.

## The problem it solved

Before transformers, sequence modeling meant RNNs and LSTMs. These networks read tokens one at a time, maintaining a hidden state that was supposed to carry context forward. Three things made them painful at scale:

1. **Sequential by construction.** You cannot process token 50 until you have processed tokens 1 through 49. That means no parallelism within a sequence, and training on long documents is slow.
2. **Memory is lossy.** The hidden state is a fixed-size vector. By the time you reach token 500, the influence of token 1 has been compressed, re-compressed, and partially overwritten. Long-range dependencies suffer.
3. **Hard to scale.** More layers or wider states help a little, but RNNs do not benefit from scale the way we now expect models to.

## What transformers do differently

Three choices make the architecture work:

- **Attention over the whole sequence at once.** Every token can look at every other token directly, with no intermediate hidden state. There is no "forgetting" earlier context because there is no bottleneck through which it had to pass.
- **Parallelism.** Because tokens are processed together, you can use GPU parallelism effectively. Training time becomes a function of hardware, not sequence length.
- **Positional encoding instead of recurrence.** Transformers do not have a built-in notion of order. Position information is injected separately as a signal added to each token's representation.

## The mental picture

Think of a transformer layer as a room full of tokens. Each token has a vector representing its current meaning. At each layer, every token looks at every other token, decides which ones matter for its purpose, pulls in information from them, and updates its own vector. Stack 12, 24, 96 layers of this, and you get representations rich enough to generate coherent text, answer questions, and translate between languages.

The next chapters zoom into the pieces that make this work: tokenization and embeddings, self-attention, positional encoding, and the full encoder-decoder structure.
