# geeta-portfolio

Personal portfolio for **Geeta Sharma** — Generative AI Engineer.

Written in Markdown, rendered with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/), and deployed to GitHub Pages automatically on every push to `main` via GitHub Actions.

**Live site:** https://geeta2790.github.io/geeta-portfolio/

## Structure

```
.
├── docs/
│   ├── index.md              # Home / about
│   ├── resume.md             # Resume
│   ├── projects/             # Project case studies
│   │   ├── index.md
│   │   ├── cloud-provisioning-assistant.md
│   │   └── hr-ai-assistant.md
│   ├── writings/             # Blog-style posts
│   │   ├── index.md
│   │   └── building-production-rag.md
│   └── stylesheets/
│       └── extra.css
├── mkdocs.yml                # Site config, theme, navigation
├── requirements.txt          # mkdocs-material + extensions
└── .github/workflows/
    └── deploy.yml            # Build + deploy to GitHub Pages
```

## Adding content

Everything is Markdown. To add a new post or project:

1. Drop a `.md` file into `docs/writings/` or `docs/projects/`.
2. Add it to the `nav:` section of `mkdocs.yml`.
3. Commit and push to `main` — the Action builds and deploys automatically.

Supports GitHub-flavored markdown, admonitions, code highlighting, tables, task lists, Mermaid diagrams, and emoji.

## Running locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Open http://127.0.0.1:8000 — changes auto-reload.

## Deploying

Enable GitHub Pages in repo **Settings → Pages → Source: GitHub Actions**. After that, every push to `main` deploys automatically. Check the Actions tab for build status.

## First push

```bash
git init
git add .
git commit -m "Initial portfolio scaffold"
git branch -M main
git remote add origin https://github.com/geeta2790/geeta-portfolio.git
git push -u origin main
```

Then enable Pages as above.
