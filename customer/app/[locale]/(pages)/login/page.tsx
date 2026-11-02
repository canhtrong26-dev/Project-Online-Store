'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login as loginAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('login');
  const locale = useLocale();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: LoginForm) => {
    const res = await loginAPI(data);
    if (res.accessToken) {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      toast.success('Đăng nhập thành công!');
      router.push(`/${locale}`);
    } else {
      toast.error(res.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">{t('title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input {...register('email')} placeholder={t('email')} className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"/>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register('password')} type="password" placeholder={t('password')} className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"/>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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
        {t('noAccount')} <Link href={`/${locale}/register`} className="text-green-600 hover:underline">{t('register')}</Link>
      </p>
    </div>
  );
}