'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createOrder } from '@/lib/api';
import toast from 'react-hot-toast';


const schema = z.object({
  name: z.string().min(1, 'Nhập tên đi'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  address: z.string().min(1, 'Nhập địa chỉ đi'),
});

type CheckoutForm = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    // Kiểm tra đã login chưa
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập trước!');
      router.push('/login');
      return;
    }

    // Lấy cart từ localStorage
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartData.length === 0) {
      toast.error('Giỏ hàng trống!');
      router.push('/');
      return;
    }
    setCart(cartData);
  }, []);

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onSubmit = async (data: CheckoutForm) => {
    const token = localStorage.getItem('accessToken')!;

    const orderData = {
      total,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    const res = await createOrder(orderData, token);

    if (res.id) {
      localStorage.removeItem('cart');  // xóa cart trong localStorage của trình duyệt
      toast.success('Đặt hàng thành công!');
      setTimeout(() => router.push('/'), 3000);  //redirect sau 3 giây
    } else {
      toast.error(res.message || 'Đặt hàng thất bại!');
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

     
      <div className="border rounded-lg p-4 mb-6">

        


        <h2 className="font-semibold mb-3">Đơn hàng của bạn:</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <span>{item.name} x{item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString()}đ</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3">
          <span>Tổng:</span>
          <span>{total.toLocaleString()}đ</span>
        </div>
      </div>

      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="font-semibold">Thông tin giao hàng:</h2>

        <div>
          <input {...register('name')} placeholder="Họ tên" className="w-full border p-2 rounded"/>
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <input {...register('phone')} placeholder="Số điện thoại" className="w-full border p-2 rounded"/>
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        <div>
          <input {...register('address')} placeholder="Địa chỉ" className="w-full border p-2 rounded"/>
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </form>
    </main>
  );
}