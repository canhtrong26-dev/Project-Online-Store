'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { BsGithub, BsEnvelope, BsGeoAlt } from 'react-icons/bs';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const headingClass = 'text-sm font-medium text-hero-fg mb-4';
  const linkClass = 'text-hero-fg-2 hover:text-hero-fg transition-colors';
  const socialClass =
    'w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-hero-fg-2 hover:text-on-accent hover:bg-accent hover:border-transparent transition-colors';

  return (
    <footer className="bg-espresso text-hero-fg mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link href={`/${locale}`} className="text-lg font-semibold">
            Online Store
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-hero-fg-2">
            {t('description')}
          </p>
          <div className="flex gap-2 mt-5">
            <a
              href="https://github.com/canhtrong26-dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={socialClass}
            >
              <BsGithub size={16} />
            </a>
            <a
              href="mailto:canhtrong26@gmail.com"
              aria-label="Email"
              className={socialClass}
            >
              <BsEnvelope size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className={headingClass}>{t('links')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/${locale}`} className={linkClass}>{t('home')}</Link></li>
            <li><Link href={`/${locale}/cart`} className={linkClass}>{t('cart')}</Link></li>
            <li><Link href={`/${locale}/order`} className={linkClass}>{t('order')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>{t('contact')}</h4>
          <ul className="space-y-3 text-sm text-hero-fg-2">
            <li className="flex items-center gap-2">
              <BsEnvelope size={16} className="text-accent shrink-0" />
              <span className="break-all">canhtrong26@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <BsGeoAlt size={16} className="text-accent shrink-0" />
              <span>{t('address')}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>{t('map')}</h4>
          <iframe
            src="https://www.google.com/maps?q=21.0277644,105.8341598&z=12&output=embed"
            title={t('map')}
            className="w-full h-44 rounded-xl border border-white/10"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-hero-fg-2/70">
          <span>© 2026 Online Store. {t('rights')}</span>
          <span>{t('copyright')}</span>
        </div>
      </div>
    </footer>
  );
}
