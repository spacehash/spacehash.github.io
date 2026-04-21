import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const pad = (n) => String(n).padStart(2, '0');

export default function RedesignCalendar({
  equipment,
  reservations,
  dateSelections,
  activeDate,
  isDateUnavailable,
  onSelectDay,
}) {
  const today = dayjs();
  const [viewMonth, setViewMonth] = useState(today.month());
  const [viewYear, setViewYear] = useState(today.year());

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    const out = [];
    for (let i = 0; i < firstDay; i++) {
      out.push({ out: true, day: prevMonthDays - firstDay + 1 + i, ymd: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ out: false, day: d, ymd: `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}` });
    }
    while (out.length < 42) {
      out.push({ out: true, day: out.length - firstDay - daysInMonth + 1, ymd: null });
    }
    return out;
  }, [viewMonth, viewYear]);

  const changeMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const remainingFor = (ymd, name, maxQty) => {
    const r = reservations[ymd] || {};
    return Math.max(0, maxQty - (r[name] || 0));
  };

  const todayStr = today.format('YYYY-MM-DD');

  return (
    <div className="chart">
      <div className="chart-head">
        <div className="month">
          {MONTHS[viewMonth]} <em>{viewYear}</em>
        </div>
        <div className="chart-nav">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="previous month">◀</button>
          <button type="button" onClick={() => changeMonth(1)} aria-label="next month">▶</button>
        </div>
      </div>

      <div className="chart-dow">
        {DOW.map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="chart-days">
        {cells.map((c, i) => {
          if (c.out) return <div key={i} className="day out"><span className="num">{c.day}</span></div>;
          const unav = isDateUnavailable(c.ymd);
          const selected = !!dateSelections[c.ymd];
          const isActive = activeDate === c.ymd;
          const isToday = c.ymd === todayStr;

          return (
            <div
              key={i}
              className={`day ${unav ? 'unav' : ''} ${selected ? 'selected' : ''} ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => !unav && onSelectDay(c.ymd)}
              title={c.ymd}
            >
              <span className="num">{c.day}</span>
              {!unav && (
                <div className="gear-dots">
                  {equipment.map((item, idx) => {
                    const remaining = remainingFor(c.ymd, item.name, item.maxQty);
                    return (
                      <div key={item.name} className={`dot-row idx-${idx}`}>
                        <span className="label">{item.name}</span>
                        {Array.from({ length: remaining }).map((_, k) => (
                          <span key={k} className={`dot idx-${idx}`} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="chart-legend">
        <span><span className="sw idx-0" /> CDJ</span>
        <span><span className="sw idx-1" /> DJM</span>
        <span><span className="sw idx-2" /> RX3</span>
        <span style={{ marginLeft: 'auto' }}>● = REMAINING</span>
      </div>
    </div>
  );
}
