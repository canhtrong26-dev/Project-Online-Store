"use client";

import { useEffect, useState } from "react";
import { getProducts, getCategories } from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  const tMsg = useTranslations("msg");
  const locale = useLocale();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); //danh mục được chọn 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");     
  const [searchCho, setSearchCho] = useState("");   //từ khóa tìm kiếm

  //chờ ngừng gõ 500ms rồi mới cập nhật từ khoá dùng để gọi API
  useEffect(() => {
    const dongHo = setTimeout(() => setSearchCho(search), 500);
    return () => clearTimeout(dongHo);
  }, [search]);

  //gọi lại API mỗi khi đổi trang hoặc đổi danh mục
  useEffect(() => {
    getProducts({ page: page, limit: 8, category_id: selectedCategory,  search: searchCho  }).then(
      (res) => {
        if (res && Array.isArray(res.data)) { //Array.isArray(res.data) phải là mảng vì nếu lỗi trả về message thì sẽ bị lỗi trắng trang
          setProducts(res.data); //danh sách sản phẩm để hiện ra lưới
          setTotalPages(res.totalPages);  //tổng số trang để vẽ ra nút 1 2 3..
        }
      },
    );
  }, [page, selectedCategory, searchCho]);

  //danh mục chỉ cần lấy 1 lần
  useEffect(() => {
    getCategories().then((data) => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id); //check xem sản phẩm này đã có trong giỏ chưa
    if (existingItem) { //nếu có thì tăng lên 1
      existingItem.quantity += 1; 
    } else {     //nếu chưa có thì thêm vào giỏ với các thông tin ở dưới 
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));  //sau khi tăng hoặc thêm đủ thì cất vào localstorage
    window.dispatchEvent(new Event("cart-updated"));  //phát tín hiệu để phần trong file header đếm lại số lượng trên icon nhỏ 
    toast.success(tMsg("addedToCart", { name: product.name }));
  };

  const tabClass = (active: boolean) =>
    `shrink-0 whitespace-nowrap h-9 px-4 text-sm inline-flex items-center gap-2 transition-colors ${
      active
        ? "bg-accent text-on-accent"
        : "text-fg-2 hover:bg-raised hover:text-fg"
    }`;

  //mỗi danh mục/sản phẩm lấy 1 màu "vải" theo id (xoay vòng 5 màu) -> cùng 1 sản phẩm luôn cùng màu ở mọi trang
  const swatch = (i: number) => `var(--swatch-${(i % 5) + 1})`;
  const dot = (i: number) => `var(--dot-${(i % 5) + 1})`;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <h2 className="font-serif text-4xl font-normal tracking-tight mb-6">
        {t("products")}
      </h2>
      <input //ô tìm kiếm sản phẩm home customer
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="w-full md:w-80 h-10 px-3 mb-6 border border-line bg-transparent text-fg placeholder:text-fg-3 focus:outline-none focus:border-accent"
      />

      <div className="flex gap-1 mb-10 overflow-x-auto pb-1 border-b border-line">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setPage(1);
          }}
          className={`${tabClass(selectedCategory === null)} mb-3`}
        >
          {t("all")}
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id); //biến nhớ user đang chọn danh mục nào ví dụ như: tất cả, quần, áo,..
              setPage(1);
            }}
            className={`${tabClass(selectedCategory === cat.id)} mb-3`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  selectedCategory === cat.id ? "currentColor" : dot(cat.id),
              }}
            />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {products.map((product: any) => (
          <div key={product.id} className="group flex flex-col">
            <Link href={`/${locale}/product/${product.id}`}>
              <div
                className="aspect-[4/5] overflow-hidden mb-3"
                style={{ backgroundColor: swatch(product.id) }}
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-sm text-fg line-clamp-2 group-hover:underline underline-offset-4 decoration-fg-3">
                {product.name}
              </h3>
            </Link>
            <p className="font-mono text-sm text-fg-2 tabular-nums mt-1 mb-3">
              {product.price.toLocaleString()}đ
            </p>
            <button
              onClick={() => addToCart(product)}
              className="btn-secondary mt-auto w-full text-xs sm:text-sm"
            >
              {t("addToCart")}
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-16">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            aria-label="Trang trước"
            className="h-9 w-9 text-fg-2 hover:bg-raised disabled:opacity-40 disabled:hover:bg-transparent"
          >
            &laquo;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (soTrang) => (
              <button
                key={soTrang}
                onClick={() => setPage(soTrang)}
                className={`h-9 w-9 font-mono text-sm tabular-nums transition-colors ${
                  page === soTrang
                    ? "bg-accent text-on-accent"
                    : "text-fg-2 hover:bg-raised"
                }`}
              >
                {soTrang}
              </button>
            ),
          )}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Trang sau"
            className="h-9 w-9 text-fg-2 hover:bg-raised disabled:opacity-40 disabled:hover:bg-transparent"
          >
            &raquo;
          </button>
        </div>
      )}
    </main>
  );
}
