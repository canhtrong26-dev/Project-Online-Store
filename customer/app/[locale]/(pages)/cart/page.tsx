"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";

export default function CartPage() {
  const t = useTranslations("cart");
  const tMsg = useTranslations("msg");
  const locale = useLocale();
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const increase = (id: number) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated")); //ra tín hiệu để cập nhật số lượng giỏ hàng trên Header
  };

  const decrease = (id: number) => {
    const newCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated")); //ra tín hiệu để cập nhật số lượng giỏ hàng trên Header
  };

  const remove = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated")); //ra tín hiệu để cập nhật số lượng giỏ hàng trên Header

    toast.success(tMsg("removedItem"));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">{t("title")}</h1>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t("empty")}</p>
          <Link
            href={`/${locale}`}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 shrink-0 rounded object-cover"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold dark:text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-green-600 text-sm">
                        {item.price.toLocaleString()}đ
                      </p>
                    </div>
                    <button
                      aria-label="Xóa sản phẩm"
                      onClick={() => remove(item.id)}
                      className="shrink-0 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrease(item.id)}
                        className="w-8 h-8 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                      >
                        -
                      </button>
                      <span className="w-6 text-center dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increase(item.id)}
                        className="w-8 h-8 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold dark:text-white">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="text-xl font-bold dark:text-white">
              {t("total")}: {total.toLocaleString()}đ
            </p>
            <Link
              href={`/${locale}/checkout`}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 text-center"
            >
              {t("checkout")}
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
