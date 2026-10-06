import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="center-text">
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <p style={{ marginTop: "1rem" }}><Link to="/">Back home</Link></p>
    </div>
  );
}
