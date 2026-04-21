import { useEffect, useState } from 'react';
import { parseCSV } from '../utils/csv';
import reservationsCsvUrl from '../resources/reservations.csv';
import equipmentCsvUrl from '../resources/equipment.csv';

export default function AboutPage() {
  const [runsLogged, setRunsLogged] = useState(null);
  const [maxPayload, setMaxPayload] = useState(null);

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
            <div className="stat-row"><span className="k">uptime</span><span className="v">2026</span></div>
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
