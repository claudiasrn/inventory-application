function formatRelativeDate(date) {
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("de-DE");
}

module.exports = { formatRelativeDate };