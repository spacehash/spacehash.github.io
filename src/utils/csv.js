export function parseCSV(text) {
  const lines = text.trim().split('\n');
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      id: index + 1,
      name: values[0],
      description: values[1],
      maxQty: Number.isNaN(parseInt(values[2])) ? 1 : parseInt(values[2]),
      cost: parseFloat(values[3]) || 0,
      value: parseFloat(values[4]) || 0,
    };
  });
}

// Returns { "YYYY-MM-DD": { "CDJ-3000": 2, "DJM-A9": 1 }, ... }
export function parseReservationsCSV(text) {
  const lines = text.trim().split('\n');
  const result = {};
  lines.slice(1).forEach((line) => {
    if (!line.trim()) return;
    const [date, equipmentName, reservedQtyStr] = line.split(',');
    const reservedQty = parseInt(reservedQtyStr) || 0;
    if (!result[date]) result[date] = {};
    result[date][equipmentName] = (result[date][equipmentName] || 0) + reservedQty;
  });
  return result;
}

// Returns a Set of date strings (YYYY-MM-DD) that are unavailable
export function parseUnavailableCSV(text) {
  const lines = text.trim().split('\n');
  const unavailableDates = new Set();
  lines.slice(1).forEach((line) => {
    if (!line.trim()) return;
    const [startDateStr, endDateStr] = line.split(',');
    if (!startDateStr || !endDateStr) return;

    // Parse dates and iterate through range
    const startDate = new Date(startDateStr.trim());
    const endDate = new Date(endDateStr.trim());

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      unavailableDates.add(dateStr);
    }
  });
  return unavailableDates;
}
