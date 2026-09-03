import { useEffect, useState } from 'react'
import { borrowApi, bookApi } from '../services/api'
import { icons } from '../components/iconData'
import StatCard from '../components/StatCard'
import BookCard from '../components/BookCard'
import PageHeader from '../components/PageHeader'

export default function Overview({ user, onNavigate }) {
  const [stats, setStats] = useState(null)
  const [books, setBooks] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { bookApi.list({ limit: 4 }).then((data) => setBooks(data.books || [])).catch(() => setError('Unable to load the latest books.')); if (user) borrowApi.myStats().then(setStats).catch(() => {}) }, [user])
  const greeting = user?.name ? `Good morning, ${user.name.split(' ')[0]}.` : 'A quieter way to read.'
  return <><PageHeader eyebrow="Your library" title={greeting}><button className="primary-button" onClick={() => onNavigate('catalog')}>Browse catalog <span>→</span></button></PageHeader>{!user && <section className="welcome-banner"><div><span className="eyebrow">LIBRAFLOW / MEMBER ACCESS</span><h2>Your reading life, in one place.</h2><p>Explore the collection and keep every loan on schedule.</p></div><button className="light-button" onClick={() => onNavigate('catalog')}>Explore collection →</button></section>}{user && <div className="stats-grid"><StatCard label="Currently reading" value={stats?.currentlyBorrowed} detail="active loans" icon={icons.loans} tone="green" /><StatCard label="Books borrowed" value={stats?.totalBorrowed} detail="all time" icon={icons.book} /><StatCard label="Returned" value={stats?.returnedBooks} detail="completed loans" icon="✓" /><StatCard label="Outstanding fine" value={stats ? `$${Number(stats.totalFine || 0).toFixed(2)}` : null} detail={stats?.overdueBooks ? `${stats.overdueBooks} overdue` : 'all clear'} icon={icons.alert} tone="peach" /></div>}{error && <div className="error-banner">{error}</div>}<section className="section-block"><div className="section-heading"><div><span className="eyebrow">Fresh arrivals</span><h2>Recently added</h2></div><button className="text-button" onClick={() => onNavigate('catalog')}>View all →</button></div><div className="book-grid compact">{books.map((book) => <BookCard key={book._id} book={book} />)}</div></section></>
}
