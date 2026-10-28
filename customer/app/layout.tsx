import Header from '@/components/Header';  // TỰ TẠO
import './globals.css';
import { Toaster } from 'react-hot-toast';


export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen w-full bg-white relative text-gray-800">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(75, 85, 99, 0.08) 20px, rgba(75, 85, 99, 0.08) 21px),
              repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(107, 114, 128, 0.06) 30px, rgba(107, 114, 128, 0.06) 31px),
              repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(55, 65, 81, 0.05) 40px, rgba(55, 65, 81, 0.05) 41px),
              repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(31, 41, 55, 0.04) 35px, rgba(31, 41, 55, 0.04) 36px)
            `,
          }}
        />
        <div className="relative z-10">
          <Toaster position="top-right" />
          <Header />
            {children}
        </div>
      </body>
    </html>
  );
}


