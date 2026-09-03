import { Icon } from './Icons'
import { icons } from './iconData'

export default function BookCard({ book, onBorrow, borrowed }) {
  const available = Number(book.availableCopies) > 0
  return <article className="book-card"><div className="book-cover">{book.coverImage ? <img src={book.coverImage} alt={`${book.title} cover`} /> : <div className="cover-placeholder"><Icon>{icons.book}</Icon><span>{book.category || 'Library'}<br />edition</span></div>}<span className={available ? 'availability available' : 'availability unavailable'}>{available ? 'Available' : 'Checked out'}</span></div><div className="book-info"><span className="eyebrow">{book.category || 'Uncategorised'}</span><h3>{book.title}</h3><p>{book.author}</p><div className="book-meta"><span>{book.publishedYear || 'Year n/a'}</span><span>{book.availableCopies ?? 0} of {book.totalCopies ?? 0} copies</span></div>{onBorrow && <button className="text-button" disabled={!available || borrowed} onClick={() => onBorrow(book._id)}>{borrowed ? 'Already borrowed' : available ? 'Borrow book →' : 'Unavailable'}</button>}</div></article>
}
