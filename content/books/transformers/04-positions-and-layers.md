---
title: Positions and the full layer
description: Positional encoding, feed-forward blocks, residuals, and layer norm.
order: 4
---

Self-attention has no sense of order. If you shuffle the tokens, the attention output is identical. To let the model know that "dog bites man" and "man bites dog" differ, we add position information explicitly.

## Positional encoding

Two common approaches:

- **Sinusoidal (original paper).** Each position gets a vector of sines and cosines at different frequencies, added to the token embedding. Deterministic, no learned parameters, generalizes to longer sequences at inference.
- **Learned.** Each position index gets its own trainable vector in a lookup table, same as token embeddings. Simpler, but does not extrapolate beyond the max sequence seen during training.

Modern models use variants like **RoPE** (rotary position embedding) and **ALiBi** (attention linear biases), which inject position into the Q/K computation itself rather than at the embedding layer. These work better for long context and allow extrapolation.

Whatever the method, the result is the same: each token now carries both "what word am I" and "where in the sequence am I" information before entering the first attention layer.

## The full layer

A transformer layer is:

1. **Multi-head self-attention** - the core computation from the previous chapter.
2. **Add and norm** - add the input back to the attention output (residual connection), then layer-normalize.
3. **Feed-forward network** - a two-layer MLP applied independently to each position. Typically 4x the embedding dimension in the hidden layer, with a nonlinearity like GELU.
4. **Add and norm** again.

That is one layer. GPT-3 has 96. Llama-70B has 80. Each layer refines the token representations; by the final layer, each token's vector encodes enough context to predict the next token or classify the sequence or generate the translation.

## Why residuals matter

Deep networks are hard to train. Gradients vanish, representations collapse, learning stalls. Residual connections - adding the layer's input to its output - keep information flowing cleanly from early layers to late ones and gradients flowing cleanly from the loss back to the input. Without residuals you cannot stack 100 layers; with them, the architecture scales to arbitrary depth.

## Encoder vs decoder vs decoder-only

The original transformer had an encoder (reads the input, no causal mask) and a decoder (generates the output, with causal mask and cross-attention over the encoder). Three dominant styles today:

- **Encoder-only** (BERT, RoBERTa) - good for classification, embeddings, retrieval.
- **Decoder-only** (GPT, Llama, Claude, Gemini) - good for generation. The dominant style for general-purpose LLMs.
- **Encoder-decoder** (T5, BART, Whisper) - good for translation-like tasks where input and output are distinct sequences.

The reason decoder-only won the LLM race is simple: it is the simplest architecture that scales well and handles any sequence task if you phrase it as "predict the next token."

## What comes next

With tokens, embeddings, attention, positions, and layers in place, you have the full transformer. The rest of modern LLM work is scale (more parameters, more data, more compute), training (pretraining, instruction tuning, RLHF, DPO), and inference optimization (quantization, KV caching, speculative decoding). The architecture itself has barely changed in seven years.
