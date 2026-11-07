'use client';

import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '@/lib/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    getProducts().then(data => {
      if (Array.isArray(data)) setProducts(data);
    }); 
    getCategories().then(data => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(<p>Đã thêm <b>{product.name}</b> vào giỏ hàng!</p>);
  };

  return (
    <main className="max-w-full mx-auto px-4 md:px-20 py-8 dark:bg-gray-900 min-h-screen">
      <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full ${selectedCategory === null
            ? 'bg-green-500 text-white'
            : 'bg-green-100 text-green-700 dark:bg-gray-700 dark:text-green-400'}`}
        >
          {t('all')}
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full ${selectedCategory === cat.id
              ? 'bg-green-500 text-white'
              : 'bg-green-100 text-green-700 dark:bg-gray-700 dark:text-green-400'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('products')}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products
          .filter((product: any) => selectedCategory === null || product.category_id === selectedCategory)
          .map((product: any) => (
            <div key={product.id} className="flex flex-col border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow transition-transform transform-[900ms] hover:-translate-y-1">
              <Link href={`/${locale}/product/${product.id}`}>
                <Image src={product.image_url} alt={product.name} width={300} height={160} className="w-full h-26 sm:h-40 object-cover rounded-sm mb-2" />
                <h3 className="font-semibold text-sm sm:text-lg hover:text-green-600 dark:text-white line-clamp-2">{product.name}</h3>
              </Link>
              <p className="text-green-600 pb-3 text-sm mt-1">{product.price.toLocaleString()}đ</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-auto pt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 text-xs sm:text-sm">
                {t('addToCart')}
              </button>
            </div>
          ))}
      </div>
    </main>
  );
}