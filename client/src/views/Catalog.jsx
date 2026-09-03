import { useEffect, useState } from 'react'
import { bookApi, borrowApi } from '../services/api'
import BookCard from '../components/BookCard'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

export default function Catalog({ user, onAuth, onBorrowed }) {
  const [query, setQuery] = useState({ search: '', category: '', available: '', sort: 'newest', page: 1, limit: 12 })
  const [result, setResult] = useState({ books: [], pagination: {} })
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = () => { setError(''); bookApi.list(query).then(setResult).catch((err) => setError(err.response?.data?.message || err.userMessage || 'The catalog could not be loaded.')).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [query.search, query.category, query.available, query.sort, query.page])
  useEffect(() => { if (user) borrowApi.mine().then(setLoans).catch(() => {}) }, [user, onBorrowed])
  const update = (key, value) => setQuery((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }))
  const borrow = async (bookId) => { if (!user) return onAuth(); await borrowApi.borrow(bookId); onBorrowed(); load() }
  const borrowedIds = new Set(loans.filter((loan) => loan.status === 'borrowed').map((loan) => loan.book?._id))
  return <><PageHeader eyebrow="The collection" title="Find your next read"><span className="result-count">{result.pagination?.totalBooks ?? 0} titles</span></PageHeader><div className="catalog-toolbar"><label className="search-field">⌕<input value={query.search} onChange={(e) => update('search', e.target.value)} placeholder="Search title, author, or ISBN" /></label><select value={query.category} onChange={(e) => update('category', e.target.value)}><option value="">All categories</option>{[...new Set(result.books.map((book) => book.category).filter(Boolean))].map((category) => <option key={category}>{category}</option>)}</select><select value={query.available} onChange={(e) => update('available', e.target.value)}><option value="">Any availability</option><option value="true">Available now</option><option value="false">Checked out</option></select><select value={query.sort} onChange={(e) => update('sort', e.target.value)}><option value="newest">Recently added</option><option value="title">Title A–Z</option><option value="author">Author A–Z</option><option value="oldest">Oldest added</option></select></div>{error && <div className="error-banner">{error}</div>}{loading ? <div className="loading-state">Loading the collection…</div> : result.books.length ? <><div className="book-grid">{result.books.map((book) => <BookCard key={book._id} book={book} onBorrow={borrow} borrowed={borrowedIds.has(book._id)} />)}</div><div className="pagination"><button disabled={!result.pagination?.hasPreviousPage} onClick={() => update('page', query.page - 1)}>← Previous</button><span>Page {result.pagination?.page || 1} of {result.pagination?.totalPages || 1}</span><button disabled={!result.pagination?.hasNextPage} onClick={() => update('page', query.page + 1)}>Next →</button></div></> : <EmptyState title="No books match this search" message="Try another title, author, or filter." />}</>
}
