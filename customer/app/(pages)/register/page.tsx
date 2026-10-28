'use client';

import { useForm } from 'react-hook-form';        
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod';                           
import { register as registerAPI } from '@/lib/api'; 
import { useRouter } from 'next/navigation';        
import toast from 'react-hot-toast';               
import Link from 'next/link';                      


const schema = z.object({
  name: z.string().min(1, 'Nhập tên đi'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  address: z.string().min(1, 'Nhập địa chỉ đi'),
});

type RegisterForm = z.infer<typeof schema>;  

export default function RegisterPage() {
  const router = useRouter();  

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(schema)  
  });

  const onSubmit = async (data: RegisterForm) => {
    const res = await registerAPI(data);
    if (res.message === 'Đăng ký thành công!') {
      toast.success('Đăng ký thành công!');
      router.push('/login');  //huyển sang trang login
    } else {
      toast.error(res.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Đăng ký</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <div>
          <input {...register('name')} placeholder="Họ tên" className="w-full border p-2 rounded"/>
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <input {...register('email')} placeholder="Email" className="w-full border p-2 rounded"/>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <input {...register('password')} type="password" placeholder="Mật khẩu" className="w-full border p-2 rounded"/>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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
          {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
        </button>

      </form>

      <p className="text-center mt-4 text-sm">
        Đã có tài khoản? <Link href="/login" className="text-green-600 hover:underline">Đăng nhập</Link>
      </p>
    </div>
  );
}