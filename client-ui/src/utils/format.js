export function formatDate(value) {
  if (!value) return 'Recent';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function asList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
