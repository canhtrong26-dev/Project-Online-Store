'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login as loginAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: LoginForm) => {
    const res = await loginAPI(data);
    if (res.accessToken) {

      // Lưu token vào localStorage
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      toast.success('Đăng nhập thành công!');
      router.push('/');  // về trang chủ
    } else {
      toast.error(res.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <div>
          <input {...register('email')} placeholder="Email" className="w-full border p-2 rounded"/>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <input {...register('password')} type="password" placeholder="Mật khẩu" className="w-full border p-2 rounded"/>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>

      </form>

      <p className="text-center mt-4 text-sm">
        Chưa có tài khoản? <Link href="/register" className="text-green-600 hover:underline">Đăng ký</Link>
      </p>
    </div>
  );
}