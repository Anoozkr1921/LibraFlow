import { useEffect, useState } from 'react'
import { borrowApi } from '../services/api'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { icons } from '../components/iconData'

const formatDate = (date) => date ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date)) : '—'
const formatMoney = (amount) => `$${Number(amount || 0).toFixed(2)}`

function FineDashboard({ report }) {
	if (!report) return null
	const dashboard = report.summary
	return <section className="section-block fine-dashboard">
		<div className="section-heading"><div><span className="eyebrow">Receivables</span><h2>Fine dashboard</h2><p className="section-note">Outstanding fines grouped by member and loan.</p></div></div>
		<div className="fine-summary">
			<div><small>Assessed</small><strong>{formatMoney(dashboard.totalFine)}</strong></div>
			<div><small>Collected</small><strong>{formatMoney(dashboard.totalPaid)}</strong></div>
			<div><small>Outstanding</small><strong className="overdue">{formatMoney(dashboard.totalOutstanding)}</strong></div>
			<div><small>Members with fines</small><strong>{dashboard.memberCount}</strong></div>
		</div>
		{report.rows.length ? <div className="fine-members">{report.rows.map((member) => <details className="fine-member" key={member.member?._id || 'unknown'} open>
			<summary><span className="fine-member-name"><strong>{member.member?.name || 'Member'}</strong><small>{member.member?.email || 'No email available'}</small></span><span>{member.loans.length} loan{member.loans.length === 1 ? '' : 's'}</span><strong className={member.outstandingFine > 0 ? 'overdue' : ''}>{formatMoney(member.outstandingFine)} due</strong></summary>
			<div className="fine-loans">{member.loans.map((loan) => <div className="fine-loan" key={loan._id}><div><strong>{loan.book?.title || 'Book unavailable'}</strong><small>{loan.book?.author || 'Unknown author'}{loan.book?.isbn ? ` · ISBN ${loan.book.isbn}` : ''}</small></div><div><small>Borrowed</small><span>{formatDate(loan.borrowDate)}</span></div><div><small>Due</small><span className={loan.lateDays > 0 ? 'overdue' : ''}>{formatDate(loan.dueDate)}</span></div><div><small>Returned</small><span>{formatDate(loan.returnDate)}</span></div><div><small>Fine / paid</small><span>{formatMoney(loan.assessedFine)} / {formatMoney(loan.paidFine)}</span></div><div><small>Outstanding</small><span className={loan.outstandingFine > 0 ? 'overdue' : ''}>{formatMoney(loan.outstandingFine)}</span></div><span className={`status-pill ${loan.status}`}>{loan.status}</span></div>)}</div>
		</details>)}</div> : <div className="empty-inline">No fines have been recorded.</div>}
	</section>
}

