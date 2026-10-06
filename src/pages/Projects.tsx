export default function Projects() {
  return (
    <>
      <section className="hero">
        <h1>Projects</h1>
        <p className="tagline">Open-source and side projects.</p>
      </section>

      <article className="entry">
        <h3><a href="https://github.com/geeta2790/geeta-portfolio">geeta-portfolio</a></h3>
        <div className="meta">React &middot; TypeScript &middot; Vite</div>
        <p>This site. Markdown-driven, dark-themed, deployed to GitHub Pages via Actions. Books and writings live as plain markdown in the repo.</p>
      </article>

      <p style={{ color: "var(--fg-muted)", marginTop: "2rem" }}>
        More projects coming as I open-source cleaned-up versions of experiments and demos.
      </p>
    </>
  );
}
