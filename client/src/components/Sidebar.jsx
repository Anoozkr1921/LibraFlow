import { Icon } from './Icons'
import { icons } from './iconData'

const navItems = [
  ['overview', icons.grid, 'Overview'],
  ['catalog', icons.books, 'Book catalog'],
  ['loans', icons.loans, 'My loans'],
  ['assistant', icons.assistant, 'Library assistant'],
]

export default function Sidebar({ active, onNavigate, user, onLogout }) {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark">L</span><span>Libra<span>Flow</span></span></div>
    <div className="workspace-label">Library workspace</div>
    <nav>
      {navItems.map(([id, icon, label]) => <button className={active === id ? 'nav-item active' : 'nav-item'} key={id} onClick={() => onNavigate(id)}><Icon>{icon}</Icon>{label}{id === 'assistant' && <span className="new-dot" />}</button>)}
      {user?.role === 'admin' && <button className={active === 'admin' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('admin')}><Icon>{icons.users}</Icon>Admin desk</button>}
    </nav>
    <div className="sidebar-foot">
      <button className="nav-item"><Icon>{icons.settings}</Icon>Preferences</button>
      <div className="user-mini"><div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || 'G'}</div><div><strong>{user?.name || 'Guest reader'}</strong><small>{user?.role === 'admin' ? 'Administrator' : 'Member'}</small></div><button className="logout" onClick={onLogout} title="Log out">↗</button></div>
    </div>
  </aside>
}
