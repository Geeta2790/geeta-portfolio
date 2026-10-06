---
title: Building this site
description: Why I switched to React, how it is structured, and what I would do differently.
date: 2026-10-06
---

This site started as a MkDocs Material build - the kind where you drop markdown files in a folder and let a static site generator do everything. It worked. It looked fine. But fine is not what I wanted.

I rebuilt it as a React + Vite + TypeScript app. Not because the markdown-first approach was wrong, but because I wanted:

- Control over the design. A specific dark palette, specific typography, specific spacing - the kind of fine-grained visual choices that fight against theme systems.
- Books. A real multi-chapter structure with its own index page, chapter navigation, and prev/next. MkDocs can do this; React makes it one component.
- An excuse to build it. I spend most of my working time on backends. A front-end project is useful exercise.

## The structure

Content is still plain markdown, with YAML frontmatter for metadata. Vite's `import.meta.glob` loads every `.md` file in the `content/` tree at build time. The content loader organizes them into books (with chapters) and writings. Pages render them with react-markdown, remark-gfm, and rehype-highlight.

That gives me the best of both approaches: markdown is still the authoring format, so adding content is `touch content/writings/new-post.md`, but the rendering layer is a real React app I can shape however I want.

## The design

Two dark greys and a near-white. No white backgrounds. One accent color (indigo) for links. Inter for body, JetBrains Mono for code. Narrow single-column layout, generous line height, headings that sit calmly in the hierarchy rather than shouting. The goal: nothing between the reader and the words.

## Deployment

GitHub Actions builds the Vite app and pushes `dist` to GitHub Pages on every commit to `main`. Custom domain is `geetasharma.me`, which GitHub Pages serves over HTTPS with an auto-renewing Let's Encrypt cert. Pushing new content is `git commit && git push` and the site updates in about a minute.

## What I would do differently

Nothing yet. I have been running on this stack for less than a day. Check back in a month.
