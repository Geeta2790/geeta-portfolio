import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getChapter } from "../lib/content";
import Markdown from "../components/Markdown";
import NotFound from "./NotFound";

export default function Chapter() {
  const { bookSlug, chapterSlug } = useParams();
  const result = getChapter(bookSlug ?? "", chapterSlug ?? "");

  useEffect(() => { window.scrollTo(0, 0); }, [bookSlug, chapterSlug]);

  if (!result) return <NotFound />;
  const { book, chapter, prev, next } = result;

  return (
    <>
      <section className="hero">
        <div className="meta" style={{ fontFamily: "var(--mono)", color: "var(--fg-subtle)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          <Link to="/books" style={{ color: "var(--fg-subtle)" }}>books</Link> /{" "}
          <Link to={`/books/${book.slug}`} style={{ color: "var(--fg-muted)" }}>{book.frontmatter.title ?? book.slug}</Link> /
        </div>
        <h1>{chapter.frontmatter.title ?? chapter.slug}</h1>
      </section>

      <Markdown>{chapter.body}</Markdown>

      <nav className="chapter-nav">
        {prev ? (
          <Link to={`/books/${book.slug}/${prev.slug}`} className="prev">
            <span className="direction">&larr; Previous</span>
            {prev.frontmatter.title ?? prev.slug}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/books/${book.slug}/${next.slug}`} className="next">
            <span className="direction">Next &rarr;</span>
            {next.frontmatter.title ?? next.slug}
          </Link>
        ) : <span />}
      </nav>
    </>
  );
}