function ReportTable({ report }) {
	if (!report) return null
	if (report.type === 'books') return <section className="section-block report-dashboard"><div className="section-heading"><div><span className="eyebrow">Inventory</span><h2>Book titles</h2><p className="section-note">Every catalog title, copy count, and shelf location.</p></div></div><div className="report-summary"><span><small>Titles</small><strong>{report.summary.totalTitles}</strong></span><span><small>Total copies</small><strong>{report.summary.totalCopies}</strong></span><span><small>Available copies</small><strong>{report.summary.availableCopies}</strong></span></div><div className="report-table">{report.rows.map((book) => <div className="report-row report-book-row" key={book._id}><div><strong>{book.title}</strong><small>{book.author} · ISBN {book.isbn}</small></div><span>{book.category}</span><span>{book.availableCopies} / {book.totalCopies} available</span><span>{book.location || 'No shelf assigned'}</span><span className={`status-pill ${book.status}`}>{book.status}</span></div>)}</div></section>
	if (report.type === 'loans') return <section className="section-block report-dashboard"><div className="section-heading"><div><span className="eyebrow">Circulation</span><h2>Active loans</h2><p className="section-note">Books currently with members, ordered by due date.</p></div></div><div className="report-summary"><span><small>Active loans</small><strong>{report.summary.totalLoans}</strong></span><span><small>Overdue loans</small><strong className="overdue">{report.rows.filter((loan) => loan.lateDays > 0).length}</strong></span></div><div className="report-table">{report.rows.map((loan) => <div className="report-row report-loan-row" key={loan._id}><div><strong>{loan.book?.title || 'Book unavailable'}</strong><small>{loan.book?.author || 'Unknown author'}</small></div><div><small>Borrower</small><span>{loan.student?.name || 'Member'}<br />{loan.student?.email || ''}</span></div><div><small>Borrowed</small><span>{formatDate(loan.borrowDate)}</span></div><div><small>Due</small><span className={loan.lateDays > 0 ? 'overdue' : ''}>{formatDate(loan.dueDate)}{loan.lateDays > 0 ? ` · ${loan.lateDays} days late` : ''}</span></div><div><small>Outstanding</small><span className={loan.outstandingFine > 0 ? 'overdue' : ''}>{formatMoney(loan.outstandingFine)}</span></div></div>)}</div></section>
	return <section className="section-block report-dashboard"><div className="section-heading"><div><span className="eyebrow">Accounts</span><h2>Members</h2><p className="section-note">Member verification, borrowing activity, and outstanding balances.</p></div></div><div className="report-summary"><span><small>Total members</small><strong>{report.summary.totalMembers}</strong></span><span><small>Verified members</small><strong>{report.summary.verifiedMembers}</strong></span></div><div className="report-table">{report.rows.map((member) => <div className="report-row report-member-row" key={member._id}><div><strong>{member.name}</strong><small>{member.email}</small></div><span>{member.role}</span><span>{formatDate(member.createdAt)}</span><span>{member.totalBorrowed} borrowed · {member.activeLoans} active</span><span className={member.outstandingFine > 0 ? 'overdue' : ''}>{formatMoney(member.outstandingFine)} due</span><span className={`status-pill ${member.isVerified ? 'returned' : 'borrowed'}`}>{member.isVerified ? 'verified' : 'unverified'}</span></div>)}</div></section>
}

function ReportDashboard({ report }) {
	if (!report) return null
	return report.type === 'fines' ? <FineDashboard report={report} /> : <ReportTable report={report} />
}

export default function Admin() {
	const [stats, setStats] = useState(null)
	const [records, setRecords] = useState([])
	const [report, setReport] = useState(null)
	const [loadingReport, setLoadingReport] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		Promise.all([borrowApi.adminStats(), borrowApi.all()]).then(([summary, all]) => { setStats(summary); setRecords(all || []) }).catch((err) => setError(err.response?.data?.message || 'Unable to load admin data.'))
	}, [])

	const showReport = (reportType) => {
		setError('')
		setLoadingReport(true)
		borrowApi.adminReport(reportType).then(setReport).catch((err) => setError(err.response?.data?.message || `Unable to load the ${reportType} dashboard.`)).finally(() => setLoadingReport(false))
	}

	return <><PageHeader eyebrow="Operations" title="Admin desk"><span className="live-label"><i /> Live library data</span></PageHeader>{error && <div className="error-banner">{error}</div>}<div className="stats-grid admin-stats"><StatCard label="Book titles" value={stats?.totalBooks} detail="view inventory breakdown" icon={icons.books} onClick={() => showReport('books')} /><StatCard label="Active loans" value={stats?.currentlyBorrowed} detail="view active loan details" icon={icons.loans} tone="green" onClick={() => showReport('loans')} /><StatCard label="Members" value={stats?.totalUsers} detail="view member accounts" icon={icons.users} onClick={() => showReport('members')} /><StatCard label="Total fines" value={stats ? formatMoney(stats.totalFines) : null} detail="view member breakdown" icon={icons.alert} tone="peach" onClick={() => showReport('fines')} /></div>{loadingReport ? <div className="loading-state">Loading report…</div> : <ReportDashboard report={report} />}<section className="section-block"><div className="section-heading"><div><span className="eyebrow">Circulation</span><h2>Latest activity</h2></div></div><div className="loan-list admin-list">{records.slice(0, 8).map((record) => <article className="loan-row" key={record._id}><div className="loan-icon">{record.status === 'returned' ? '✓' : '↗'}</div><div className="loan-title"><strong>{record.book?.title || 'Book unavailable'}</strong><span>{record.student?.name || record.student?.email || 'Member'}</span></div><div className="loan-date"><small>Due date</small><span>{formatDate(record.dueDate)}</span></div><span className={`status-pill ${record.status}`}>{record.status}</span></article>)}</div></section></>
}
