import { Link } from "react-router-dom";
import { getWritings } from "../lib/content";

export default function Writings() {
  const writings = getWritings();
  return (
    <>
      <section className="hero">
        <h1>Writings</h1>
        <p className="tagline">Shorter notes. Lessons from building things.</p>
      </section>
      {writings.map((w) => (
        <article key={w.slug} className="entry">
          <h3><Link to={`/writings/${w.slug}`}>{w.frontmatter.title ?? w.slug}</Link></h3>
          {w.frontmatter.date && <div className="meta">{w.frontmatter.date}</div>}
          <p>{w.frontmatter.description ?? ""}</p>
        </article>
      ))}
    </>
  );
}
