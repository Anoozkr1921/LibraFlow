import { useEffect, useState } from 'react'
import { borrowApi } from '../services/api'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

const formatDate = (date) => date ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date)) : '—'
export default function Loans({ refreshKey }) {
  const [loans, setLoans] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const load = () => { setError(''); borrowApi.mine().then(setLoans).catch((err) => setError(err.response?.data?.message || err.userMessage || 'Unable to load your loans.')).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [refreshKey])
  const action = async (callback) => { try { await callback(); load() } catch (err) { setError(err.response?.data?.message || err.userMessage || 'Unable to update this loan.') } }
  return <><PageHeader eyebrow="Your reading record" title="My dues"><span className="result-count">{loans.length} records</span></PageHeader>{error && <div className="error-banner">{error}</div>}{loading ? <div className="loading-state">Loading your reading record…</div> : loans.length ? <div className="loan-list">{loans.map((loan) => <article className="loan-row" key={loan._id}><div className="loan-icon">▥</div><div className="loan-title"><strong>{loan.book?.title || 'Book unavailable'}</strong><span>{loan.book?.author || 'Unknown author'}</span></div><div className="loan-date"><small>Borrowed</small><span>{formatDate(loan.borrowDate)}</span></div><div className="loan-date"><small>Due date</small><span className={loan.lateDays > 0 ? 'overdue' : ''}>{formatDate(loan.dueDate)}</span></div><div className="loan-date"><small>Due</small><span className={loan.outstandingFine > 0 ? 'overdue' : ''}>${Number(loan.outstandingFine || 0).toFixed(2)}</span></div><span className={`status-pill ${loan.status}`}>{loan.status}</span>{loan.outstandingFine > 0 && <button className="outline-button" onClick={() => action(() => borrowApi.pay(loan._id))}>Pay due</button>}{loan.status === 'borrowed' && <button className="outline-button" onClick={() => action(() => borrowApi.return(loan._id))}>Return</button>}</article>)}</div> : <EmptyState title="Your shelf is clear" message="Borrow a title from the catalog and it will appear here." />}</>
}
