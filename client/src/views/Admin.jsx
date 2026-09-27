import { useEffect, useState } from 'react'
import { borrowApi } from '../services/api'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { icons } from '../components/iconData'

const formatDate = (date) => date ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date)) : '—'
const formatMoney = (amount) => `$${Number(amount || 0).toFixed(2)}`

function FineDashboard({ dashboard }) {
	if (!dashboard) return null
	return <section className="section-block fine-dashboard">
		<div className="section-heading"><div><span className="eyebrow">Receivables</span><h2>Fine dashboard</h2><p className="section-note">Outstanding fines grouped by member and loan.</p></div></div>
		<div className="fine-summary">
			<div><small>Assessed</small><strong>{formatMoney(dashboard.totalFine)}</strong></div>
			<div><small>Collected</small><strong>{formatMoney(dashboard.totalPaid)}</strong></div>
			<div><small>Outstanding</small><strong className="overdue">{formatMoney(dashboard.totalOutstanding)}</strong></div>
			<div><small>Members with fines</small><strong>{dashboard.memberCount}</strong></div>
		</div>
		{dashboard.members.length ? <div className="fine-members">{dashboard.members.map((member) => <details className="fine-member" key={member.member?._id || 'unknown'} open>
			<summary><span className="fine-member-name"><strong>{member.member?.name || 'Member'}</strong><small>{member.member?.email || 'No email available'}</small></span><span>{member.loans.length} loan{member.loans.length === 1 ? '' : 's'}</span><strong className={member.outstandingFine > 0 ? 'overdue' : ''}>{formatMoney(member.outstandingFine)} due</strong></summary>
			<div className="fine-loans">{member.loans.map((loan) => <div className="fine-loan" key={loan._id}><div><strong>{loan.book?.title || 'Book unavailable'}</strong><small>{loan.book?.author || 'Unknown author'}{loan.book?.isbn ? ` · ISBN ${loan.book.isbn}` : ''}</small></div><div><small>Borrowed</small><span>{formatDate(loan.borrowDate)}</span></div><div><small>Due</small><span className={loan.lateDays > 0 ? 'overdue' : ''}>{formatDate(loan.dueDate)}</span></div><div><small>Returned</small><span>{formatDate(loan.returnDate)}</span></div><div><small>Fine / paid</small><span>{formatMoney(loan.assessedFine)} / {formatMoney(loan.paidFine)}</span></div><div><small>Outstanding</small><span className={loan.outstandingFine > 0 ? 'overdue' : ''}>{formatMoney(loan.outstandingFine)}</span></div><span className={`status-pill ${loan.status}`}>{loan.status}</span></div>)}</div>
		</details>)}</div> : <div className="empty-inline">No fines have been recorded.</div>}
	</section>
}

export default function Admin() {
	const [stats, setStats] = useState(null)
	const [records, setRecords] = useState([])
	const [fineDashboard, setFineDashboard] = useState(null)
	const [finesOpen, setFinesOpen] = useState(false)
	const [loadingFines, setLoadingFines] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		Promise.all([borrowApi.adminStats(), borrowApi.all()]).then(([summary, all]) => { setStats(summary); setRecords(all || []) }).catch((err) => setError(err.response?.data?.message || 'Unable to load admin data.'))
	}, [])

	const showFineDashboard = () => {
		setFinesOpen(true)
		if (fineDashboard || loadingFines) return
		setLoadingFines(true)
		borrowApi.adminFines().then(setFineDashboard).catch((err) => setError(err.response?.data?.message || 'Unable to load the fine dashboard.')).finally(() => setLoadingFines(false))
	}

	return <><PageHeader eyebrow="Operations" title="Admin desk"><span className="live-label"><i /> Live library data</span></PageHeader>{error && <div className="error-banner">{error}</div>}<div className="stats-grid admin-stats"><StatCard label="Book titles" value={stats?.totalBooks} detail={`${stats?.availableBooks ?? '—'} copies available`} icon={icons.books} /><StatCard label="Active loans" value={stats?.currentlyBorrowed} detail={`${stats?.overdueBooks ?? '—'} overdue`} icon={icons.loans} tone="green" /><StatCard label="Members" value={stats?.totalUsers} detail="registered accounts" icon={icons.users} /><StatCard label="Total fines" value={stats ? formatMoney(stats.totalFines) : null} detail={finesOpen ? 'dashboard opened below' : 'view member breakdown'} icon={icons.alert} tone="peach" onClick={showFineDashboard} /></div>{finesOpen && (loadingFines ? <div className="loading-state">Loading fine dashboard…</div> : <FineDashboard dashboard={fineDashboard} />)}<section className="section-block"><div className="section-heading"><div><span className="eyebrow">Circulation</span><h2>Latest activity</h2></div></div><div className="loan-list admin-list">{records.slice(0, 8).map((record) => <article className="loan-row" key={record._id}><div className="loan-icon">{record.status === 'returned' ? '✓' : '↗'}</div><div className="loan-title"><strong>{record.book?.title || 'Book unavailable'}</strong><span>{record.student?.name || record.student?.email || 'Member'}</span></div><div className="loan-date"><small>Due date</small><span>{formatDate(record.dueDate)}</span></div><span className={`status-pill ${record.status}`}>{record.status}</span></article>)}</div></section></>
}
