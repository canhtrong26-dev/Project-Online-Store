"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login as loginAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const tMsg = useTranslations("msg");
  const locale = useLocale();

  //token Cloudflare trả về sau khi người dùng qua ô xác minh
  const [turnstileToken, setTurnstileToken] = useState("");

  //móc để gọi lệnh reset ô xác minh khi đăng nhập sai
  const turnstileRef = useRef<TurnstileInstance>(null);

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
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  };

  return (
    <div className="max-w-md mx-4 sm:mx-auto mt-16 rounded-2xl border border-line bg-surface p-8">
     
      <h1 className="font-serif text-3xl font-normal tracking-tight mb-8">
        {t("title")}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("email")}
            placeholder={t("email")}
            className="field"
          />
          {errors.email && (
            <p className="text-negative text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("password")}
            type="password"
            placeholder={t("password")}
            className="field"
          />
          {errors.password && (
            <p className="text-negative text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary mt-2"
        >
          {isSubmitting ? "Đang đăng nhập..." : t("submit")}
        </button>
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          options={{ size: "flexible" }}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken("")}
        />
      </form>
      <p className="text-center mt-6 text-sm text-fg-2">
        {t("noAccount")}{" "}
        <Link
          href={`/${locale}/register`}
          className="text-accent underline-offset-4 hover:underline"
        >
          {t("register")}
        </Link>
      </p>
    </div>
  );
}
