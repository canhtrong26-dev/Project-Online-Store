"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createOrder } from "@/lib/api";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";

//API hành chính Việt Nam, không cần đăng ký khoá
const API_DIA_CHI = "https://provinces.open-api.vn/api/v1";

type CheckoutForm = {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
};

type DonViHanhChinh = { code: number; name: string };

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("checkout");
  const tMsg = useTranslations("msg");
  const locale = useLocale();

  //đặt schema trong component để dùng được chuỗi đã dịch
  const schema = z.object({
    name: z.string().min(1, tMsg("errName")),
    phone: z.string().min(10, tMsg("errPhone")),
    province: z.string().min(1, tMsg("errProvince")),
    district: z.string().min(1, tMsg("errDistrict")),
    ward: z.string().min(1, tMsg("errWard")),
    detail: z.string().min(1, tMsg("errDetail")),
  });
  const [cart, setCart] = useState<any[]>([]);
  const [isOrdered, setIsOrdered] = useState(false);
  const [dsTinh, setDsTinh] = useState<DonViHanhChinh[]>([]);
  const [dsHuyen, setDsHuyen] = useState<DonViHanhChinh[]>([]);
  const [dsXa, setDsXa] = useState<DonViHanhChinh[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({ resolver: zodResolver(schema) });

  const maTinh = watch("province");
  const maHuyen = watch("district");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error(tMsg("pleaseLogin"));
      router.push(`/${locale}/login`);
      return;
    }
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartData.length === 0) {
      toast.error(tMsg("emptyCart"));
      router.push(`/${locale}`);
      return;
    }
    setCart(cartData);

    //điền sẵn thông tin của người đang đăng nhập
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      if (user.name) setValue("name", user.name);
      if (user.phone) setValue("phone", user.phone);
    }
  }, []);

  //lấy danh sách tỉnh 1 lần khi mở trang
  useEffect(() => {
    fetch(`${API_DIA_CHI}/p/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDsTinh(data);
      })
      .catch(() => toast.error(tMsg("loadProvinceFailed")));
  }, []);

  //đổi tỉnh thì tải lại danh sách huyện
  useEffect(() => {
    setValue("district", "");
    setValue("ward", "");
    setDsHuyen([]);
    setDsXa([]);
    if (!maTinh) return;

    fetch(`${API_DIA_CHI}/p/${maTinh}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDsHuyen(data.districts || []))
      .catch(() => toast.error(tMsg("loadDistrictFailed")));
  }, [maTinh]);

  //đổi huyện thì tải lại danh sách xã
  useEffect(() => {
    setValue("ward", "");
    setDsXa([]);
    if (!maHuyen) return;

    fetch(`${API_DIA_CHI}/d/${maHuyen}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDsXa(data.wards || []))
      .catch(() => toast.error(tMsg("loadWardFailed")));
  }, [maHuyen]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onSubmit = async (data: CheckoutForm) => {
    const token = localStorage.getItem("accessToken")!;

    //đổi mã số sang tên để ghép thành địa chỉ đầy đủ
    const tenTinh =
      dsTinh.find((x) => String(x.code) === data.province)?.name || "";
    const tenHuyen =
      dsHuyen.find((x) => String(x.code) === data.district)?.name || "";
    const tenXa = dsXa.find((x) => String(x.code) === data.ward)?.name || "";
    const address = `${data.detail}, ${tenXa}, ${tenHuyen}, ${tenTinh}`;

    const orderData = {
      total,
      name: data.name,
      phone: data.phone,
      address,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    const res = await createOrder(orderData, token);
    if (res.id) {
      setIsOrdered(true);
      localStorage.removeItem("cart");
      toast.success(tMsg("orderSuccess"));
      setTimeout(() => router.push(`/${locale}`), 2000);
    } else {
      toast.error(res.message || tMsg("orderFailed"));
    }
  };

  const classO =
    "w-full border dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded";

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">{t("title")}</h1>

      <div className="border dark:border-gray-700 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3 dark:text-white">
          {t("yourOrder")}:
        </h2>
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between py-2 border-b dark:border-gray-700"
          >
            <span className="dark:text-gray-300">
              {item.name} x{item.quantity}
            </span>
            <span className="dark:text-gray-300">
              {(item.price * item.quantity).toLocaleString()}đ
            </span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3 dark:text-white">
          <span>{t("total")}:</span>
          <span>{total.toLocaleString()}đ</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="font-semibold dark:text-white">{t("shippingInfo")}:</h2>

        <div>
          <input
            {...register("name")}
            placeholder={t("name")}
            className={classO}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone")}
            placeholder={t("phone")}
            className={classO}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <select
            {...register("province")}
            aria-label={t("province")}
            className={classO}
          >
            <option value="">{t("chooseProvince")}</option>
            {dsTinh.map((tinh) => (
              <option key={tinh.code} value={tinh.code}>
                {tinh.name}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-red-500 text-sm">{errors.province.message}</p>
          )}
        </div>

        <div>
          <select
            {...register("district")}
            aria-label={t("district")}
            className={classO}
            disabled={!maTinh}
          >
            <option value="">{t("chooseDistrict")}</option>
            {dsHuyen.map((huyen) => (
              <option key={huyen.code} value={huyen.code}>
                {huyen.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm">{errors.district.message}</p>
          )}
        </div>

        <div>
          <select
            {...register("ward")}
            aria-label={t("ward")}
            className={classO}
            disabled={!maHuyen}
          >
            <option value="">{t("chooseWard")}</option>
            {dsXa.map((xa) => (
              <option key={xa.code} value={xa.code}>
                {xa.name}
              </option>
            ))}
          </select>
          {errors.ward && (
            <p className="text-red-500 text-sm">{errors.ward.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("detail")}
            placeholder={t("detail")}
            className={classO}
          />
          {errors.detail && (
            <p className="text-red-500 text-sm">{errors.detail.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isOrdered}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isSubmitting ? "..." : t("submit")}
        </button>
      </form>
    </main>
  );
}
