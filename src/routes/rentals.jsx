import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useForm } from '@formspree/react';
import { parseCSV, parseReservationsCSV, parseUnavailableCSV } from '../utils/csv';
import equipmentCsvUrl from '../resources/equipment.csv';
import reservationsCsvUrl from '../resources/reservations.csv';
import unavailableCsvUrl from '../resources/unavailable.csv';
import RedesignCalendar from '../components/redesign/RedesignCalendar';
import GearPanel from '../components/redesign/GearPanel';
import SelectionsList from '../components/redesign/SelectionsList';
import ContactStep, { isContactValid } from '../components/redesign/ContactStep';
import ContractStep from '../components/redesign/ContractStep';
import ConfirmationStep from '../components/redesign/ConfirmationStep';
import NavActions from '../components/redesign/NavActions';

const EMPTY_FORM = {
  name: '',
  business: '',
  address: '',
  phone: '',
  email: '',
  comments: '',
};

export default function RentalsPage() {
  const [equipment, setEquipment] = useState([]);
  const [reservations, setReservations] = useState({});
  const [unavailableDates, setUnavailableDates] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [activeDate, setActiveDate] = useState(null);
  const [dateSelections, setDateSelections] = useState({});
  const [form, setForm] = useState(EMPTY_FORM);

  const [formState, handleFormspreeSubmit] = useForm('xykbevyk');

  useEffect(() => {
    Promise.all([
      fetch(equipmentCsvUrl).then((r) => r.text()),
      fetch(reservationsCsvUrl).then((r) => r.text()),
      fetch(unavailableCsvUrl).then((r) => r.text()),
    ])
      .then(([eq, rs, un]) => {
        setEquipment(parseCSV(eq));
        setReservations(parseReservationsCSV(rs));
        setUnavailableDates(parseUnavailableCSV(un));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  const isDateUnavailable = (dateToCheck) => {
    if (!dateToCheck || equipment.length === 0) return false;
    const dateStr = dayjs(dateToCheck).format('YYYY-MM-DD');
    if (unavailableDates.has(dateStr)) return true;
    const dayRes = reservations[dateStr];
    if (!dayRes) return false;
    return equipment.every((item) => (dayRes[item.name] || 0) >= item.maxQty);
  };

  const handleSelectDay = (ymd) => {
    setDateSelections((prev) => {
      const copy = { ...prev };
      if (activeDate && activeDate !== ymd) {
        const prevQtys = copy[activeDate];
        if (prevQtys && !Object.values(prevQtys).some((q) => q > 0)) {
          delete copy[activeDate];
        }
      }
      if (!copy[ymd]) {
        copy[ymd] = Object.fromEntries(equipment.map((e) => [e.name, 0]));
      }
      return copy;
    });
    setActiveDate(ymd);
  };

  const handleChangeQty = (name, qty) => {
    if (!activeDate) return;
    setDateSelections((prev) => {
      const next = { ...(prev[activeDate] || {}), [name]: qty };
      const hasAny = Object.values(next).some((v) => v > 0);
      const copy = { ...prev };
      if (hasAny) copy[activeDate] = next;
      else delete copy[activeDate];
      return copy;
    });
  };

  const handleRemoveDate = (ymd) => {
    setDateSelections((prev) => {
      const copy = { ...prev };
      delete copy[ymd];
      return copy;
    });
    if (activeDate === ymd) setActiveDate(null);
  };

  const totals = useMemo(() => {
    let days = 0;
    let subtotal = 0;
    let items = 0;
    for (const [, qs] of Object.entries(dateSelections)) {
      let dayHas = false;
      for (const [n, q] of Object.entries(qs)) {
        if (q > 0) {
          dayHas = true;
          items += q;
          const eq = equipment.find((e) => e.name === n);
          if (eq) subtotal += q * eq.cost;
        }
      }
      if (dayHas) days++;
    }
    return { days, subtotal, items };
  }, [dateSelections, equipment]);

  const hasAnyGear = Object.values(dateSelections).some((qs) =>
    Object.values(qs).some((q) => q > 0),
  );

  const resetAll = () => {
    setDateSelections({});
    setForm(EMPTY_FORM);
    setActiveDate(null);
    setStep(0);
  };

  if (loading) {
    return (
      <div className="rentals">
        <div className="rentals-loading">loading gear data</div>
      </div>
    );
  }

  const effectiveStep = formState.succeeded ? 3 : step;

  return (
    <div className="rentals">
      {effectiveStep === 0 && (
        <>
          <div className="rentals-grid">
            <RedesignCalendar
              equipment={equipment}
              reservations={reservations}
              dateSelections={dateSelections}
              activeDate={activeDate}
              isDateUnavailable={isDateUnavailable}
              onSelectDay={handleSelectDay}
            />
            <div className="rentals-right">
              <GearPanel
                equipment={equipment}
                activeDate={activeDate}
                quantitiesForDate={activeDate ? dateSelections[activeDate] : null}
                onChangeQty={handleChangeQty}
                reservations={reservations}
              />
              <SelectionsList selections={dateSelections} onRemove={handleRemoveDate} />
            </div>
          </div>

          <div className="totals-summary standalone">
            {totals.days} DAYS · {totals.items} ITEMS · SUBTOTAL{' '}
            <span className="sub">${totals.subtotal}</span>
          </div>

          <NavActions>
            <button
              type="button"
              className="btn primary"
              disabled={!hasAnyGear}
              onClick={() => setStep(1)}
            >
              ≫ NEXT / CONTACT
            </button>
          </NavActions>
        </>
      )}

      {effectiveStep === 1 && (
        <ContactStep
          form={form}
          setForm={setForm}
          onBack={() => setStep(0)}
          onNext={() => {
            if (isContactValid(form)) setStep(2);
          }}
        />
      )}

      {effectiveStep === 2 && (
        <ContractStep
          form={form}
          dateSelections={dateSelections}
          equipment={equipment}
          formState={formState}
          handleFormspreeSubmit={handleFormspreeSubmit}
          onBack={() => setStep(1)}
        />
      )}

      {effectiveStep === 3 && (
        <ConfirmationStep form={form} totals={totals} onReset={resetAll} />
      )}
    </div>
  );
}
