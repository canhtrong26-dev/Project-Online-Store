'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useTranslations, useLocale } from 'next-intl';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('header');

  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(count);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Đăng xuất thành công!');
    router.push(`/${locale}`);
  };

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-3xl font-bold text-green-600">
          Online Store
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href={`/${locale}`} className="text-gray-600 dark:text-gray-300 hover:text-green-600">
            {t('home')}
          </Link>
          <Link href={`/${locale}/order`} className="text-gray-600 dark:text-gray-300 hover:text-green-600">
            {t('order')}
          </Link>
          {user ? (
            <>
              <span className="text-green-600 font-medium">{t('hello')}, {user.name}!</span>
              <button aria-label="Đăng xuất" onClick={handleLogout} className="text-red-500 hover:text-red-700">
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/login`} className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                {t('login')}
              </Link>
              <Link href={`/${locale}/register`} className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                {t('register')}
              </Link>
            </>
          )}
          <button
            aria-label="Chuyển ngôn ngữ"
            onClick={() => switchLocale(locale === 'vi' ? 'en' : 'vi')}
            className="text-sm font-medium border border-gray-300 dark:border-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:text-green-600"
          >
            {locale === 'vi' ? 'EN' : 'VI'}
          </button>
          <button
            aria-label="Chuyển đổi giao diện sáng/tối"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-xl text-gray-600 dark:text-yellow-400 hover:text-green-600"
          >
            {mounted ? (theme === 'dark' ? <BsSun /> : <BsMoon />) : <BsMoon />}
          </button>
        </nav>
        <Link href={`/${locale}/cart`} className="text-gray-600 dark:text-gray-300 flex items-center hover:text-green-600">
          <Image src="/images/shopping-cart.png" alt="Giỏ hàng" width={20} height={20} className="mr-2" />
          {t('cart')} {cartCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
}