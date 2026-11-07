import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || 'vi';

  if (locale === 'vi') {
    return { locale, messages: (await import('./messages/vi.json')).default };
  } else {
    return { locale, messages: (await import('./messages/en.json')).default };
  }
});