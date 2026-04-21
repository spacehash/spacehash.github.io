export default function GearPanel({
  equipment,
  activeDate,
  quantitiesForDate,
  onChangeQty,
  reservations,
}) {
  const remainingFor = (name, maxQty) => {
    if (!activeDate) return maxQty;
    const r = (reservations[activeDate] || {});
    return Math.max(0, maxQty - (r[name] || 0));
  };

  return (
    <div className="gear-panel">
      <div className="gear-panel-head">
        <span>
          GEAR FOR&nbsp;&nbsp;
          <strong style={{ color: 'var(--riso-cyan)' }}>
            {activeDate || '— PICK A DATE —'}
          </strong>
        </span>
        <span>{activeDate ? 'USD / DAY' : ''}</span>
      </div>

      {equipment.map((item) => {
        const remaining = remainingFor(item.name, item.maxQty);
        const chosen = (quantitiesForDate && quantitiesForDate[item.name]) || 0;
        const disabled = !activeDate;
        const soldOut = !!activeDate && remaining === 0 && chosen === 0;

        return (
          <div key={item.name} className={`gear-card ${soldOut ? 'unav' : ''}`}>
            <div className="gear-meta">
              <div className="gear-name">
                {item.name}
                <span className="gear-rate">${item.cost}<span className="k">/DAY</span></span>
              </div>
            </div>
            <div className="qty-stepper">
              <button
                type="button"
                disabled={disabled || chosen <= 0}
                onClick={() => onChangeQty(item.name, Math.max(0, chosen - 1))}
              >
                −
              </button>
              <span className="val">{chosen}</span>
              <button
                type="button"
                disabled={disabled || chosen >= remaining}
                onClick={() => onChangeQty(item.name, Math.min(remaining, chosen + 1))}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
