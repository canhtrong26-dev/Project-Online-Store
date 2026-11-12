"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { BsSun, BsMoon, BsList, BsX, BsCart3 } from "react-icons/bs";
import { useTranslations, useLocale } from "next-intl";
import { logout } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("header");
  const tMsg = useTranslations("msg");

  const [user, setUser] = useState<any>(null); // thông tin user đang đăng nhập (lấy từ localStorage), null = chưa đăng nhập
  const [cartCount, setCartCount] = useState(0); // số sản phẩm trong giỏ hàng, hiện badge đỏ cạnh nút Giỏ hàng
  const [mounted, setMounted] = useState(false); // true khi component đã chạy trên trình duyệt -> tránh lệch icon sáng/tối giữa server và client
  const [menuOpen, setMenuOpen] = useState(false); // trạng thái mở/đóng menu hamburger trên điện thoại/màn hình nhỏ
  const { theme, setTheme } = useTheme();


//cập nhât real time số lượng sp ở giỏ hàng khi user tác động lên các trang khác (thêm/xóa sp, đặt hàng thành công) 
  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));

    //công thức đếm lại số sản phẩm trong giỏ, gọi lại mỗi khi giỏ thay đổi
    const demLaiGio = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    demLaiGio(); //đếm lần đầu lúc mở trang

    //nghe tín hiệu 'cart-updated' do các trang khác phát ra
    window.addEventListener('cart-updated', demLaiGio);
    return () => window.removeEventListener('cart-updated', demLaiGio); //rời trang thì không cần chạy demLaiGio
  }, []);

    


  const handleLogout = async () => {
    try {
      await logout(); //xóa session (refreshToken) trong db
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      toast.success(tMsg("logoutSuccess"));
      router.push(`/${locale}`);
    }
  };

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-2xl md:text-3xl font-bold text-green-600"
        >
          Online Store
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href={`/${locale}`}
            className="text-gray-600 dark:text-gray-300 hover:text-green-600"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/order`}
            className="text-gray-600 dark:text-gray-300 hover:text-green-600"
          >
            {t("order")}
          </Link>
          {user ? (
            <>
              <span className="text-green-600 font-medium">
                {t("hello")}, {user.name}!
              </span>
              <button
                aria-label="Đăng xuất"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/login`}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600"
              >
                {t("register")}
              </Link>
            </>
          )}
          <button
            aria-label="Chuyển ngôn ngữ"
            onClick={() => switchLocale(locale === "vi" ? "en" : "vi")}
            className="text-sm font-medium border border-gray-300 dark:border-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:text-green-600"
          >
            {locale === "vi" ? "EN" : "VI"}
          </button>
          <button
            aria-label="Chuyển đổi giao diện sáng/tối"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-xl text-gray-600 dark:text-yellow-400 hover:text-green-600"
          >
            {mounted ? theme === "dark" ? <BsSun /> : <BsMoon /> : <BsMoon />}
          </button>
        </nav>
        <Link
          href={`/${locale}/cart`}
          className="hidden md:flex text-gray-600 dark:text-gray-300 items-center hover:text-green-600"
        >
          <Image
            src="/images/shopping-cart.png"
            alt="Giỏ hàng"
            width={20}
            height={20}
            className="mr-2"
          />
          {t("cart")}{" "}
          {cartCount > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          )}
        </Link>
        <div className="flex md:hidden items-center gap-4">
          <Link
            href={`/${locale}/cart`}
            aria-label="Giỏ hàng"
            className="relative text-gray-600 dark:text-gray-300 hover:text-green-600"
          >
            <BsCart3 size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Mở menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-green-600"
          >
            {menuOpen ? <BsX size={28} /> : <BsList size={28} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col gap-4">
          <Link
            href={`/${locale}`}
            onClick={closeMenu}
            className="text-gray-600 dark:text-gray-300 hover:text-green-600"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/order`}
            onClick={closeMenu}
            className="text-gray-600 dark:text-gray-300 hover:text-green-600"
          >
            {t("order")}
          </Link>
          {user ? (
            <>
              <span className="text-green-600 font-medium">
                {t("hello")}, {user.name}!
              </span>
              <button
                aria-label="Đăng xuất"
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="text-left text-red-500 hover:text-red-700"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/login`}
                onClick={closeMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/register`}
                onClick={closeMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600"
              >
                {t("register")}
              </Link>
            </>
          )}
          <div className="flex items-center gap-4">
            <button
              aria-label="Chuyển ngôn ngữ"
              onClick={() => {
                switchLocale(locale === "vi" ? "en" : "vi");
                closeMenu();
              }}
              className="text-sm font-medium border border-gray-300 dark:border-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:text-green-600"
            >
              {locale === "vi" ? "EN" : "VI"}
            </button>
            <button
              aria-label="Chuyển đổi giao diện sáng/tối"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-xl text-gray-600 dark:text-yellow-400 hover:text-green-600"
            >
              {mounted ? theme === "dark" ? <BsSun /> : <BsMoon /> : <BsMoon />}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
