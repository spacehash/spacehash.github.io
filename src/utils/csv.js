export function parseCSV(text) {
  const lines = text.trim().split('\n');
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      id: index + 1,
      name: values[0],
      description: values[1],
      maxQty: parseInt(values[2]) || 1,
      cost: parseFloat(values[3]) || 0,
      value: parseFloat(values[4]) || 0,
    };
  });
}

export function parseUnavailableCSV(text) {
  const lines = text.trim().split('\n');
  return lines.slice(1).map((line) => {
    const [startDate, endDate] = line.split(',');
    return { startDate, endDate };
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
