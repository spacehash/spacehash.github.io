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
