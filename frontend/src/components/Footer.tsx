import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>
          Smartoshi assignment — Rust backend + React TypeScript showcase.
          Design tokens from <code>frontend/DESIGN.md</code> (Apple-inspired).
        </p>
        <p className="site-footer__fine">
          Backend: in-memory store · Market orders only · See AI_USAGE.md for AI
          workflow details.
        </p>
      </div>
    </footer>
  );
}
