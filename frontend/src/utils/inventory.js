// inventory.js - handles inventory values/states

// converts incoming inventory values into usable counts
export function count(value) {
  if (value == null || value === '') {
    return null;
  }
  const number = Number(value);
  if (Number.isFinite(number)) {
    return Math.max(0, Math.trunc(number)); // removes fractions and negatives
  } 
  else {
    return null;
  }  
}

// asigns stock status based on count
export function status(n) {
  if (n == null) return 'unknown';
  if (n === 0) return 'empty';
  if (n <= 2) return 'low';
  return 'available';
} 
export function label(s) { // status styling
  return {
    empty: 'Out of stock',
    low: 'Low stock',
    available: 'Available',
    unknown: 'Unknown'
  }[s];
}

// converts the measured_at timestamp from FastAPI into readable date
export function formatTime(value) {
  if (!value) return 'Not yet measured';
  const timestamp = value.endsWith?.('Z') || /[+-]\d\d:\d\d$/.test(value)
    ? value : `${value}Z`;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Unknown update time';
  return date.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
}
