"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { BsSun, BsMoon, BsList, BsX, BsBag } from "react-icons/bs";
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

  const linkClass = "text-sm text-fg-2 hover:text-fg transition-colors";
  const iconBtnClass =
    "flex h-9 w-9 items-center justify-center text-fg-3 hover:bg-raised hover:text-fg transition-colors";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:px-6">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold"
        >
          Online Store
        </Link>
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <Link href={`/${locale}`} className={linkClass}>
            {t("home")}
          </Link>
          <Link href={`/${locale}/order`} className={linkClass}>
            {t("order")}
          </Link>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <span className="text-sm text-fg-3">
                {t("hello")}, <span className="text-fg">{user.name}</span>
              </span>
              <button
                aria-label="Đăng xuất"
                onClick={handleLogout}
                className={linkClass}
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/login`} className={linkClass}>
                {t("login")}
              </Link>
              <Link href={`/${locale}/register`} className={linkClass}>
                {t("register")}
              </Link>
            </>
          )}
          <div className="flex items-center gap-1">
            <button
              aria-label="Chuyển ngôn ngữ"
              onClick={() => switchLocale(locale === "vi" ? "en" : "vi")}
              className={`${iconBtnClass} font-mono text-xs`}
            >
              {locale === "vi" ? "EN" : "VI"}
            </button>
            <button
              aria-label="Chuyển đổi giao diện sáng/tối"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={iconBtnClass}
            >
              {mounted ? theme === "dark" ? <BsSun size={16} /> : <BsMoon size={16} /> : <BsMoon size={16} />}
            </button>
          </div>
          <Link
            href={`/${locale}/cart`}
            className="btn-secondary gap-2 text-sm"
          >
            <BsBag size={16} className="text-fg-3" />
            {t("cart")}
            {cartCount > 0 && (
              <span className="font-mono text-xs text-accent tabular-nums">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href={`/${locale}/cart`}
            aria-label="Giỏ hàng"
            className={`${iconBtnClass} relative w-auto gap-1 px-2`}
          >
            <BsBag size={18} />
            {cartCount > 0 && (
              <span className="font-mono text-xs text-accent tabular-nums">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Mở menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className={iconBtnClass}
          >
            {menuOpen ? <BsX size={22} /> : <BsList size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden">
          <Link
            href={`/${locale}`}
            onClick={closeMenu}
            className="flex h-10 items-center text-fg-2 hover:text-fg"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/order`}
            onClick={closeMenu}
            className="flex h-10 items-center text-fg-2 hover:text-fg"
          >
            {t("order")}
          </Link>
          {user ? (
            <>
              <span className="flex h-10 items-center text-fg-3">
                {t("hello")},&nbsp;<span className="text-fg">{user.name}</span>
              </span>
              <button
                aria-label="Đăng xuất"
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex h-10 items-center text-left text-fg-2 hover:text-fg"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/login`}
                onClick={closeMenu}
                className="flex h-10 items-center text-fg-2 hover:text-fg"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/register`}
                onClick={closeMenu}
                className="flex h-10 items-center text-fg-2 hover:text-fg"
              >
                {t("register")}
              </Link>
            </>
          )}
          <div className="mt-2 flex items-center gap-1 border-t border-line pt-3">
            <button
              aria-label="Chuyển ngôn ngữ"
              onClick={() => {
                switchLocale(locale === "vi" ? "en" : "vi");
                closeMenu();
              }}
              className={`${iconBtnClass} font-mono text-xs`}
            >
              {locale === "vi" ? "EN" : "VI"}
            </button>
            <button
              aria-label="Chuyển đổi giao diện sáng/tối"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={iconBtnClass}
            >
              {mounted ? theme === "dark" ? <BsSun size={16} /> : <BsMoon size={16} /> : <BsMoon size={16} />}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
