import { useMemo } from 'react';

export default function ConfirmationStep({ form, totals, onReset }) {
  const ticket = useMemo(
    () => `SH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    [],
  );

  return (
    <div className="confirm">
      <h1>Signal <em>received</em></h1>
      <p>
        Booking logged. Confirmation email within 24h — usually sooner. Pickup details and
        load-in notes follow.
      </p>
      <div className="ticket">
        <div><span className="lbl">// TKT</span>{ticket}</div>
        <div><span className="lbl">// OPR</span>{form.name || '—'}</div>
        <div><span className="lbl">// DATES</span>{totals.days}</div>
        <div><span className="lbl">// ITEMS</span>{totals.items}</div>
        <div><span className="lbl">// SUB</span>${totals.subtotal}.00 CAD</div>
      </div>
      <div>
        <button type="button" className="btn primary" onClick={onReset}>
          START OVER ↻
        </button>
      </div>
    </div>
  );
}
