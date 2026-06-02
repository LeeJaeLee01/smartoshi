import "./GlobalNav.css";

const links = [
  { href: "#backend", label: "Backend" },
  { href: "#assignment", label: "Assignment" },
  { href: "#skills", label: "Skills" },
  { href: "#ai-usage", label: "AI Usage" },
];

export function GlobalNav() {
  return (
    <nav className="global-nav" aria-label="Main">
      <div className="global-nav__inner container">
        <span className="global-nav__brand">Smartoshi</span>
        <div className="global-nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="global-nav__link">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
