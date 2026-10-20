import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import './RequestDialog.css'

function getBorrowDays(pickupDate, returnDate) {
  const start = Date.parse(`${pickupDate}T00:00:00Z`)
  const end = Date.parse(`${returnDate}T00:00:00Z`)

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 1
  }

  return Math.max(1, Math.ceil((end - start) / 86400000))
}

function addDays(date, days) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate.toISOString().slice(0, 10)
}

export function RequestDialog({ onClose, onSubmit, tool }) {
  const today = new Date().toISOString().slice(0, 10)
  const defaultReturnDate = addDays(new Date(), 1)
  const [pickupDate, setPickupDate] = useState(today)
  const [returnDate, setReturnDate] = useState(defaultReturnDate)
  const [note, setNote] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const borrowDays = getBorrowDays(pickupDate, returnDate)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()

    if (returnDate < pickupDate) {
      setErrorMessage('Choose a return date on or after pickup.')
      return
    }

    const wasCreated = onSubmit({
      toolId: tool.id,
      toolName: tool.name,
      owner: tool.owner,
      pickupDate,
      returnDate,
      note: note.trim(),
      dailyRate: tool.dailyRate,
      estimatedTotal: tool.dailyRate * borrowDays
    })

    if (wasCreated === false) {
      setErrorMessage('You already have a pending request for this tool during those dates.')
    }
  }

  return (
    <div className="request-dialog__backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="request-dialog-title" aria-modal="true" className="request-dialog" role="dialog">
        <div className="request-dialog__header">
          <div>
            <p className="request-dialog__eyebrow">BORROW REQUEST</p>
            <h2 id="request-dialog-title">{tool.name}</h2>
          </div>
          <button aria-label="Close request" className="request-dialog__close" onClick={onClose} type="button">
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <p className="request-dialog__owner">Shared by {tool.owner} · {tool.neighborhood}</p>

        <form className="request-form" onSubmit={handleSubmit}>
          <div className="request-form__dates">
            <label className="request-form__field">
              <span>Pickup date</span>
              <input min={today} onChange={(event) => setPickupDate(event.target.value)} required type="date" value={pickupDate} />
            </label>
            <label className="request-form__field">
              <span>Return date</span>
              <input min={pickupDate} onChange={(event) => setReturnDate(event.target.value)} required type="date" value={returnDate} />
            </label>
          </div>

          <label className="request-form__field">
            <span>Note to the lender <small>Optional</small></span>
            <textarea
              maxLength={240}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Share what you plan to use it for or ask a question."
              rows={3}
              value={note}
            />
          </label>

          {errorMessage ? <p className="request-form__error" role="alert">{errorMessage}</p> : null}

          <div className="request-form__estimate">
            <span>Estimated rental</span>
            <strong>${tool.dailyRate} × {borrowDays} day{borrowDays === 1 ? '' : 's'} = ${tool.dailyRate * borrowDays}</strong>
          </div>

          <p className="request-form__fine-print">The lender will confirm pickup details. This demo saves your request in this browser.</p>
          <button className="button button--primary request-form__submit" type="submit">Send request</button>
        </form>
      </section>
    </div>
  )
}
