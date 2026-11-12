'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyOrders } from '@/lib/api';
import toast from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';

export default function OrderPage() {
  const router = useRouter();
  const t = useTranslations('order');
  const tMsg = useTranslations('msg');
  const locale = useLocale();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error(tMsg('pleaseLogin'));
      router.push(`/${locale}/login`);
      return;
    }
    const fetchOrders = async () => {
      const data = await getMyOrders(token);
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        toast.error(tMsg('somethingWrong'));
      }
    };
    fetchOrders();
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-serif text-4xl font-normal tracking-tight mb-8">{t('title')}</h1>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface text-center text-fg-2 py-16 px-4">{t('empty')}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">
                  {t('order')} <span className="font-mono text-fg-2">#{order.id}</span>
                </span>
                <span className="font-mono text-xs text-fg-3 tabular-nums">
                  {new Date(order.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                </span>
              </div>
              {order.OrderItems.map((item: any) => (
                <div key={item.id} className="flex justify-between gap-4 py-2 text-sm border-b border-line">
                  <span className="text-fg">
                    {item.Product.name}{' '}
                    <span className="font-mono text-fg-3">×{item.quantity}</span>
                  </span>
                  <span className="font-mono text-fg-2 tabular-nums">{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4">
                <span className="flex items-center gap-2 text-sm text-fg-2">
                  <span className={`h-2 w-2 rounded-full ${order.status === 'pending' ? 'bg-accent' : 'bg-positive'}`} />
                  {order.status === 'pending' ? t('pending') : t('completed')}
                </span>
                <span className="flex items-baseline gap-3">
                  <span className="text-sm text-fg-2">{t('total')}</span>
                  <span className="font-mono font-medium tabular-nums">{Number(order.total).toLocaleString()}đ</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
