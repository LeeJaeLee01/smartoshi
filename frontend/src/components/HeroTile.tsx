import "./HeroTile.css";

export function HeroTile() {
  return (
    <section className="hero-tile">
      <div className="container hero-tile__content">
        <p className="hero-tile__eyebrow">Rust Backend · Assignment Demo</p>
        <h1 className="hero-tile__headline">Smartoshi Mini Exchange</h1>
        <p className="hero-tile__tagline">
          Portfolio and market APIs with AI-assisted workflow documentation.
        </p>
        <div className="hero-tile__actions">
          <a href="#backend" className="btn-primary">
            Explore API
          </a>
          <a href="#assignment" className="btn-secondary">
            How it was built
          </a>
        </div>
        <div className="hero-tile__visual" aria-hidden>
          <div className="hero-tile__mock-card">
            <span>GET /symbols</span>
            <span>POST /orders</span>
            <span>GET /portfolio/u1</span>
          </div>
        </div>
      </div>
    </section>
  );
}
