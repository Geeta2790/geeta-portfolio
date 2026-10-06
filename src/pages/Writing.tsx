import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getWriting } from "../lib/content";
import Markdown from "../components/Markdown";
import NotFound from "./NotFound";

export default function Writing() {
  const { slug } = useParams();
  const w = getWriting(slug ?? "");

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!w) return <NotFound />;
  return (
    <>
      <section className="hero">
        <div className="meta" style={{ fontFamily: "var(--mono)", color: "var(--fg-subtle)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          <Link to="/writings" style={{ color: "var(--fg-subtle)" }}>writings</Link> /
        </div>
        <h1>{w.frontmatter.title ?? w.slug}</h1>
        {w.frontmatter.date && <p className="meta">{w.frontmatter.date}</p>}
      </section>
      <Markdown>{w.body}</Markdown>
    </>
  );
}
