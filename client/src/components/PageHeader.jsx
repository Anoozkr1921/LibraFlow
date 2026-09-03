export default function PageHeader({ eyebrow, title, children }) {
  return <header className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{children}</header>
}
