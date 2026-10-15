import { ArrowUpRight, CalendarDays, Trash2 } from 'lucide-react'
import './RequestList.css'

function formatDate(value) {
  if (!value) {
    return 'Date not set'
  }

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

export function RequestList({ onBrowse, onCancelRequest, requests }) {
  if (!requests.length) {
    return (
      <section className="request-list__empty">
        <span className="request-list__empty-mark"><CalendarDays aria-hidden="true" size={24} /></span>
        <h2>No requests yet</h2>
        <p>When you find a tool you need, send the owner a date range and a short note.</p>
        <button className="button button--primary" onClick={onBrowse} type="button">Browse tools <ArrowUpRight aria-hidden="true" size={16} /></button>
      </section>
    )
  }

  return (
    <section className="request-list" aria-label="Your borrowing requests">
      <div className="request-list__heading">
        <h2>Borrowing activity</h2>
        <span>{requests.length} request{requests.length === 1 ? '' : 's'}</span>
      </div>
      <div className="request-list__items">
        {requests.map((request) => (
          <article className="request-item" key={request.id}>
            <div className="request-item__main">
              <div className="request-item__title-row">
                <h3>{request.toolName}</h3>
                <span className="request-item__status">{request.status}</span>
              </div>
              <p className="request-item__owner">Request to {request.owner}</p>
              <p className="request-item__dates">
                <CalendarDays aria-hidden="true" size={15} />
                {formatDate(request.pickupDate)} <span aria-hidden="true">to</span> {formatDate(request.returnDate)}
              </p>
              {request.note ? <p className="request-item__note">“{request.note}”</p> : null}
            </div>
            <div className="request-item__side">
              <span className="request-item__estimate">Est. ${request.estimatedTotal}</span>
              <button className="request-item__cancel" onClick={() => onCancelRequest(request.id)} type="button">
                <Trash2 aria-hidden="true" size={15} /> Cancel request
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
