const views = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });
const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function formatViews(n = 0) {
  return `${views.format(Number(n) || 0)} visitas`;
}

export function timeAgo(date) {
  if (!date) return "";
  const s = (new Date(date) - Date.now()) / 1000;
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, sec] of units) {
    if (Math.abs(s) >= sec) return rtf.format(Math.round(s / sec), unit);
  }
  return "hace un momento";
}