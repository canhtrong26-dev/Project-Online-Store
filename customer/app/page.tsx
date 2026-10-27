'use client';

import { useEffect, useState } from 'react';        
import { getProducts, getCategories } from '@/lib/api'; 
import Image from 'next/image';  

export default function Home() {
  const [products, setProducts] = useState([]);       
  const [categories, setCategories] = useState([]);   

  useEffect(() => {                                 
    getProducts().then(data => setProducts(data));
    getCategories().then(data => setCategories(data));
  }, []);

  return (
    <main className="max-w-full  mx-auto px-20 py-8">

     
      <h2 className="text-2xl font-bold mb-4">Danh mục</h2>
      <div className="flex gap-3 mb-8">
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
          >
            {cat.name}
          </button>
        ))}
      </div>

     
      <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
            <Image
              src={product.image_url}
              alt={product.name}
              width={300}
              height={160}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-green-600 font-bold">
              {product.price.toLocaleString()}đ
            </p>
            <button className="mt-5 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600">
              Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>

    </main>
  );
}