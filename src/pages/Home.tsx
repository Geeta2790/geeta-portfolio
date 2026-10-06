import { Link } from "react-router-dom";
import { getBooks, getWritings } from "../lib/content";

export default function Home() {
  const books = getBooks().slice(0, 4);
  const writings = getWritings().slice(0, 4);

  return (
    <>
      <section className="hero">
        <h1>Geeta Sharma</h1>
        <p className="tagline">
          generative ai, agents, and retrieval. learning in public.
        </p>
      </section>

      <p>
        I'm a Generative AI engineer based in Gurgaon. I build production
        backends for Agentic AI and RAG - stateful workflows, tool orchestration,
        structured outputs, and the plumbing that makes agent systems survive
        contact with real users.
      </p>
      <p>
        This site is where I keep notes, long-form books, and project write-ups.
        Everything is open source and lives in{" "}
        <a href="https://github.com/geeta2790/geeta-portfolio">one GitHub repo</a>.
      </p>

      <section className="section">
        <div className="section-header">
          <h2>Books</h2>
          <Link to="/books">All books &rarr;</Link>
        </div>
        {books.map((b) => (
          <Link key={b.slug} to={`/books/${b.slug}`} className="book-card">
            <h3>{b.frontmatter.title ?? b.slug}</h3>
            <p>{b.frontmatter.description ?? ""}</p>
          </Link>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Writings</h2>
          <Link to="/writings">All writings &rarr;</Link>
        </div>
        {writings.map((w) => (
          <article key={w.slug} className="entry">
            <h3><Link to={`/writings/${w.slug}`}>{w.frontmatter.title ?? w.slug}</Link></h3>
            {w.frontmatter.date && <div className="meta">{w.frontmatter.date}</div>}
            <p>{w.frontmatter.description ?? ""}</p>
          </article>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Elsewhere</h2>
        </div>
        <p>
          <a href="https://github.com/geeta2790">GitHub</a> &middot;{" "}
          <a href="mailto:geeta.hr27@gmail.com">Email</a>
        </p>
      </section>
    </>
  );
}
