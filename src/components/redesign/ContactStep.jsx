import NavActions from './NavActions';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isContactValid(form) {
  return (
    form.name.trim() &&
    form.address.trim() &&
    form.phone.trim() &&
    EMAIL_RE.test(form.email.trim())
  );
}

export default function ContactStep({ form, setForm, onBack, onNext }) {
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const valid = isContactValid(form);

  return (
    <>
      <div className="form-grid">
        <div className="field">
          <label>NAME <span className="req">*</span></label>
          <input value={form.name} onChange={update('name')} placeholder="John Doe" />
        </div>
        <div className="field">
          <label>BUSINESS <span style={{ color: 'var(--ink-soft)' }}>(OPTIONAL)</span></label>
          <input value={form.business} onChange={update('business')} placeholder="Skibidi Toilet Productions" />
        </div>
        <div className="field full">
          <label>MAILING ADDRESS <span className="req">*</span></label>
          <input value={form.address} onChange={update('address')} placeholder="67 Yolo Blvd, Albuquerque, NM" />
        </div>
        <div className="field">
          <label>PHONE <span className="req">*</span></label>
          <input value={form.phone} onChange={update('phone')} placeholder="667 667 6767" />
        </div>
        <div className="field">
          <label>EMAIL <span className="req">*</span></label>
          <input type="email" value={form.email} onChange={update('email')} placeholder="you@domain.com" />
        </div>
        <div className="field full">
          <label>COMMENTS</label>
          <textarea
            rows="3"
            value={form.comments}
            onChange={update('comments')}
            placeholder="Venue details, load-in window, weird asks..."
          />
        </div>
      </div>

      <NavActions>
        <button type="button" className="btn ghost" onClick={onBack}>← BACK</button>
        <button type="button" className="btn primary" disabled={!valid} onClick={onNext}>
          ≫ REVIEW CONTRACT
        </button>
      </NavActions>
    </>
  );
}
