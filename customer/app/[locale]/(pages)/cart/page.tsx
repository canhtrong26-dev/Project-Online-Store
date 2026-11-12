"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import { BsBag, BsDash, BsPlus, BsX } from "react-icons/bs";

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

  const qtyBtnClass =
    "w-8 h-8 flex items-center justify-center text-fg-2 hover:bg-raised hover:text-fg transition-colors";

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-serif text-4xl font-normal tracking-tight mb-8">{t("title")}</h1>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface text-center py-16 px-4">
          <BsBag size={24} className="mx-auto mb-4 text-fg-3" />
          <p className="text-fg-2 mb-6">{t("empty")}</p>
          <Link href={`/${locale}`} className="btn-primary">
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-line bg-surface divide-y divide-line">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={80}
                  height={100}
                  className="w-20 h-25 shrink-0 object-cover"
                  style={{ backgroundColor: `var(--swatch-${(item.id % 5) + 1})` }}
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-fg truncate">{item.name}</h3>
                      <p className="font-mono text-sm text-fg-3 tabular-nums mt-1">
                        {item.price.toLocaleString()}đ
                      </p>
                    </div>
                    <button
                      aria-label="Xóa sản phẩm"
                      onClick={() => remove(item.id)}
                      className="shrink-0 w-8 h-8 flex items-center justify-center text-fg-3 hover:bg-raised hover:text-negative transition-colors"
                    >
                      <BsX size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-line">
                      <button
                        aria-label="Giảm số lượng"
                        onClick={() => decrease(item.id)}
                        className={qtyBtnClass}
                      >
                        <BsDash size={16} />
                      </button>
                      <span className="w-8 text-center font-mono text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        aria-label="Tăng số lượng"
                        onClick={() => increase(item.id)}
                        className={qtyBtnClass}
                      >
                        <BsPlus size={16} />
                      </button>
                    </div>
                    <p className="font-mono text-fg tabular-nums">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="flex items-baseline gap-3">
              <span className="text-fg-2">{t("total")}</span>
              <span className="font-mono text-2xl font-medium tabular-nums">
                {total.toLocaleString()}đ
              </span>
            </p>
            <Link href={`/${locale}/checkout`} className="btn-primary">
              {t("checkout")}
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
