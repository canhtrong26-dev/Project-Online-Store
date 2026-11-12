"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login as loginAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Script from "next/script";

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const tMsg = useTranslations("msg");
  const locale = useLocale();

  //đặt schema trong component để dùng được chuỗi đã dịch
  const schema = z.object({
    email: z.string().email(tMsg("errEmail")),
    password: z.string().min(6, tMsg("errPassword")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    //đi tìm ô ẩn mà Cloudflare tự chèn vào trang, lấy token trong đó

    const oAn = document.querySelector(
      'input[name="cf-turnstile-response"]',
    ) as HTMLInputElement | null;
    const turnstileToken = oAn?.value;

    //gửi lên backend: email + password (trải ra từ data) kèm token Turnstile
    //backend sẽ hỏi lại Cloudflare xem token có hợp lệ không (chống bot) rồi mới kiểm tra mật khẩu
    const res = await loginAPI({ ...data, turnstileToken });

    if (res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success(tMsg("loginSuccess"));
      router.push(`/${locale}`);
    } else {
      toast.error(res.message || tMsg("loginFailed"));
      //token chỉ dùng được 1 lần, phải làm mới ô xác minh để bấm lại được
      (window as any).turnstile?.reset();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow">
      <Script // tải thư viện vẽ ô xác minh của Cloudflare
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">
        {t("title")}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("email")}
            placeholder={t("email")}
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("password")}
            type="password"
            placeholder={t("password")}
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isSubmitting ? "Đang đăng nhập..." : t("submit")}
        </button>
        <div
          className="cf-turnstile "
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          data-size="flexible"
        />
      </form>
      <p className="text-center mt-4 text-sm dark:text-gray-300">
        {t("noAccount")}{" "}
        <Link
          href={`/${locale}/register`}
          className="text-green-600 hover:underline"
        >
          {t("register")}
        </Link>
      </p>
    </div>
  );
}
