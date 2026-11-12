'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('register');
  const tMsg = useTranslations('msg');
  const locale = useLocale();

  //đặt schema trong component để dùng được chuỗi đã dịch
  const schema = z.object({
    name: z.string().min(1, tMsg('errName')),
    email: z.string().email(tMsg('errEmail')),
    password: z.string().min(6, tMsg('errPassword')),
    phone: z.string().min(10, tMsg('errPhone')),
    address: z.string().min(1, tMsg('errAddress')),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: RegisterForm) => {
    const res = await registerAPI(data);
    if (res.message === 'Đăng ký thành công!') {
      toast.success(tMsg('registerSuccess'));
      router.push(`/${locale}/login`);
    } else {
      toast.error(tMsg('registerFailed'));
    }
  };

  return (
    <div className="max-w-md mx-4 sm:mx-auto mt-16 rounded-2xl border border-line bg-surface p-8">
      <h1 className="font-serif text-3xl font-normal tracking-tight mb-8">{t('title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input {...register('name')} placeholder={t('name')} className="field"/>
          {errors.name && <p className="text-negative text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register('email')} placeholder={t('email')} className="field"/>
          {errors.email && <p className="text-negative text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register('password')} type="password" placeholder={t('password')} className="field"/>
          {errors.password && <p className="text-negative text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <input {...register('phone')} placeholder={t('phone')} className="field"/>
          {errors.phone && <p className="text-negative text-sm mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <input {...register('address')} placeholder={t('address')} className="field"/>
          {errors.address && <p className="text-negative text-sm mt-1">{errors.address.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary mt-2"
        >
          {isSubmitting ? '...' : t('submit')}
        </button>
      </form>
      <p className="text-center mt-6 text-sm text-fg-2">
        {t('hasAccount')} <Link href={`/${locale}/login`} className="text-accent underline-offset-4 hover:underline">{t('login')}</Link>
      </p>
    </div>
  );
}