'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { BsArrowLeft } from 'react-icons/bs'

function ProductDetailContent() {
  const { id } = useParams()
  const router = useRouter()
  const t = useTranslations('product')
  const tMsg = useTranslations('msg')
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`)
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
     window.dispatchEvent(new Event('cart-updated')) //gọi lại hàm demLaiGio 
    toast.success(tMsg('addedToCart', { name: product.name }))
  }

  if (!product) return <p className="max-w-6xl mx-auto px-4 md:px-6 py-10 text-fg-3">{t('loading')}</p>

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <button onClick={() => router.back()} className="mb-8 inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg transition-colors">
        <BsArrowLeft size={16} /> {t('back')}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 md:items-center">
        <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: `var(--swatch-${(product.id % 5) + 1})` }}>
          <Image src={product.image_url} alt={product.name} width={800} height={1000} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="font-serif text-4xl font-normal tracking-tight leading-tight mb-4">{product.name}</h1>
          <p className="font-mono text-lg text-fg tabular-nums mb-6">{Number(product.price).toLocaleString()}đ</p>
          <p className="text-fg-2 leading-relaxed mb-8 max-w-prose">{product.description}</p>
          <button onClick={addToCart} className="btn-primary w-full md:w-auto md:px-10">
            {t('addToCart')}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function ProductDetail() {
  return (
    <Suspense fallback={<p className="max-w-6xl mx-auto px-4 md:px-6 py-10 text-fg-3">...</p>}>
      <ProductDetailContent />
    </Suspense>
  )
}