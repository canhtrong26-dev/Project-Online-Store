'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyOrders } from '@/lib/api';
import toast from 'react-hot-toast';

export default function OrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập trước!');
      router.push('/login');
      return;
    }
    const fetchOrders = async () => {
      const data = await getMyOrders(token);
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        toast.error(data.message || 'Có lỗi xảy ra!');
      }
    };
    fetchOrders();
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border dark:border-gray-700 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold dark:text-white">Đơn #{order.id}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            {order.OrderItems.map((item: any) => (
              <div key={item.id} className="flex justify-between py-1 text-sm border-b dark:border-gray-700">
                <span className="dark:text-gray-300">{item.Product.name} x{item.quantity}</span>
                <span className="dark:text-gray-300">{(item.price * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-3 dark:text-white">
              <span>Tổng:</span>
              <span>{Number(order.total).toLocaleString()}đ</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm px-2 py-1 rounded ${
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              }`}>
                {order.status === 'pending' ? 'Đang xử lý' : 'Hoàn thành'}
              </span>
            </div>
          </div>
        ))
      )}
    </main>
  );
}