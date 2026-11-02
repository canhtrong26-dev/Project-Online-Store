'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

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
  const t = useTranslations('register');
  const locale = useLocale();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: RegisterForm) => {
    const res = await registerAPI(data);
    if (res.message === 'Đăng ký thành công!') {
      toast.success('Đăng ký thành công!');
      router.push(`/${locale}/login`);
    } else {
      toast.error(res.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">{t('title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input {...register('name')} placeholder={t('name')} className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"/>
          {errors.name && <p className="text-red-500 pt-2 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register('email')} placeholder={t('email')} className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"/>
          {errors.email && <p className="text-red-500 pt-2 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register('password')} type="password" placeholder={t('password')} className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"/>
          {errors.password && <p className="text-red-500 pt-2 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <input {...register('phone')} placeholder={t('phone')} className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"/>
          {errors.phone && <p className="text-red-500 pt-2 text-sm">{errors.phone.message}</p>}
        </div>
        <div>
          <input {...register('address')} placeholder={t('address')} className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"/>
          {errors.address && <p className="text-red-500 pt-2 text-sm">{errors.address.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isSubmitting ? '...' : t('submit')}
        </button>
      </form>
      <p className="text-center mt-4 text-sm dark:text-gray-300">
        {t('hasAccount')} <Link href={`/${locale}/login`} className="text-green-600 hover:underline">{t('login')}</Link>
      </p>
    </div>
  );
}