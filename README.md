# geeta-portfolio

Personal site for **Geeta Sharma** - Generative AI engineer.

Live at [https://geetasharma.me](https://geetasharma.me).

Written in Markdown, rendered with React + Vite, deployed to GitHub Pages via GitHub Actions on every push to `main`.

## Structure

```
content/
  books/
    <book-slug>/
      index.md              # book intro and metadata
      01-<slug>.md          # chapter 1 (order via frontmatter)
      02-<slug>.md
      ...
  writings/
    <slug>.md               # shorter posts
src/
  components/               # Nav, Footer, Markdown renderer
  pages/                    # Home, Books, Book, Chapter, Writings, Writing, Projects, About, NotFound
  lib/content.ts            # markdown loading via import.meta.glob
  styles/globals.css        # dark theme
public/
  CNAME                     # custom domain
  404.html                  # SPA fallback
.github/workflows/
  deploy.yml                # build + deploy to GitHub Pages
```

## Adding content

### New writing

1. Create `content/writings/<slug>.md` with frontmatter:
   ```yaml
   ---
   title: My post
   description: One-line summary
   date: 2026-01-15
   ---
   ```
2. Commit and push. It appears automatically.

### New book

1. Create `content/books/<book-slug>/index.md` with `title`, `description`, `tagline`, and `order`.
2. Create chapters as `content/books/<book-slug>/<NN>-<slug>.md` with `order` in frontmatter.
3. Commit and push.

## Running locally

```bash
npm install
npm run dev
```

Opens on http://localhost:5173.

## Deploying

Push to `main`. The Action builds and deploys. See `.github/workflows/deploy.yml`.
