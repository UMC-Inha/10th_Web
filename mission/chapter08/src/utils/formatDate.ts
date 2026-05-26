export function formatDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' },
) {
  return new Date(dateStr).toLocaleDateString('ko-KR', options);
}
