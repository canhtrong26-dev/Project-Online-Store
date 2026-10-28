import Header from '@/components/Header';  // TỰ TẠO
import './globals.css';
import { Toaster } from 'react-hot-toast';


export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Toaster position="top-right" />
        <Header /> 
        {children}
      </body>
    </html>
  );
}