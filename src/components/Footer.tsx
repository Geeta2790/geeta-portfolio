export default function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Geeta Sharma &middot;{" "}
        <a href="https://github.com/geeta2790/geeta-portfolio">Source</a> &middot;{" "}
        Built with React, hosted on GitHub Pages
      </p>
    </footer>
  );
}
