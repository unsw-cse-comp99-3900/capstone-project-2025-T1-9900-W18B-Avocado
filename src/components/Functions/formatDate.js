export default function formatDate(dateStr) {
  if (!dateStr) return "Invalid Date";

  const fixedStr = dateStr.replace(" ", "T");
  const date = new Date(fixedStr);

  if (isNaN(date)) return "Invalid Date";

  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}