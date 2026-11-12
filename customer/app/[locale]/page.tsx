'use client';

import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '@/lib/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const tMsg = useTranslations('msg');
  const locale = useLocale();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [heroProducts, setHeroProducts] = useState<any[]>([]); //3 sản phẩm đầu tiên để ghép ảnh ở banner, chỉ lấy 1 lần

  //gọi lại API mỗi khi đổi trang hoặc đổi danh mục
  useEffect(() => {
    getProducts({ page, limit: 8, category_id: selectedCategory }).then(res => {
      if (res && Array.isArray(res.data)) {
        setProducts(res.data);
        setTotalPages(res.totalPages);
        setHeroProducts(prev => prev.length ? prev : res.data.slice(0, 3));
      }
    });
  }, [page, selectedCategory]);

  //danh mục chỉ cần lấy 1 lần
  useEffect(() => {
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
    window.dispatchEvent(new Event('cart-updated'));
    toast.success(tMsg('addedToCart', { name: product.name }));
  };

  const tabClass = (active: boolean) =>
    `shrink-0 whitespace-nowrap h-9 px-4 rounded-lg text-sm inline-flex items-center gap-2 transition-colors ${active
      ? 'bg-accent text-on-accent'
      : 'text-fg-2 hover:bg-raised hover:text-fg'}`;

  //mỗi danh mục/sản phẩm lấy 1 màu "vải" theo id (xoay vòng 5 màu) -> cùng 1 sản phẩm luôn cùng màu ở mọi trang
  const swatch = (i: number) => `var(--swatch-${(i % 5) + 1})`;
  const dot = (i: number) => `var(--dot-${(i % 5) + 1})`;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <section className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl bg-hero text-hero-fg mb-16">
        <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
          <h1 className="font-serif text-4xl md:text-5xl font-normal leading-[1.08] tracking-tight">{t('heroTitle')}</h1>
          <p className="text-hero-fg-2 text-lg leading-relaxed max-w-md">{t('heroText')}</p>
          <a href="#products" className="inline-flex h-11 w-fit items-center rounded-lg bg-hero-fg px-5 font-medium text-hero transition-opacity hover:opacity-90">
            {t('heroCta')}
          </a>
        </div>
        {heroProducts.length > 0 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 p-2 h-80 md:h-auto md:min-h-96">
            {heroProducts.map((product: any, i: number) => (
              <Link
                key={product.id}
                href={`/${locale}/product/${product.id}`}
                className={`overflow-hidden rounded-2xl ${i === 0 ? 'row-span-2' : ''}`}
                style={{ backgroundColor: swatch(product.id) }}
              >
                <Image src={product.image_url} alt={product.name} width={500} height={600} className="h-full w-full object-cover" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <h2 id="products" className="font-serif text-4xl font-normal tracking-tight mb-6 scroll-mt-24">{t('products')}</h2>

      <div className="flex gap-1 mb-10 overflow-x-auto pb-1 border-b border-line">
        <button
          onClick={() => { setSelectedCategory(null); setPage(1); }}
          className={`${tabClass(selectedCategory === null)} mb-3`}
        >
          {t('all')}
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
            className={`${tabClass(selectedCategory === cat.id)} mb-3`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: selectedCategory === cat.id ? 'currentColor' : dot(cat.id) }}
            />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {products.map((product: any) => (
          <div key={product.id} className="group flex flex-col">
            <Link href={`/${locale}/product/${product.id}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-xl mb-3" style={{ backgroundColor: swatch(product.id) }}>
                <Image src={product.image_url} alt={product.name} width={400} height={500} className="h-full w-full object-cover" />
              </div>
              <h3 className="text-sm text-fg line-clamp-2 group-hover:underline underline-offset-4 decoration-fg-3">{product.name}</h3>
            </Link>
            <p className="font-mono text-sm text-fg-2 tabular-nums mt-1 mb-3">{product.price.toLocaleString()}đ</p>
            <button
              onClick={() => addToCart(product)}
              className="btn-secondary mt-auto w-full text-xs sm:text-sm">
              {t('addToCart')}
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-16">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            aria-label="Trang trước"
            className="h-9 w-9 rounded-lg text-fg-2 hover:bg-raised disabled:opacity-40 disabled:hover:bg-transparent"
          >
            &laquo;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((soTrang) => (
            <button
              key={soTrang}
              onClick={() => setPage(soTrang)}
              className={`h-9 w-9 rounded-lg font-mono text-sm tabular-nums transition-colors ${page === soTrang
                ? 'bg-accent text-on-accent'
                : 'text-fg-2 hover:bg-raised'}`}
            >
              {soTrang}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Trang sau"
            className="h-9 w-9 rounded-lg text-fg-2 hover:bg-raised disabled:opacity-40 disabled:hover:bg-transparent"
          >
            &raquo;
          </button>
        </div>
      )}
    </main>
  );
}
