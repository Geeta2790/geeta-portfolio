export default function About() {
  return (
    <>
      <section className="hero">
        <h1>About</h1>
        <p className="tagline">generative ai engineer. based in gurgaon.</p>
      </section>

      <p>
        I work on production backends for Generative AI and Agentic AI
        applications. Day-to-day that means Python, FastAPI, LangGraph,
        LangChain, PostgreSQL, Redis, vector stores, and a lot of plumbing to
        make LLM-driven systems behave predictably.
      </p>

      <p>
        Topics I spend most of my time on: RAG pipelines (chunking, embeddings,
        retrieval, evaluation), multi-step agents with LangGraph (state, tools,
        human-in-the-loop, checkpointing), and the ops-y parts of running
        LLM services in production.
      </p>

      <h2>Elsewhere</h2>
      <ul>
        <li><a href="https://github.com/geeta2790">GitHub</a></li>
        <li><a href="mailto:geeta.hr27@gmail.com">Email</a></li>
      </ul>

      <h2>Colophon</h2>
      <p>
        This site is built with React, TypeScript, and Vite. Content lives as
        plain markdown in the <a href="https://github.com/geeta2790/geeta-portfolio">GitHub repository</a>,
        rendered client-side with react-markdown, and deployed to GitHub Pages
        via GitHub Actions. The design is intentionally minimal - dark background,
        narrow column, generous whitespace. Fonts: Inter for body, JetBrains Mono for code.
      </p>
    </>
  );
}
