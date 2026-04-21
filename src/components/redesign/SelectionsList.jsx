export default function SelectionsList({ selections, onRemove }) {
  const entries = Object.entries(selections).filter(([, qs]) =>
    Object.values(qs).some((q) => q > 0),
  );

  return (
    <div className="selections">
      <h3>
        <span>DATES ON HOLD</span>
        <span>{entries.length} SELECTED</span>
      </h3>
      {entries.length === 0 && (
        <div className="empty">— nothing booked yet. tap a date on the chart. —</div>
      )}
      <ul>
        {entries.sort().map(([ymd, qs]) => {
          const summary = Object.entries(qs)
            .filter(([, q]) => q > 0)
            .map(([n, q]) => `${q}× ${n}`)
            .join('  ·  ');
          return (
            <li key={ymd} className="selection-row">
              <span className="date">{ymd}</span>
              <span className="items">{summary}</span>
              <button type="button" className="remove" onClick={() => onRemove(ymd)}>
                REMOVE ×
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
