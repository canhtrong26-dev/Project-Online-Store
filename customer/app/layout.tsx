import Header from '@/components/Header';  // TỰ TẠO
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Header /> 
        {children}
      </body>
    </html>
  );
}