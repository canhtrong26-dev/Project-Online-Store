import type { ReactNode } from "react";
import Header from "@/components/Header";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
export const instant = false;
import Footer from "@/components/Footer";
import { Be_Vietnam_Pro, Newsreader, IBM_Plex_Mono } from "next/font/google";

//cả 3 font đều có bộ dấu tiếng Việt
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-be-vietnam",
});
const newsreader = Newsreader({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Online Store - Mua sắm thời trang",
  description:
    "Cửa hàng thời trang online - Áo, quần, giày, túi xách với giá tốt nhất",
  keywords: "thời trang, mua sắm, áo, quần, giày, túi xách",
  openGraph: {
    title: "Online Store",
    description: "Cửa hàng thời trang online",
    type: "website",
  },
};

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${beVietnam.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen w-full bg-bg text-fg font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          <NextIntlClientProvider messages={messages}>
            <div className="flex min-h-screen flex-col">
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "var(--surface)",
                    color: "var(--fg)",
                    border: "1px solid var(--line)",
                    borderRadius: "10px",
                    fontSize: "14px",
                  },
                }}
              />
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
