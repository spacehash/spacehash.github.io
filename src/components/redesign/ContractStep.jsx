import { useState } from 'react';
import dayjs from 'dayjs';
import NavActions from './NavActions';

function Section({ n, title, children }) {
  return (
    <>
      <h3>{n}. {title}</h3>
      {children}
    </>
  );
}

export default function ContractStep({
  form,
  dateSelections,
  equipment,
  formState,
  handleFormspreeSubmit,
  onBack,
}) {
  const [signature, setSignature] = useState('');

  const signatureMatches =
    signature.trim() !== '' &&
    signature.trim().toLowerCase() === (form.name || '').trim().toLowerCase();

  const sortedDates = Object.keys(dateSelections).sort();
  const contractDate = dayjs().format('MM/DD/YYYY');

  const leaseStart = sortedDates.length
    ? dayjs(sortedDates[0]).format('MM/DD/YYYY')
    : '________';
  const leaseEnd = sortedDates.length === 0
    ? '________'
    : sortedDates.length === 1
    ? dayjs(sortedDates[0]).add(1, 'day').format('MM/DD/YYYY')
    : dayjs(sortedDates[sortedDates.length - 1]).add(1, 'day').format('MM/DD/YYYY');

  const gearByDate = sortedDates.map((dateStr) => {
    const qtys = dateSelections[dateStr] || {};
    const items = equipment
      .filter((item) => (qtys[item.name] || 0) > 0)
      .map((item) => ({
        name: item.name,
        qty: qtys[item.name],
        cost: item.cost,
        value: item.value,
        lineTotal: qtys[item.name] * item.cost,
      }));
    const dayTotal = items.reduce((s, i) => s + i.lineTotal, 0);
    return { dateStr, items, dayTotal };
  });

  const grandTotal = gearByDate.reduce((s, d) => s + d.dayTotal, 0);
  const totalItems = gearByDate.reduce(
    (s, d) => s + d.items.reduce((a, i) => a + i.qty, 0),
    0,
  );

  const bookingSummary = [
    ...gearByDate.map(({ dateStr, items, dayTotal }) => [
      `──────────────────────`,
      `Date: ${dayjs(dateStr).format('MM/DD/YYYY')}`,
      `──────────────────────`,
      ...items.map((i) => `  ${i.qty > 1 ? `(${i.qty}) ` : ''}${i.name}\n  $${i.cost}/day × ${i.qty} = $${i.lineTotal}`),
      ...(gearByDate.length > 1 ? [`\n  Day subtotal: $${dayTotal}`] : []),
    ].join('\n')),
    `\n══════════════════════`,
    `TOTAL: $${grandTotal}`,
    `══════════════════════`,
  ].join('\n');

  const submit = () => {
    document.getElementById('formspree-contract').requestSubmit();
  };

  return (
    <>
      <div className="contract">
        <h2>SPACEHASH LLC Rental Agreement</h2>
        <div className="date-line">DRAWN UP · {dayjs().format('YYYY-MM-DD')} · VICTORIA, BC</div>

        <Section n="1" title="THE PARTIES">
          <p>
            This Equipment Lease Agreement ("contract") is made and entered into on {contractDate},
            by and between:
          </p>
          <div className="parties">
            <div><strong>Donovan Jenkins @ SPACEHASH LLC</strong> (the "Owner")</div>
            <div><span className="parties-key">Address:</span> 5500 Copper Ave NE 87121</div>
            <div className="parties-and">and</div>
            <div>
              <strong style={{ color: 'var(--riso-pink)' }}>
                {form.name || '________'}{form.business ? ` @ ${form.business}` : ''}
              </strong>{' '}(the "Renter")
            </div>
            <div><span className="parties-key">Address:</span> {form.address || '________'}</div>
            <div><span className="parties-key">Phone:</span> {form.phone || '________'}</div>
            <div><span className="parties-key">Email:</span> {form.email || '________'}</div>
          </div>
        </Section>

        <Section n="2" title="EQUIPMENT AND TOTAL APPROXIMATE VALUE">
          <p>
            The Owner and Renter agree to enter into a binding agreement for the leasing of the
            equipment itemized in the table below. Approximate replacement values are listed per
            item in the catalog.
          </p>
          <table>
            <thead>
              <tr>
                <th>DATE</th>
                <th>ITEMS</th>
                <th style={{ textAlign: 'right' }}>DAY TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {gearByDate.map(({ dateStr, items, dayTotal }) => {
                if (dayTotal === 0) return null;
                return (
                  <tr key={dateStr}>
                    <td>{dateStr}</td>
                    <td>{items.map((i) => `${i.qty}× ${i.name}`).join(' · ')}</td>
                    <td style={{ textAlign: 'right' }}>${dayTotal}</td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td>TOTAL</td>
                <td>{gearByDate.length} DAYS · {totalItems} ITEMS</td>
                <td style={{ textAlign: 'right', color: 'var(--riso-pink)' }}>${grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section n="3" title="TERM, PICK UP, AND RETURN OF EQUIPMENT">
          <p>
            SPACEHASH charges by the event/day. All inquiries must be made and scheduled a minimum
            of 72 hours before the event. Equipment must be returned by the end of the next
            business day or when a representative of SPACEHASH is next available.
          </p>
          <p><strong>Lease period:</strong> {leaseStart} → {leaseEnd}. Equipment must be returned by the end of this date.</p>
          <p>
            If the equipment is not returned by the end of the day on the agreement date listed
            above, or is not communicated properly, an additional full day rental will be
            automatically charged. The renter is responsible for picking up and dropping off the
            equipment on time and when a representative from SPACEHASH is available. SPACEHASH
            is not responsible or obligated to drop off or pick up any equipment unless otherwise
            communicated.
          </p>
        </Section>

        <Section n="4" title="LEASE PAYMENTS">
          <p>
            We charge by the day/event. We invoice through PayPal to the renter email given above.
            Payments are due once the gear is returned, visually inspected, and any additional fees
            are applied. The Renter agrees to pay the Owner by cash, check, direct bank deposit, or
            PayPal.
          </p>
          <p className="payment-estimate">1-Time Payment Estimate: ${grandTotal}</p>
          <p>Additional fees may be applied upon return and inspection.</p>
        </Section>

        <Section n="5" title="SECURITY DEPOSIT">
          <p>
            A Security Deposit will be determined by SPACEHASH and communicated separately. If
            required, this is an additional deposit for equipment set up in non-intended use areas
            that may be exposed to excessive dust, dirt, rain, spills, fog machine juice, etc. Any
            additional damage or losses shall be paid by the Renter in a separate payment.
          </p>
        </Section>

        <Section n="6" title="LATE FEES, DAMAGE, OR MISSING ACCESSORIES">
          <p>
            The renter is responsible for the equipment, cases, and all accessories and for how
            they come back. The Renter is liable for any damage or missing items. Common fees:
            (1) Missing or switched cables: $40 per cable. (2) Excessive cleaning: up to $65.
            (3) Damaged case hinges: $25 per hinge. (4) Deep scratches, damaged screens, knobs,
            or faders: $65–$500 per instance. Late return: full daily rate per day late. Late
            payment: 20% cumulative per day past the invoice due date.
          </p>
        </Section>

        <Section n="7" title="INSURANCE">
          <p>
            Insurance is not required but encouraged. The Renter agrees to be responsible for the
            full value of the equipment and accessories pertaining to any loss, misuse, theft,
            damage, missing accessories, or destruction of the Equipment.
          </p>
        </Section>

        <Section n="8" title="USE OF EQUIPMENT AND RENTER'S RESPONSIBILITY">
          <p>
            The Renter agrees to use the Equipment for its intended use. Any use outside of its
            intended use will result in additional fees. It is the Renter's responsibility to
            maintain the Equipment in accordance with industry standards. The Equipment shall
            remain the property of the Owner and must be returned in the same condition as the
            start of the term.
          </p>
        </Section>

        <Section n="9" title="REPAIRS">
          <p>
            If the Equipment ceases to function at no fault of the Renter, the Owner agrees to
            either replace the Equipment with an equal unit or refund the full rental amount. No
            lease payment is owed by the Renter during any exchange or repair period.
          </p>
        </Section>

        <Section n="10" title="DEFAULT / LEGAL RECOURSE">
          <p>
            In the event of Default or failure to return equipment, SPACEHASH may terminate this
            Agreement and take possession of the Equipment. If repossession, collection agencies,
            or attorney services are required to recover equipment or payments, the Renter will
            pay all associated costs.
          </p>
        </Section>

        <Section n="11" title="INDEMNIFICATION">
          <p>
            The Renter shall indemnify and hold the Owner harmless from any loss, damage, or
            expense arising from the Renter's possession, use, or misuse of the Equipment.
          </p>
        </Section>

        <Section n="12" title="ENTIRE AGREEMENT">
          <p>
            This Agreement constitutes a legal contract between the Owner and the Renter. I, the
            renter, have read and understand the above terms. I understand that my agreement makes
            me responsible for the full replacement value of the listed items if they are lost,
            stolen, or damaged in any way. I agree that the gear will be returned in the exact
            condition received, and I agree to pay any additional fees charged upon return and
            inspection.
          </p>
        </Section>

        <Section n="13" title="GOVERNING LAW">
          <p>This Agreement shall be governed under the laws of the State of New Mexico.</p>
        </Section>

        {form.comments && (
          <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
            <em>Comments:</em> {form.comments}
          </p>
        )}

        <div className="sign-grid">
          <div className="sign">
            <input
              type="text"
              className="sign-input"
              placeholder="TYPE YOUR FULL NAME"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              autoComplete="off"
            />
            <div className="label">// RENTER — {dayjs().format('YYYY-MM-DD')}</div>
            {signature && !signatureMatches && (
              <div className="sign-hint">must match "{form.name}"</div>
            )}
          </div>
          <div className="sign">
            <div className="name">Donovan Jenkins</div>
            <div className="label">// LENDER — SPACEHASH</div>
          </div>
        </div>
      </div>

      {formState.errors && formState.errors.length > 0 && (
        <p className="contract-error">Submission failed — please try again.</p>
      )}

      <p className="contract-agreement-statement">
        By signing and submitting this booking, I have read and agree to the terms of this Equipment Rental Agreement.
      </p>

      <form
        onSubmit={handleFormspreeSubmit}
        style={{ display: 'none' }}
        id="formspree-contract"
      >
        <input name="name" defaultValue={form.name} />
        <input name="email" defaultValue={form.email || ''} />
        <input name="phone" defaultValue={form.phone} />
        <input name="address" defaultValue={form.address} />
        <input name="business" defaultValue={form.business || ''} />
        <input name="contract_date" defaultValue={contractDate} />
        <input name="rental_dates" defaultValue={sortedDates.join(', ')} />
        <input name="total" defaultValue={`$${grandTotal}`} />
        <textarea name="booking_summary" defaultValue={bookingSummary} />
        <input name="comments" defaultValue={form.comments || ''} />
        <input name="agreed" defaultValue="yes" />
      </form>

      <NavActions>
        <button
          type="button"
          className="btn ghost"
          onClick={onBack}
          disabled={formState.submitting}
        >
          ← EDIT DETAILS
        </button>
        <button
          type="button"
          className="btn primary"
          disabled={!signatureMatches || formState.submitting}
          onClick={submit}
        >
          {formState.submitting ? 'TRANSMITTING…' : '≫ TRANSMIT BOOKING'}
        </button>
      </NavActions>
    </>
  );
}
