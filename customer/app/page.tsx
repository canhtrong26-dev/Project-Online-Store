'use client';

import { useEffect, useState } from 'react';        
import { getProducts, getCategories } from '@/lib/api'; 
import Image from 'next/image';  
import toast from 'react-hot-toast'; 

export default function Home() {
  const [products, setProducts] = useState([]);       
  const [categories, setCategories] = useState([]);   
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {                                 
    getProducts().then(data => setProducts(data));
    getCategories().then(data => setCategories(data));
  }, []);



    const addToCart = (product: any) => {       
    const cart = JSON.parse(                    
      localStorage.getItem('cart') || '[]'    
    );

    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;               
    } else {
      cart.push({                               
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));  
    toast.success(<p>Đã thêm <b>{product.name}</b> vào giỏ hàng!</p>,);    
  };


  return (
    <main className="max-w-full  mx-auto px-20 py-8">
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full ${selectedCategory === null ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
        >
          Tất cả
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full ${selectedCategory === cat.id ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
     
      <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products
          .filter((product: any) =>

                selectedCategory === null || product.category_id === selectedCategory

          ).map((product: any) => (
          <div key={product.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow transition-transform transform hover:-translate-y-1">
            <Image
              src={product.image_url}
              alt={product.name}
              width={300}
              height={160}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-green-600 text-sm">
              {product.price.toLocaleString()}đ
            </p>
            <button
              onClick={() => addToCart(product)}
              className="mt-5 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600">  
              Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>

    </main>
  );
}