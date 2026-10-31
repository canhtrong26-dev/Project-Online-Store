'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));

    // Lấy số lượng sản phẩm trong giỏ
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
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link href="/" className="text-3xl font-bold text-green-600">
          Online Store
        </Link>

        <nav className="flex gap-6 items-center">
          <Link href="/" className="text-gray-600 hover:text-green-600">
            Trang chủ
          </Link>
          <Link href="/order" className="text-gray-600 hover:text-green-600">
            Đơn hàng
          </Link>
          {user ? (
            <>
              <span className="text-green-600 font-medium">Xin chào, {user.name}!</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-green-600">
                Đăng nhập
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-green-600">
                Đăng ký
              </Link>
            </>
          )}
        </nav>

        <Link href="/cart" className="text-gray-600 flex items-center hover:text-green-600">
          <Image
            src="/images/shopping-cart.png"
            alt="Giỏ hàng"
            width={20}
            height={20}
            className="mr-2"
          />
          Giỏ hàng {cartCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">{cartCount}</span>}
        </Link>

      </div>
    </header>
  );
}