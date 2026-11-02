'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(data);
  }, []);

  const increase = (id: number) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const decrease = (id: number) => {
    const newCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const remove = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Đã xóa sản phẩm!');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Giỏ hàng</h1>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Giỏ hàng trống!</p>
          <Link href="/" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b dark:border-gray-700 py-4">
              <Image src={item.image_url} alt={item.name} width={80} height={80} className="rounded object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold dark:text-white">{item.name}</h3>
                <p className="text-green-600">{item.price.toLocaleString()}đ</p>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label={`Giảm số lượng ${item.name}`} onClick={() => decrease(item.id)} className="w-8 h-8 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">-</button>
                <span className="dark:text-white">{item.quantity}</span>
                <button aria-label={`Tăng số lượng ${item.name}`} onClick={() => increase(item.id)} className="w-8 h-8 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">+</button>
              </div>
              <p className="font-bold w-24 text-right dark:text-white">{(item.price * item.quantity).toLocaleString()}đ</p>
              <button aria-label={`Xóa sản phẩm ${item.name} khỏi giỏ hàng`} onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold dark:text-white">Tổng: {total.toLocaleString()}đ</p>
            <Link href="/checkout" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Đặt hàng
            </Link>
          </div>
        </>
      )}
    </main>
  );
}