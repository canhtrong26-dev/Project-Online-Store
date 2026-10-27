'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
      
        <Link href="/" className="text-3xl font-bold text-green-600">
          Online Store
        </Link>

       
        <nav className="flex gap-6">
          <Link href="/" className="text-gray-600 hover:text-green-600">
            Trang chủ
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-green-600">
            Đăng nhập
          </Link>
          <Link href="/register" className="text-gray-600 hover:text-green-600">
            Đăng ký
          </Link>
        </nav>

        
        <Link href="/cart" className="text-gray-600 flex items-center justify-center hover:text-green-600">
        <Image 
          src="/images/shopping-cart.png"
          alt="Giỏ hàng"    
          width={20}
          height={20}   
          className="mr-2"   
             />
          Giỏ hàng
        </Link>

      </div>
    </header>
  );
}