'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { BsGithub, BsEnvelope, BsGeoAlt } from 'react-icons/bs';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link href={`/${locale}`} className="text-2xl font-bold text-green-500">
            Online Store
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            {t('description')}
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href="https://github.com/canhtrong26-dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
            >
              <BsGithub />
            </a>
            <a
              href="mailto:canhtrong26@gmail.com"
              aria-label="Email"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
            >
              <BsEnvelope />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">
            {t('links')}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/${locale}`} className="hover:text-green-500 transition-colors">{t('home')}</Link></li>
            <li><Link href={`/${locale}/cart`} className="hover:text-green-500 transition-colors">{t('cart')}</Link></li>
            <li><Link href={`/${locale}/order`} className="hover:text-green-500 transition-colors">{t('order')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">
            {t('contact')}
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <BsEnvelope className="text-green-500 shrink-0" />
              <span className="break-all">canhtrong26@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <BsGeoAlt className="text-green-500 shrink-0" />
              <span>{t('address')}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">
            {t('map')}
          </h4>
          <iframe
            src="https://www.google.com/maps?q=21.0277644,105.8341598&z=12&output=embed"
            title={t('map')}
            className="w-full h-44 rounded-sm border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between gap-2 text-sm text-gray-500">
          <span>© 2026 Online Store. {t('rights')}</span>
          <span>{t('copyright')}</span>
        </div>
      </div>
    </footer>
  );
}