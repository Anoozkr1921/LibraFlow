export default function SiteFooter({ onNavigate }) {
  return <footer className="site-footer">
    <div className="footer-brand">
      <strong>Libra<span>Flow</span></strong>
      <p>A considered place for curious minds.</p>
    </div>
    <nav className="footer-links" aria-label="Footer navigation">
      <button type="button" onClick={() => onNavigate('overview')}>Home</button>
      <button type="button" onClick={() => onNavigate('catalog')}>Catalog</button>
      <button type="button" onClick={() => onNavigate('loans')}>My dues</button>
    </nav>
    <div className="footer-contact">
      <a href="https://github.com/Anoozkr1921" target="_blank" rel="noreferrer">GitHub</a>
      <a href="mailto:anoozburwal1921@gmail.com">anoozburwal1921@gmail.com</a>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} LibraFlow</span>
      <span>Built for better library management</span>
    </div>
  </footer>
}