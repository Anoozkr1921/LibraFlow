import { Icon } from './Icons'

export default function StatCard({ label, value, detail, icon, tone = '' }) {
  return <article className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><Icon>{icon}</Icon></div><strong>{value ?? '—'}</strong><small>{detail}</small></article>
}
