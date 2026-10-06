import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Book from "./pages/Book";
import Chapter from "./pages/Chapter";
import Writings from "./pages/Writings";
import Writing from "./pages/Writing";
import Projects from "./pages/Projects";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="shell">
      <Nav />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:bookSlug" element={<Book />} />
          <Route path="/books/:bookSlug/:chapterSlug" element={<Chapter />} />
          <Route path="/writings" element={<Writings />} />
          <Route path="/writings/:slug" element={<Writing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
