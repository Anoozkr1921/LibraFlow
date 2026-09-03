import { useEffect, useState } from 'react'
import { borrowApi } from '../services/api'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

const formatDate = (date) => date ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date)) : '—'
export default function Loans({ refreshKey }) {
  const [loans, setLoans] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const load = () => { borrowApi.mine().then(setLoans).catch((err) => setError(err.response?.data?.message || err.userMessage || 'Unable to load your loans.')).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [refreshKey])
  const returnBook = async (id) => { await borrowApi.return(id); load() }
  return <><PageHeader eyebrow="Your reading record" title="My loans"><span className="result-count">{loans.length} records</span></PageHeader>{error && <div className="error-banner">{error}</div>}{loading ? <div className="loading-state">Loading your reading record…</div> : loans.length ? <div className="loan-list">{loans.map((loan) => <article className="loan-row" key={loan._id}><div className="loan-icon">▥</div><div className="loan-title"><strong>{loan.book?.title || 'Book unavailable'}</strong><span>{loan.book?.author || 'Unknown author'}</span></div><div className="loan-date"><small>Borrowed</small><span>{formatDate(loan.borrowDate)}</span></div><div className="loan-date"><small>Due date</small><span className={loan.status === 'overdue' || loan.lateDays > 0 ? 'overdue' : ''}>{formatDate(loan.dueDate)}</span></div><span className={`status-pill ${loan.status}`}>{loan.status}</span>{loan.status === 'borrowed' && <button className="outline-button" onClick={() => returnBook(loan._id)}>Return</button>}</article>)}</div> : <EmptyState title="Your shelf is clear" message="Borrow a title from the catalog and it will appear here." />}</>
}
