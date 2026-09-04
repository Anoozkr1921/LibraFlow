export default function VerificationNotice({ onClose }) {
  return <aside className="verification-notice" role="status" aria-live="polite">
    <div className="verification-icon" aria-hidden="true">✓</div>
    <div>
      <span className="eyebrow">All set</span>
      <h2>Email verified</h2>
      <p>Your LibraFlow account is ready. Sign in to start borrowing books.</p>
    </div>
    <button className="verification-close" type="button" onClick={onClose} aria-label="Dismiss verification message">×</button>
  </aside>
}