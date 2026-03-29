import { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { useForm } from '@formspree/react';
import dayjs from 'dayjs';

// ─── Layout primitives ─────────────────────────────────────────────────────────

function SectionHeader({ number, title }) {
  return (
    <Box sx={{ mt: 3.5, mb: 1.5 }}>
      <Typography
        variant="overline"
        color="primary.main"
        sx={{ fontWeight: 700, letterSpacing: 1.5, fontSize: '0.7rem' }}
      >
        {number}. {title}
      </Typography>
      <Divider sx={{ mt: 0.5 }} />
    </Box>
  );
}

// Prominent data value with optional inline confirm checkbox
function ContractField({ value, subtitle, confirmKey, confirmed, onConfirm }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2.5 }}>
      {confirmKey && (
        <Checkbox
          checked={!!confirmed}
          onChange={onConfirm}
          size="small"
          color="primary"
          sx={{ p: 0.5, mt: 0.5, flexShrink: 0 }}
        />
      )}
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ lineHeight: 1.3, wordBreak: 'break-word' }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function ContractText({ children }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
      {children}
    </Typography>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

function ContractReviewStep({
  name, business, address, phone, contactInfo, comments,
  dateSelections, equipment,
  onBack, onGoHome,
}) {
  const [formState, handleFormspreeSubmit] = useForm('xykbevyk');

  const renterDisplayName = business || name;
  const sortedDates = Object.keys(dateSelections).sort();
  const contractDate = dayjs().format('MM/DD/YYYY');

  const leaseStart = dayjs(sortedDates[0]).format('MM/DD/YYYY');
  const leaseEnd = sortedDates.length === 1
    ? dayjs(sortedDates[0]).add(1, 'day').format('MM/DD/YYYY')
    : dayjs(sortedDates[sortedDates.length - 1]).add(1, 'day').format('MM/DD/YYYY');

  const gearByDate = sortedDates.map((dateStr) => {
    const qtys = dateSelections[dateStr];
    const items = equipment
      .filter((item) => (qtys[item.id] || 0) > 0)
      .map((item) => ({
        name: item.name,
        qty: qtys[item.id],
        cost: item.cost,
        value: item.value,
        lineTotal: qtys[item.id] * item.cost,
      }));
    const dayTotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    return { dateStr, items, dayTotal };
  });

  const grandTotal = gearByDate.reduce((sum, d) => sum + d.dayTotal, 0);

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

  // ── Confirmation checkboxes ──
  const confirmationKeys = [
    'name',
    ...(business ? ['printName'] : []),
    'address',
    'phone',
    ...(contactInfo ? ['contactInfo'] : []),
    ...sortedDates.map((d) => `date_${d}`),
    'leasePeriod',
    'total',
    'agreed',
  ];

  const [confirmed, setConfirmed] = useState(() =>
    Object.fromEntries(confirmationKeys.map((k) => [k, false]))
  );

  const allConfirmed = confirmationKeys.every((k) => confirmed[k]);
  const toggle = (key) => setConfirmed((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Success screen ──
  if (formState.succeeded) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2,
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="h4" color="primary" fontWeight="bold">
          Request Submitted
        </Typography>
        <Typography color="text.secondary">
          We'll be in touch to confirm your rental.
        </Typography>
        <Button variant="outlined" onClick={onGoHome} sx={{ mt: 1 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Scrollable contract body ── */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', pr: 0.5 }}>

        <Typography variant="h6" align="center" fontWeight="bold" sx={{ mb: 0.5 }}>
          SPACE HASH
        </Typography>
        <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ mb: 3, letterSpacing: 1 }}>
          EQUIPMENT RENTAL AGREEMENT
        </Typography>

        {/* 1 */}
        <SectionHeader number="1" title="THE PARTIES" />
        <ContractField
          value={contractDate}
          subtitle='This Equipment Lease Agreement ("contract") is made and entered into on this day, by and between'
        />
        <ContractField
          value="Donovan Jenkins @ SPACE HASH LLC"
          subtitle="Owner — 8515 Llano Vista Ave SW, 87121 · (505) 977-3017 · spacehash.github.io"
        />
        <ContractField
          value={renterDisplayName}
          subtitle="Renter (or business) name"
          confirmKey="name"
          confirmed={confirmed.name}
          onConfirm={() => toggle('name')}
        />
        {business && (
          <ContractField
            value={name}
            subtitle="Print name"
            confirmKey="printName"
            confirmed={confirmed.printName}
            onConfirm={() => toggle('printName')}
          />
        )}
        <ContractField
          value={address}
          subtitle="Mailing Address"
          confirmKey="address"
          confirmed={confirmed.address}
          onConfirm={() => toggle('address')}
        />
        <ContractField
          value={phone}
          subtitle="Phone Number"
          confirmKey="phone"
          confirmed={confirmed.phone}
          onConfirm={() => toggle('phone')}
        />
        {contactInfo && (
          <ContractField
            value={contactInfo}
            subtitle="Additional Contact Info"
            confirmKey="contactInfo"
            confirmed={confirmed.contactInfo}
            onConfirm={() => toggle('contactInfo')}
          />
        )}

        {/* 2 */}
        <SectionHeader number="2" title="EQUIPMENT AND TOTAL APPROXIMATE VALUE" />
        <ContractText>
          The Owner and Renter agree to enter into a binding agreement for the leasing of the
          following equipment. Itemized equipment list and approximate total value:
        </ContractText>
        {gearByDate.map(({ dateStr, items, dayTotal }) => (
          <Box key={dateStr} sx={{ mb: 2 }}>
            <ContractField
              value={dayjs(dateStr).format('MM/DD/YYYY')}
              subtitle="Rental date — check to confirm this date and gear selection"
              confirmKey={`date_${dateStr}`}
              confirmed={confirmed[`date_${dateStr}`]}
              onConfirm={() => toggle(`date_${dateStr}`)}
            />
            {items.map((item) => (
              <ContractField
                key={item.name}
                value={`${item.qty > 1 ? `(${item.qty}) ` : ''}${item.name}`}
                subtitle={`Replacement value $${item.value * item.qty} · $${item.cost}/day × ${item.qty} = $${item.lineTotal}`}
              />
            ))}
            {gearByDate.length > 1 && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Day subtotal: ${dayTotal}
              </Typography>
            )}
          </Box>
        ))}

        {/* 3 */}
        <SectionHeader number="3" title="TERM, PICK UP, AND RETURN OF EQUIPMENT" />
        <ContractText>
          SPACE HASH charges by the event/day. All inquiries must be made and scheduled a
          minimum of 72 hours before the event. Equipment must be returned by the end of the
          next business day or when a representative of SPACE HASH is next available.
        </ContractText>
        <ContractField
          value={`${leaseStart} → ${leaseEnd}`}
          subtitle="Lease period. Equipment must be returned by the end of this date."
          confirmKey="leasePeriod"
          confirmed={confirmed.leasePeriod}
          onConfirm={() => toggle('leasePeriod')}
        />
        <ContractText>
          If the equipment is not returned by the end of the day on the agreement date listed
          above, or is not communicated properly, an additional full day rental will be
          automatically charged. The renter is responsible for picking up and dropping off the
          equipment on time and when a representative from SPACE HASH is available. SPACE HASH
          is not responsible or obligated to drop off or pick up any equipment unless otherwise
          communicated.
        </ContractText>

        {/* 4 */}
        <SectionHeader number="4" title="LEASE PAYMENTS" />
        <ContractText>
          We charge by the day/event. We invoice through PayPal to the renter email given above.
          Payments are due once the gear is returned, visually inspected, and any additional fees
          are applied. The Renter agrees to pay the Owner by cash, check, direct bank deposit,
          or PayPal.
        </ContractText>
        <ContractField
          value={`$${grandTotal}`}
          subtitle="1-Time Payment (estimate). Additional fees may be applied upon return and inspection."
          confirmKey="total"
          confirmed={confirmed.total}
          onConfirm={() => toggle('total')}
        />

        {/* 5 */}
        <SectionHeader number="5" title="SECURITY DEPOSIT" />
        <ContractText>
          A Security Deposit will be determined by SPACE HASH and communicated separately. If
          required, this is an additional deposit for equipment set up in non-intended use areas
          that may be exposed to excessive dust, dirt, rain, spills, fog machine juice, etc. Any
          additional damage or losses shall be paid by the Renter in a separate payment.
        </ContractText>

        {/* 6 */}
        <SectionHeader number="6" title="LATE FEES, DAMAGE, OR MISSING ACCESSORIES" />
        <ContractText>
          The renter is responsible for the equipment, cases, and all accessories and for how
          they come back. The Renter is liable for any damage or missing items. Common fees:
          (1) Missing or switched cables: $40 per cable. (2) Excessive cleaning: up to $65.
          (3) Damaged case hinges: $25 per hinge. (4) Deep scratches, damaged screens, knobs,
          or faders: $65–$500 per instance. Late return: full daily rate per day late. Late
          payment: 20% cumulative per day past the invoice due date.
        </ContractText>

        {/* 7 */}
        <SectionHeader number="7" title="INSURANCE" />
        <ContractText>
          Insurance is not required but encouraged. The Renter agrees to be responsible for the
          full value of the equipment and accessories pertaining to any loss, misuse, theft,
          damage, missing accessories, or destruction of the Equipment.
        </ContractText>

        {/* 8 */}
        <SectionHeader number="8" title="USE OF EQUIPMENT AND RENTER'S RESPONSIBILITY" />
        <ContractText>
          The Renter agrees to use the Equipment for its intended use. Any use outside of its
          intended use will result in additional fees. It is the Renter's responsibility to
          maintain the Equipment in accordance with industry standards. The Equipment shall
          remain the property of the Owner and must be returned in the same condition as the
          start of the term.
        </ContractText>

        {/* 9 */}
        <SectionHeader number="9" title="REPAIRS" />
        <ContractText>
          If the Equipment ceases to function at no fault of the Renter, the Owner agrees to
          either replace the Equipment with an equal unit or refund the full rental amount. No
          lease payment is owed by the Renter during any exchange or repair period.
        </ContractText>

        {/* 10 */}
        <SectionHeader number="10" title="DEFAULT / LEGAL RECOURSE" />
        <ContractText>
          In the event of Default or failure to return equipment, SPACE HASH may terminate this
          Agreement and take possession of the Equipment. If repossession, collection agencies,
          or attorney services are required to recover equipment or payments, the Renter will
          pay all associated costs.
        </ContractText>

        {/* 11 */}
        <SectionHeader number="11" title="INDEMNIFICATION" />
        <ContractText>
          The Renter shall indemnify and hold the Owner harmless from any loss, damage, or
          expense arising from the Renter's possession, use, or misuse of the Equipment.
        </ContractText>

        {/* 12 */}
        <SectionHeader number="12" title="ENTIRE AGREEMENT" />
        <ContractText>
          This Agreement constitutes a legal contract between the Owner and the Renter. I, the
          renter, have read and understand the above terms. I understand that my agreement makes
          me responsible for the full replacement value of the listed items if they are lost,
          stolen, or damaged in any way. I agree that the gear will be returned in the exact
          condition received, and I agree to pay any additional fees charged upon return and
          inspection.
        </ContractText>

        {/* 13 */}
        <SectionHeader number="13" title="GOVERNING LAW" />
        <ContractText>
          This Agreement shall be governed under the laws of the State of New Mexico.
        </ContractText>

        {/* 14 — only shown if renter left comments */}
        {comments && (
          <>
            <SectionHeader number="14" title="ADDITIONAL TERMS, CONDITIONS, OR COMMENTS" />
            <ContractField value={comments} subtitle="Additional comments from renter" />
          </>
        )}

      </Box>

      {/* ── Sticky footer ── */}
      <Box
        sx={{
          flexShrink: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: 2,
          mt: 1,
        }}
      >
        {formState.errors && formState.errors.length > 0 && (
          <Typography variant="body2" color="error" sx={{ mb: 1.5 }}>
            Submission failed — please try again.
          </Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed.agreed}
              onChange={() => toggle('agreed')}
              color="primary"
            />
          }
          label="I have read and agree to the terms of this Equipment Rental Agreement"
          sx={{ mb: 1.5, alignItems: 'center' }}
        />

        {/* Hidden form — Formspree reads field names from actual inputs */}
        <form onSubmit={handleFormspreeSubmit} style={{ display: 'none' }} id="formspree-contract">
          <input name="name"            defaultValue={name} />
          <input name="email"           defaultValue={contactInfo || ''} />
          <input name="phone"           defaultValue={phone} />
          <input name="address"         defaultValue={address} />
          <input name="business"        defaultValue={business || ''} />
          <input name="contract_date"   defaultValue={contractDate} />
          <input name="rental_dates"    defaultValue={sortedDates.join(', ')} />
          <input name="total"           defaultValue={`$${grandTotal}`} />
          <textarea name="booking_summary" defaultValue={bookingSummary} />
          <input name="comments"        defaultValue={comments || ''} />
          <input name="agreed"          defaultValue="yes" />
        </form>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={onBack} disabled={formState.submitting}>
            Back
          </Button>
          <Button
            variant="contained"
            disabled={!allConfirmed || formState.submitting}
            onClick={() => document.getElementById('formspree-contract').requestSubmit()}
            startIcon={formState.submitting ? <CircularProgress size={16} /> : null}
          >
            {formState.submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </Box>
      </Box>

    </Box>
  );
}

export default ContractReviewStep;
