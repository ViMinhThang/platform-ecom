const DATE_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const CUSTOM_DATE_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    if (Object.keys(opts).length > 0) {
      const options = {
        month: opts.month ?? 'long',
        day: opts.day ?? 'numeric',
        year: opts.year ?? 'numeric',
        ...opts,
      };
      const cacheKey = JSON.stringify(options);
      let formatter = CUSTOM_DATE_FORMATTERS.get(cacheKey);
      if (!formatter) {
        formatter = new Intl.DateTimeFormat('vi-VN', options);
        CUSTOM_DATE_FORMATTERS.set(cacheKey, formatter);
      }
      return formatter.format(new Date(date));
    }
    return DATE_FORMATTER.format(new Date(date));
  } catch (_err) {
    return '';
  }
}
