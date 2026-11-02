'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'

function ProductDetailContent() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
  }, [id])

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find((item: any) => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`)
  }

  if (!product) return <p className="p-8">Đang tải...</p>

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="mb-4 text-green-600 hover:underline">← Quay lại</button>
      <div className="flex pt-20 gap-8">
        <Image src={product.image_url} alt={product.name} width={400} height={400} className=" object-cover w-1/2" />
        <div className="flex-1 pt-15">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-green-600 text-xl mb-4">{Number(product.price).toLocaleString()}đ</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <button onClick={addToCart} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </main>
  )
}

export default function ProductDetail() {
  return (
    <Suspense fallback={<p className="p-8">Đang tải...</p>}>
      <ProductDetailContent />
    </Suspense>
  )
}