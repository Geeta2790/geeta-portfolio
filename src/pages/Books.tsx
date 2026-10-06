import { Link } from "react-router-dom";
import { getBooks } from "../lib/content";

export default function Books() {
  const books = getBooks();
  return (
    <>
      <section className="hero">
        <h1>Books</h1>
        <p className="tagline">Long-form notes on things I'm working to understand well.</p>
      </section>
      {books.map((b) => (
        <Link key={b.slug} to={`/books/${b.slug}`} className="book-card">
          <h3>{b.frontmatter.title ?? b.slug}</h3>
          <p>{b.frontmatter.description ?? ""}</p>
          <p className="meta" style={{ marginTop: "0.5rem", fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--fg-subtle)" }}>
            {b.chapters.length} chapter{b.chapters.length === 1 ? "" : "s"}
          </p>
        </Link>
      ))}
    </>
  );
}
