import { Link, useParams } from "react-router-dom";
import { getBook } from "../lib/content";
import Markdown from "../components/Markdown";
import NotFound from "./NotFound";

export default function Book() {
  const { bookSlug } = useParams();
  const book = getBook(bookSlug ?? "");
  if (!book) return <NotFound />;

  return (
    <>
      <section className="hero">
        <div className="meta" style={{ fontFamily: "var(--mono)", color: "var(--fg-subtle)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          <Link to="/books" style={{ color: "var(--fg-subtle)" }}>books</Link> /
        </div>
        <h1>{book.frontmatter.title ?? book.slug}</h1>
        {book.frontmatter.tagline && <p className="tagline">{book.frontmatter.tagline}</p>}
      </section>

      {book.body && <Markdown>{book.body}</Markdown>}

      <section className="section">
        <div className="section-header">
          <h2>Chapters</h2>
        </div>
        {book.chapters.map((c, i) => (
          <article key={c.slug} className="entry">
            <h3>
              <Link to={`/books/${book.slug}/${c.slug}`}>
                <span style={{ color: "var(--fg-subtle)", marginRight: "0.5rem", fontFamily: "var(--mono)", fontSize: "0.9em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.frontmatter.title ?? c.slug}
              </Link>
            </h3>
            {c.frontmatter.description && <p>{c.frontmatter.description}</p>}
          </article>
        ))}
      </section>
    </>
  );
}
