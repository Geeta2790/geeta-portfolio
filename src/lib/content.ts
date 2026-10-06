export interface Frontmatter {
  title?: string;
  description?: string;
  date?: string;
  order?: number;
  tagline?: string;
  draft?: boolean;
}

export interface Doc {
  slug: string;
  path: string;
  frontmatter: Frontmatter;
  body: string;
}

export interface BookChapter extends Doc {
  bookSlug: string;
}

export interface Book {
  slug: string;
  frontmatter: Frontmatter;
  body: string;
  chapters: BookChapter[];
}

const rawFiles = import.meta.glob("/content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const FM_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?/;

function parse(raw: string): { frontmatter: Frontmatter; body: string } {
  const m = raw.match(FM_RE);
  if (!m) return { frontmatter: {}, body: raw };
  const fm: Frontmatter = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1] as keyof Frontmatter;
    let value: string | number | boolean = kv[2].trim().replace(/^["'](.*)["']$/, "$1");
    if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (/^-?\d+$/.test(value as string)) value = parseInt(value as string, 10);
    (fm as Record<string, unknown>)[key] = value;
  }
  return { frontmatter: fm, body: raw.slice(m[0].length) };
}

function slugFromPath(path: string): string {
  const base = path.split("/").pop() ?? "";
  return base.replace(/\.md$/, "");
}

export function getWritings(): Doc[] {
  const writings: Doc[] = [];
  for (const [path, raw] of Object.entries(rawFiles)) {
    if (!path.startsWith("/content/writings/")) continue;
    const slug = slugFromPath(path);
    const { frontmatter, body } = parse(raw);
    if (frontmatter.draft) continue;
    writings.push({ slug, path, frontmatter, body });
  }
  return writings.sort((a, b) => (b.frontmatter.date ?? "").localeCompare(a.frontmatter.date ?? ""));
}

export function getWriting(slug: string): Doc | undefined {
  return getWritings().find((w) => w.slug === slug);
}

export function getBooks(): Book[] {
  const booksMap = new Map<string, Book>();

  for (const [path, raw] of Object.entries(rawFiles)) {
    if (!path.startsWith("/content/books/")) continue;
    const parts = path.replace("/content/books/", "").split("/");
    const bookSlug = parts[0];
    const file = parts[parts.length - 1];
    const { frontmatter, body } = parse(raw);

    if (!booksMap.has(bookSlug)) {
      booksMap.set(bookSlug, { slug: bookSlug, frontmatter: {}, body: "", chapters: [] });
    }
    const book = booksMap.get(bookSlug)!;

    if (file === "index.md") {
      book.frontmatter = frontmatter;
      book.body = body;
    } else {
      const chapterSlug = slugFromPath(path);
      book.chapters.push({ slug: chapterSlug, bookSlug, path, frontmatter, body });
    }
  }

  const books = Array.from(booksMap.values());
  for (const b of books) {
    b.chapters.sort((a, b) => {
      const ao = a.frontmatter.order ?? 999;
      const bo = b.frontmatter.order ?? 999;
      if (ao !== bo) return ao - bo;
      return a.slug.localeCompare(b.slug);
    });
  }
  books.sort((a, b) => {
    const ao = a.frontmatter.order ?? 999;
    const bo = b.frontmatter.order ?? 999;
    if (ao !== bo) return ao - bo;
    return a.slug.localeCompare(b.slug);
  });
  return books;
}

export function getBook(slug: string): Book | undefined {
  return getBooks().find((b) => b.slug === slug);
}

export function getChapter(bookSlug: string, chapterSlug: string): {
  book: Book;
  chapter: BookChapter;
  prev?: BookChapter;
  next?: BookChapter;
} | undefined {
  const book = getBook(bookSlug);
  if (!book) return undefined;
  const idx = book.chapters.findIndex((c) => c.slug === chapterSlug);
  if (idx < 0) return undefined;
  return {
    book,
    chapter: book.chapters[idx],
    prev: idx > 0 ? book.chapters[idx - 1] : undefined,
    next: idx < book.chapters.length - 1 ? book.chapters[idx + 1] : undefined,
  };
}
