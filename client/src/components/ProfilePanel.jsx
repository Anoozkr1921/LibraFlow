export default function ProfilePanel({ user, onClose, onLogout }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="profile-panel" role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <button className="modal-close" type="button" onClick={onClose} aria-label="Close profile">×</button>
      <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'G'}</div>
      <span className="eyebrow">Library member</span>
      <h2 id="profile-title">{user?.name || 'Guest reader'}</h2>
      <p>{user?.email || 'Sign in to view your member profile.'}</p>
      {user && <button className="profile-logout" type="button" onClick={onLogout}><span aria-hidden="true">↗</span>Log out</button>}
    </section>
  </div>
}