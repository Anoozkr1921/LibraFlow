import { Icon } from './Icons'

export default function StatCard({ label, value, detail, icon, tone = '', onClick }) {
  const content = <><div className="stat-top"><span>{label}</span><Icon>{icon}</Icon></div><strong>{value ?? '—'}</strong><small>{detail}</small></>
  if (onClick) return <button type="button" className={`stat-card ${tone} stat-card-clickable`} onClick={onClick}>{content}</button>
  return <article className={`stat-card ${tone}`}>{content}</article>
}
