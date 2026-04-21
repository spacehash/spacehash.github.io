import { useEffect, useState } from 'react';
import { parseCSV } from '../utils/csv';
import reservationsCsvUrl from '../resources/reservations.csv';
import equipmentCsvUrl from '../resources/equipment.csv';

const UPTIME_START = new Date(2024, 3, 4, 0, 0, 0);

function computeUptime(now) {
  let years = now.getFullYear() - UPTIME_START.getFullYear();
  let months = now.getMonth() - UPTIME_START.getMonth();
  let days = now.getDate() - UPTIME_START.getDate();
  let hours = now.getHours() - UPTIME_START.getHours();
  let minutes = now.getMinutes() - UPTIME_START.getMinutes();
  let seconds = now.getSeconds() - UPTIME_START.getSeconds();

  if (seconds < 0) { seconds += 60; minutes -= 1; }
  if (minutes < 0) { minutes += 60; hours -= 1; }
  if (hours < 0) { hours += 24; days -= 1; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) { months += 12; years -= 1; }

  return `${years}y ${months}mo ${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function AboutPage() {
  const [runsLogged, setRunsLogged] = useState(null);
  const [maxPayload, setMaxPayload] = useState(null);
  const [uptime, setUptime] = useState(() => computeUptime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setUptime(computeUptime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch(reservationsCsvUrl)
      .then((r) => r.text())
      .then((text) => {
        const lines = text.trim().split('\n').slice(1).filter((l) => l.trim());
        setRunsLogged(lines.length);
      })
      .catch(() => setRunsLogged(0));

    fetch(equipmentCsvUrl)
      .then((r) => r.text())
      .then((text) => {
        const items = parseCSV(text);
        setMaxPayload(items.map((i) => `${i.maxQty}×${i.name}`).join(' / '));
      })
      .catch(() => setMaxPayload('—'));
  }, []);

  return (
    <div className="phone-column about">
      <div className="about-grid">
        <div>
          <div className="about-kicker">DOSSIER // 001</div>
          <div className="about-body" style={{ marginTop: 28 }}>
            <p>
              Your DJs need gear. I got it.
            </p>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-label">// STATION LOG</div>
            <div className="stat-row"><span className="k">node</span><span className="v">albuquerque.nm</span></div>
            <div className="stat-row"><span className="k">uptime</span><span className="v">{uptime}</span></div>
            <div className="stat-row"><span className="k">runs logged</span><span className="v pink">{runsLogged ?? '—'}</span></div>
            <div className="stat-row"><span className="k">max payload</span><span className="v">{maxPayload ?? '—'}</span></div>
            <div className="stat-row"><span className="k">bpm bias</span><span className="v">150–170</span></div>
            <div className="stat-row"><span className="k">refunds</span><span className="v">0</span></div>
          </div>

          <div className="card">
            <div className="card-label">// UPLINK</div>
            <div className="contact-chips">
              <a
                className="chip"
                href="https://links.donniemp3.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                DONNIE ↗
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-label">// RULES.TXT</div>
            <ol style={{ margin: 0, padding: '4px 0 0 22px', fontFamily: 'var(--f-mono)', fontSize: 13, lineHeight: 1.65, color: 'var(--ink)' }}>
              <li>You pick up &amp; drop off</li>
              <li>Payment due 3 days after gear return</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
