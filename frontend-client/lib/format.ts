const DATE_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    if (Object.keys(opts).length > 0) {
      return new Intl.DateTimeFormat('vi-VN', {
        month: opts.month ?? 'long',
        day: opts.day ?? 'numeric',
        year: opts.year ?? 'numeric',
        ...opts,
      }).format(new Date(date));
    }
    return DATE_FORMATTER.format(new Date(date));
  } catch (_err) {
    return '';
  }
}
